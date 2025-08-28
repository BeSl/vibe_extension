import * as assert from 'assert';
import * as vscode from 'vscode';
import { ConfigTreeDataProvider, ConfigTreeItem } from '../../configTreeProvider';
import { ConfigObjectParser, ConfigObject } from '../../configParser';

suite('ConfigTreeProvider Test Suite', () => {
    let mockContext: vscode.ExtensionContext;
    let parser: ConfigObjectParser;
    let provider: ConfigTreeDataProvider;

    setup(() => {
        // Create mock extension context
        mockContext = {
            subscriptions: [],
            extensionUri: vscode.Uri.file('/mock/path'),
            extensionPath: '/mock/path',
            storagePath: '/mock/storage',
            globalStoragePath: '/mock/global/storage',
            workspaceState: {
                get: () => undefined,
                update: () => Promise.resolve(),
                keys: () => []
            },
            globalState: {
                get: () => undefined,
                update: () => Promise.resolve(),
                keys: () => [],
                setKeysForSync: () => {}
            },
            asAbsolutePath: (relativePath: string) => `/mock/path/${relativePath}`,
            logUri: vscode.Uri.file('/mock/log'),
            logPath: '/mock/log'
        } as any;

        parser = new ConfigObjectParser();
        provider = new ConfigTreeDataProvider(mockContext, parser);
    });

    test('ConfigTreeDataProvider should initialize', () => {
        assert.ok(provider);
    });

    test('getVisibleItemsCount should return number', () => {
        const count = provider.getVisibleItemsCount();
        assert.ok(typeof count === 'number');
        assert.ok(count >= 0);
    });

    test('search should handle empty string', () => {
        try {
            provider.search('');
            // Should not throw error
        } catch (error) {
            assert.fail(`Search should handle empty string: ${error}`);
        }
    });

    test('search should handle search term', () => {
        try {
            provider.search('test');
            // Should not throw error
        } catch (error) {
            assert.fail(`Search should handle search term: ${error}`);
        }
    });

    test('clearSearch should reset search', () => {
        try {
            provider.search('test');
            provider.clearSearch();
            // Should not throw error
        } catch (error) {
            assert.fail(`Clear search should work: ${error}`);
        }
    });

    test('refresh should not throw error', () => {
        try {
            provider.refresh();
            // Should not throw error
        } catch (error) {
            assert.fail(`Refresh should not throw error: ${error}`);
        }
    });

    test('ConfigTreeItem should initialize with config object', () => {
        const mockConfigObject: ConfigObject = {
            name: 'TestObject',
            displayName: 'Test Object',
            type: 'Catalog',
            filePath: '/mock/path/test.xml'
        };

        const treeItem = new ConfigTreeItem(mockConfigObject, vscode.TreeItemCollapsibleState.None);
        
        assert.ok(treeItem);
        assert.strictEqual(treeItem.label, 'Test Object');
        assert.strictEqual(treeItem.collapsibleState, vscode.TreeItemCollapsibleState.None);
    });

    test('ConfigTreeItem should handle folder type', () => {
        const mockConfigObject: ConfigObject = {
            name: 'TestFolder',
            displayName: 'Test Folder',
            type: 'folder',
            filePath: '/mock/path',
            children: []
        };

        const treeItem = new ConfigTreeItem(mockConfigObject, vscode.TreeItemCollapsibleState.Collapsed);
        
        assert.ok(treeItem);
        assert.strictEqual(treeItem.contextValue, 'folder');
    });

    test('ConfigTreeItem should handle help type', () => {
        const mockConfigObject: ConfigObject = {
            name: 'help',
            displayName: 'Help Message',
            type: 'help',
            filePath: ''
        };

        const treeItem = new ConfigTreeItem(mockConfigObject, vscode.TreeItemCollapsibleState.None);
        
        assert.ok(treeItem);
        assert.strictEqual(treeItem.contextValue, 'help');
        assert.ok(treeItem.command);
        assert.strictEqual(treeItem.command.command, '1cConfigViewer.showHelp');
    });
});