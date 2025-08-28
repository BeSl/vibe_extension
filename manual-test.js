/**
 * Manual Test Script for 1C Configuration Viewer Extension
 * 
 * This script can be run in VS Code's Developer Console to test the extension
 * Commands to run in Developer Console (F12 -> Console):
 */

// Test 1: Check if extension is loaded
console.log('=== Testing Extension Registration ===');
const extension = vscode.extensions.getExtension('raschiren.1c-config-viewer');
console.log('Extension found:', !!extension);
console.log('Extension active:', extension?.isActive);

// Test 2: Check command registration
const expectedCommands = [
    '1cConfigViewer.showConfigTree',
    '1cConfigViewer.refreshTree',
    '1cConfigViewer.openObjectDetails',
    '1cConfigViewer.searchObjects',
    '1cConfigViewer.clearSearch',
    '1cConfigViewer.scanConfigurations',
    '1cConfigViewer.showHelp'
];

vscode.commands.getCommands(true).then(commands => {
    console.log('=== Testing Command Registration ===');
    const ourCommands = commands.filter(cmd => cmd.startsWith('1cConfigViewer.'));
    console.log(`Found ${ourCommands.length} commands:`, ourCommands);
    
    expectedCommands.forEach(cmd => {
        const registered = ourCommands.includes(cmd);
        console.log(`${cmd}: ${registered ? '✓' : '✗'}`);
    });
});

// Test 3: Test command execution
console.log('=== Testing Command Execution ===');
vscode.commands.executeCommand('1cConfigViewer.refreshTree').then(() => {
    console.log('✓ refreshTree executed successfully');
}).catch(err => {
    console.error('✗ refreshTree failed:', err);
});

vscode.commands.executeCommand('1cConfigViewer.clearSearch').then(() => {
    console.log('✓ clearSearch executed successfully');
}).catch(err => {
    console.error('✗ clearSearch failed:', err);
});

// Test 4: Check tree view registration
try {
    const treeView = vscode.window.createTreeView('1cConfigTreeView', {
        treeDataProvider: {
            getTreeItem: () => new vscode.TreeItem('test'),
            getChildren: () => []
        }
    });
    console.log('✓ Tree view can be created');
    treeView.dispose();
} catch (err) {
    console.error('✗ Tree view creation failed:', err);
}

/*
To use this test:
1. Install the extension
2. Open VS Code Developer Tools (Help -> Toggle Developer Tools)
3. Go to Console tab
4. Paste and run the code above
5. Check results
*/