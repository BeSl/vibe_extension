import * as vscode from 'vscode';
import { ConfigTreeDataProvider } from './configTreeProvider';
import { ConfigObjectParser } from './configParser';
import { ObjectDetailsPanel } from './objectDetailsPanel';

let configTreeProvider: ConfigTreeDataProvider;

export function activate(context: vscode.ExtensionContext) {
    console.log('1C Configuration Viewer extension is now active');

    // Initialize the configuration parser
    const parser = new ConfigObjectParser();
    
    // Initialize the tree data provider
    configTreeProvider = new ConfigTreeDataProvider(context, parser);

    // Register the tree data provider FIRST
    const treeView = vscode.window.createTreeView('1cConfigTreeView', {
        treeDataProvider: configTreeProvider,
        showCollapseAll: true
    });
    context.subscriptions.push(treeView);

    // Register commands IMMEDIATELY and SYNCHRONOUSLY
    console.log('Registering commands...');

    const showConfigTreeCommand = vscode.commands.registerCommand('1cConfigViewer.showConfigTree', () => {
        console.log('Executing showConfigTree command');
        vscode.commands.executeCommand('workbench.view.extension.1cConfigViewer');
        configTreeProvider.refresh();
    });

    const refreshTreeCommand = vscode.commands.registerCommand('1cConfigViewer.refreshTree', () => {
        console.log('Executing refreshTree command');
        configTreeProvider.refresh();
        vscode.window.showInformationMessage('Configuration tree refreshed!');
    });

    const openObjectDetailsCommand = vscode.commands.registerCommand('1cConfigViewer.openObjectDetails', (item) => {
        console.log('Executing openObjectDetails command for:', item);
        ObjectDetailsPanel.show(context, item);
    });

    const searchObjectsCommand = vscode.commands.registerCommand('1cConfigViewer.searchObjects', async () => {
        console.log('Executing searchObjects command');
        const searchTerm = await vscode.window.showInputBox({
            prompt: 'Enter search term for 1C objects',
            placeHolder: 'Object name, type, or synonym...'
        });
        
        if (searchTerm && searchTerm.trim()) {
            const trimmedSearch = searchTerm.trim();
            configTreeProvider.search(trimmedSearch);
            
            setTimeout(() => {
                const visibleItems = configTreeProvider.getVisibleItemsCount();
                if (visibleItems > 0) {
                    vscode.window.showInformationMessage(`Found ${visibleItems} items matching '${trimmedSearch}'`);
                } else {
                    vscode.window.showWarningMessage(`No items found matching '${trimmedSearch}'. Try a different search term.`);
                }
            }, 100);
        } else if (searchTerm === '') {
            configTreeProvider.clearSearch();
            vscode.window.showInformationMessage('Search cleared');
        }
    });

    const clearSearchCommand = vscode.commands.registerCommand('1cConfigViewer.clearSearch', () => {
        console.log('Executing clearSearch command');
        configTreeProvider.clearSearch();
        vscode.window.showInformationMessage('Search filter cleared!');
    });

    const scanConfigurationsCommand = vscode.commands.registerCommand('1cConfigViewer.scanConfigurations', async () => {
        console.log('Executing scanConfigurations command');
        vscode.window.showInformationMessage('Scanning workspace for 1C configurations...');
        await checkFor1CConfig();
        configTreeProvider.refresh();
        vscode.window.showInformationMessage('Scan completed!');
    });

    const showHelpCommand = vscode.commands.registerCommand('1cConfigViewer.showHelp', async () => {
        console.log('Executing showHelp command');
        const hasConfigs = configTreeProvider && configTreeProvider.getVisibleItemsCount() > 0;
        
        let message = hasConfigs 
            ? '1C Configuration Viewer is active. Choose an action:'
            : 'No 1C Configuration found in the workspace. What would you like to do?';
        
        const choice = await vscode.window.showInformationMessage(
            message,
            'Scan for Configurations',
            'Open Command Palette',
            'Show Debug Info',
            'Learn More'
        );
        
        switch (choice) {
            case 'Scan for Configurations':
                await vscode.commands.executeCommand('1cConfigViewer.scanConfigurations');
                break;
            case 'Open Command Palette':
                await vscode.commands.executeCommand('workbench.action.showCommands', '1C:');
                break;
            case 'Show Debug Info':
                const registeredCommands = await vscode.commands.getCommands(true);
                const ourCommands = registeredCommands.filter(cmd => cmd.startsWith('1cConfigViewer.'));
                const status = `Extension Status:\n• Registered commands: ${ourCommands.length}\n• Tree provider: ${configTreeProvider ? 'Active' : 'Inactive'}\n• Visible items: ${configTreeProvider ? configTreeProvider.getVisibleItemsCount() : 0}`;
                vscode.window.showInformationMessage(status);
                console.log('Commands:', ourCommands);
                break;
            case 'Learn More':
                vscode.env.openExternal(vscode.Uri.parse('https://github.com/raschiren/1c-config-viewer'));
                break;
        }
    });

    // Add all commands to subscriptions IMMEDIATELY
    context.subscriptions.push(
        showConfigTreeCommand,
        refreshTreeCommand,
        openObjectDetailsCommand,
        searchObjectsCommand,
        clearSearchCommand,
        scanConfigurationsCommand,
        showHelpCommand
    );
    
    console.log('✓ All 7 commands registered and subscribed');

    // Verify all commands are registered
    verifyCommandRegistration();

    // Watch for file changes in the workspace
    const fileWatcher = vscode.workspace.createFileSystemWatcher('**/Configuration.xml');
    fileWatcher.onDidChange(() => configTreeProvider.refresh());
    fileWatcher.onDidCreate(async () => {
        await checkFor1CConfig();
        configTreeProvider.refresh();
    });
    fileWatcher.onDidDelete(async () => {
        await checkFor1CConfig();
        configTreeProvider.refresh();
    });
    context.subscriptions.push(fileWatcher);

    // Set context and check for configurations AFTER command registration
    vscode.commands.executeCommand('setContext', '1cConfigViewer.hasConfig', true);
    
    // Perform async initialization without blocking command registration
    checkFor1CConfig().catch(error => {
        console.error('Error during initial config check:', error);
    });
    
    // Also check when workspace folders change
    vscode.workspace.onDidChangeWorkspaceFolders(async () => {
        await checkFor1CConfig();
    });
    
    console.log('✓ Extension activation completed successfully');
}



async function checkFor1CConfig() {
    try {
        // Search for Configuration.xml files in the workspace
        const configFiles = await vscode.workspace.findFiles('**/Configuration.xml', '**/node_modules/**', 10);
        const hasConfig = configFiles.length > 0;
        
        vscode.commands.executeCommand('setContext', '1cConfigViewer.hasConfig', hasConfig);
        
        if (hasConfig) {
            const configCount = configFiles.length;
            const message = configCount === 1 
                ? `1C Configuration detected in: ${getRelativePath(configFiles[0].fsPath)}! Use the 1C Configuration view to explore objects.`
                : `${configCount} 1C Configurations detected! Use the 1C Configuration view to explore objects.`;
            
            vscode.window.showInformationMessage(message);
            
            // Auto-refresh the tree when configurations are found
            if (configTreeProvider) {
                configTreeProvider.refresh();
            }
            
            // Log found configurations for debugging
            console.log('1C Configurations found:', configFiles.map(f => f.fsPath));
        } else {
            // Perform deeper search in case files are nested
            await performDeepConfigSearch();
        }
    } catch (error) {
        console.error('Error checking for 1C configurations:', error);
    }
}

function getRelativePath(fullPath: string): string {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
        for (const folder of workspaceFolders) {
            if (fullPath.startsWith(folder.uri.fsPath)) {
                return fullPath.substring(folder.uri.fsPath.length + 1);
            }
        }
    }
    return fullPath;
}

async function performDeepConfigSearch() {
    try {
        // Search for typical 1C structure patterns
        const patterns = [
            '**/Catalogs/**/*.xml',
            '**/Documents/**/*.xml',
            '**/Reports/**/*.xml',
            '**/DataProcessors/**/*.xml',
            '**/CommonModules/**/*.xml'
        ];
        
        for (const pattern of patterns) {
            const files = await vscode.workspace.findFiles(pattern, '**/node_modules/**', 5);
            if (files.length > 0) {
                // Found 1C-like structure, look for Configuration.xml in parent directories
                for (const file of files) {
                    const configPath = await findConfigurationXmlInParents(file.fsPath);
                    if (configPath) {
                        vscode.window.showInformationMessage(
                            `1C Configuration structure detected in: ${getRelativePath(configPath)}! ` +
                            'Configuration.xml might be missing. Use the 1C Configuration view to explore available objects.'
                        );
                        vscode.commands.executeCommand('setContext', '1cConfigViewer.hasConfig', true);
                        if (configTreeProvider) {
                            configTreeProvider.refresh();
                        }
                        return;
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error performing deep config search:', error);
    }
}

async function findConfigurationXmlInParents(filePath: string): Promise<string | null> {
    const path = require('path');
    const fs = require('fs');
    
    let currentDir = path.dirname(filePath);
    const workspaceFolders = vscode.workspace.workspaceFolders;
    
    if (!workspaceFolders) {
        return null;
    }
    
    const workspaceRoot = workspaceFolders[0].uri.fsPath;
    
    // Search up to 5 levels or until workspace root
    for (let i = 0; i < 5 && currentDir.startsWith(workspaceRoot); i++) {
        const configPath = path.join(currentDir, 'Configuration.xml');
        try {
            if (fs.existsSync(configPath)) {
                return currentDir;
            }
        } catch (error) {
            // Continue searching
        }
        
        const parentDir = path.dirname(currentDir);
        if (parentDir === currentDir) {
            break; // Reached root
        }
        currentDir = parentDir;
    }
    
    return null;
}

/**
 * Verify all expected commands are properly registered
 */
async function verifyCommandRegistration() {
    try {
        const expectedCommands = [
            '1cConfigViewer.showConfigTree',
            '1cConfigViewer.refreshTree',
            '1cConfigViewer.openObjectDetails', 
            '1cConfigViewer.searchObjects',
            '1cConfigViewer.clearSearch',
            '1cConfigViewer.scanConfigurations',
            '1cConfigViewer.showHelp'
        ];

        // Wait a bit for commands to be fully registered
        setTimeout(async () => {
            const registeredCommands = await vscode.commands.getCommands(true);
            const ourCommands = registeredCommands.filter(cmd => cmd.startsWith('1cConfigViewer.'));
            
            let allRegistered = true;
            let status = 'Command Registration Status:\n';
            
            for (const cmd of expectedCommands) {
                const isRegistered = ourCommands.includes(cmd);
                status += `• ${cmd}: ${isRegistered ? '✓ Registered' : '✗ MISSING'}\n`;
                if (!isRegistered) {
                    allRegistered = false;
                }
            }
            
            status += `\nTotal registered: ${ourCommands.length}/${expectedCommands.length}`;
            console.log(status);
            
            if (!allRegistered) {
                console.error('Some commands are not properly registered!');
                vscode.window.showWarningMessage('Some 1C Configuration Viewer commands are not properly registered. Check console for details.');
            } else {
                console.log('✓ All commands verified successfully');
            }
        }, 1000);
    } catch (error) {
        console.error('Error verifying command registration:', error);
    }
}

export function deactivate() {
    console.log('1C Configuration Viewer extension is deactivated');
}