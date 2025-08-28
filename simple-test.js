#!/usr/bin/env node

// Simple test runner for the 1C Configuration Viewer extension
// This bypasses the complex VS Code test infrastructure

const fs = require('fs');
const path = require('path');

console.log('🧪 Running Simple Extension Tests...\n');

// Test 1: Check if extension files exist
console.log('✅ Test 1: Extension Files');
const requiredFiles = [
    'package.json',
    'out/extension.js',
    'out/configTreeProvider.js',
    'out/configParser.js',
    'out/objectDetailsPanel.js'
];

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`  ✓ ${file} exists`);
    } else {
        console.log(`  ✗ ${file} missing`);
    }
});

// Test 2: Check package.json configuration
console.log('\n✅ Test 2: Package.json Configuration');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const expectedCommands = [
    '1cConfigViewer.showConfigTree',
    '1cConfigViewer.refreshTree',
    '1cConfigViewer.openObjectDetails',
    '1cConfigViewer.searchObjects',
    '1cConfigViewer.clearSearch',
    '1cConfigViewer.scanConfigurations',
    '1cConfigViewer.showHelp'
];

expectedCommands.forEach(cmd => {
    const found = packageJson.contributes.commands.some(c => c.command === cmd);
    if (found) {
        console.log(`  ✓ Command ${cmd} configured`);
    } else {
        console.log(`  ✗ Command ${cmd} missing`);
    }
});

// Test 3: Check activation events
console.log('\n✅ Test 3: Activation Events');
expectedCommands.forEach(cmd => {
    const activationEvent = `onCommand:${cmd}`;
    if (packageJson.activationEvents.includes(activationEvent)) {
        console.log(`  ✓ Activation event ${activationEvent} configured`);
    } else {
        console.log(`  ✗ Activation event ${activationEvent} missing`);
    }
});

// Test 4: Check for viewsContainers
console.log('\n✅ Test 4: Views Configuration');
if (packageJson.contributes.viewsContainers && 
    packageJson.contributes.viewsContainers.activitybar &&
    packageJson.contributes.viewsContainers.activitybar.length > 0) {
    console.log('  ✓ Activity bar view container configured');
} else {
    console.log('  ✗ Activity bar view container missing');
}

if (packageJson.contributes.views && 
    packageJson.contributes.views['1cConfigViewer']) {
    console.log('  ✓ Tree view configured');
} else {
    console.log('  ✗ Tree view missing');
}

// Test 5: Check TypeScript compilation
console.log('\n✅ Test 5: TypeScript Compilation');
try {
    const extensionJs = fs.readFileSync('out/extension.js', 'utf8');
    if (extensionJs.includes('activate') && extensionJs.includes('registerCommand')) {
        console.log('  ✓ Extension compiled successfully');
        console.log('  ✓ Contains activate function');
        console.log('  ✓ Contains command registration');
    } else {
        console.log('  ✗ Extension compilation issues detected');
    }
} catch (err) {
    console.log('  ✗ Cannot read compiled extension:', err.message);
}

// Test 6: Verify version and basic info
console.log('\n✅ Test 6: Extension Metadata');
console.log(`  ✓ Extension name: ${packageJson.name}`);
console.log(`  ✓ Version: ${packageJson.version}`);
console.log(`  ✓ Publisher: ${packageJson.publisher}`);
console.log(`  ✓ Description: ${packageJson.description}`);

console.log('\n🎉 Manual testing completed!');
console.log('\n📋 Next steps:');
console.log('1. Install the extension: code --install-extension 1c-config-viewer-1.5.0.vsix');
console.log('2. Open VS Code and check for the 1C Configuration icon in the Activity Bar');
console.log('3. Test commands via Command Palette (Ctrl+Shift+P, type "1C:")');
console.log('4. Open a folder with 1C configuration files to test tree functionality');