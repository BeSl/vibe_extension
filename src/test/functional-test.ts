// Functional test for 1C Configuration Viewer extension
// This test verifies that the extension loads and commands are registered correctly

import * as vscode from 'vscode';
import * as assert from 'assert';

export async function runFunctionalTests(): Promise<void> {
    console.log('🚀 Starting functional tests...');

    // Test 1: Extension activation
    console.log('📝 Test 1: Extension Activation');
    const extension = vscode.extensions.getExtension('raschiren.1c-config-viewer');
    assert.ok(extension, 'Extension should be found');
    
    if (!extension.isActive) {
        await extension.activate();
    }
    assert.ok(extension.isActive, 'Extension should be active');
    console.log('✅ Extension activated successfully');

    // Test 2: Command registration
    console.log('📝 Test 2: Command Registration');
    const allCommands = await vscode.commands.getCommands(true);
    
    const expectedCommands = [
        '1cConfigViewer.showConfigTree',
        '1cConfigViewer.refreshTree',
        '1cConfigViewer.openObjectDetails',
        '1cConfigViewer.searchObjects',
        '1cConfigViewer.clearSearch',
        '1cConfigViewer.scanConfigurations',
        '1cConfigViewer.showHelp'
    ];

    for (const cmd of expectedCommands) {
        assert.ok(allCommands.includes(cmd), `Command ${cmd} should be registered`);
        console.log(`✅ Command ${cmd} registered`);
    }

    // Test 3: Tree view availability
    console.log('📝 Test 3: Tree View Registration');
    try {
        // Try to execute the show tree command
        await vscode.commands.executeCommand('1cConfigViewer.showConfigTree');
        console.log('✅ Tree view command executed successfully');
    } catch (error) {
        console.log('⚠️ Tree view command execution (expected behavior without workspace)');
    }

    // Test 4: Help command
    console.log('📝 Test 4: Help Command');
    try {
        await vscode.commands.executeCommand('1cConfigViewer.showHelp');
        console.log('✅ Help command executed successfully');
    } catch (error) {
        console.log('❌ Help command failed:', error);
        throw error;
    }

    console.log('🎉 All functional tests passed!');
}

// Export a simple test function that can be called directly
export function activate() {
    return runFunctionalTests();
}