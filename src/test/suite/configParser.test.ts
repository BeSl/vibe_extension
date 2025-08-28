import * as assert from 'assert';
import * as vscode from 'vscode';
import { ConfigObjectParser } from '../../configParser';

suite('ConfigParser Test Suite', () => {

    test('ConfigObjectParser should initialize', () => {
        const parser = new ConfigObjectParser();
        assert.ok(parser);
    });

    test('parseWorkspace should return array', async () => {
        const parser = new ConfigObjectParser();
        const result = await parser.parseWorkspace();
        assert.ok(Array.isArray(result));
    });

    test('parseWorkspace should handle empty workspace', async () => {
        const parser = new ConfigObjectParser();
        
        // Mock workspace to have no folders
        const originalWorkspaceFolders = vscode.workspace.workspaceFolders;
        Object.defineProperty(vscode.workspace, 'workspaceFolders', {
            value: undefined,
            writable: true
        });

        try {
            const result = await parser.parseWorkspace();
            assert.ok(Array.isArray(result));
            assert.strictEqual(result.length, 0);
        } finally {
            // Restore original workspace folders
            Object.defineProperty(vscode.workspace, 'workspaceFolders', {
                value: originalWorkspaceFolders,
                writable: true
            });
        }
    });

    test('getObjectTypes should return valid object types', () => {
        const parser = new ConfigObjectParser();
        // Access private method for testing
        const objectTypes = (parser as any).getObjectTypes();
        
        assert.ok(Array.isArray(objectTypes));
        assert.ok(objectTypes.length > 0);
        
        // Check structure
        const firstType = objectTypes[0];
        assert.ok(firstType.folder);
        assert.ok(firstType.type);
        assert.ok(firstType.icon);
    });

    test('getLocalizedName should return translations', () => {
        const parser = new ConfigObjectParser();
        // Access private method for testing
        const localizedName = (parser as any).getLocalizedName('Catalogs');
        
        assert.strictEqual(localizedName, 'Справочники');
    });

    test('getLocalizedName should return original for unknown names', () => {
        const parser = new ConfigObjectParser();
        // Access private method for testing
        const localizedName = (parser as any).getLocalizedName('UnknownType');
        
        assert.strictEqual(localizedName, 'UnknownType');
    });
});