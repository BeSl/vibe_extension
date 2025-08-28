import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('raschiren.1c-config-viewer'));
    });

    test('Extension should activate', async () => {
        const extension = vscode.extensions.getExtension('raschiren.1c-config-viewer');
        assert.ok(extension);
        
        if (!extension!.isActive) {
            await extension!.activate();
        }
        
        assert.strictEqual(extension!.isActive, true);
    });

    test('All commands should be registered', async () => {
        const extension = vscode.extensions.getExtension('raschiren.1c-config-viewer');
        assert.ok(extension);
        
        if (!extension!.isActive) {
            await extension!.activate();
        }

        const commands = await vscode.commands.getCommands(true);
        const expectedCommands = [
            '1cConfigViewer.showConfigTree',
            '1cConfigViewer.refreshTree', 
            '1cConfigViewer.openObjectDetails',
            '1cConfigViewer.searchObjects',
            '1cConfigViewer.clearSearch',
            '1cConfigViewer.scanConfigurations',
            '1cConfigViewer.showHelp'
        ];

        for (const expectedCommand of expectedCommands) {
            assert.ok(
                commands.includes(expectedCommand),
                `Command ${expectedCommand} should be registered`
            );
        }
    });

    test('Commands should execute without error', async () => {
        const extension = vscode.extensions.getExtension('raschiren.1c-config-viewer');
        assert.ok(extension);
        
        if (!extension!.isActive) {
            await extension!.activate();
        }

        // Test basic commands that should not throw errors
        try {
            await vscode.commands.executeCommand('1cConfigViewer.refreshTree');
            await vscode.commands.executeCommand('1cConfigViewer.clearSearch');
            await vscode.commands.executeCommand('1cConfigViewer.showConfigTree');
        } catch (error) {
            assert.fail(`Commands should execute without error: ${error}`);
        }
    });

    test('Tree view should be registered', async () => {
        const extension = vscode.extensions.getExtension('raschiren.1c-config-viewer');
        assert.ok(extension);
        
        if (!extension!.isActive) {
            await extension!.activate();
        }

        // Check if tree view is accessible
        const treeView = vscode.window.createTreeView('1cConfigTreeView', {
            treeDataProvider: { getTreeItem: () => null, getChildren: () => [] }
        });
        
        assert.ok(treeView);
        treeView.dispose();
    });

    test('Search command should handle empty input', async () => {
        const extension = vscode.extensions.getExtension('raschiren.1c-config-viewer');
        assert.ok(extension);
        
        if (!extension!.isActive) {
            await extension!.activate();
        }

        // Mock the input box to return empty string
        const originalShowInputBox = vscode.window.showInputBox;
        vscode.window.showInputBox = async () => '';

        try {
            await vscode.commands.executeCommand('1cConfigViewer.searchObjects');
            // Should not throw error
        } catch (error) {
            assert.fail(`Search command should handle empty input: ${error}`);
        } finally {
            vscode.window.showInputBox = originalShowInputBox;
        }
    });

    test('Scan command should complete', async () => {
        const extension = vscode.extensions.getExtension('raschiren.1c-config-viewer');
        assert.ok(extension);
        
        if (!extension!.isActive) {
            await extension!.activate();
        }

        try {
            await vscode.commands.executeCommand('1cConfigViewer.scanConfigurations');
            // Should complete without error even if no configs found
        } catch (error) {
            assert.fail(`Scan command should complete: ${error}`);
        }
    });
});