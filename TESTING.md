# Installation and Testing Guide

## Quick Start

### 1. Install the Extension

**Option A: From Source (Development)**
1. Copy the entire `vscode-1c-config-viewer` folder to your VSCode extensions directory:
   - Windows: `%USERPROFILE%\.vscode\extensions\1c-config-viewer-1.0.0\`
   - macOS: `~/.vscode/extensions/1c-config-viewer-1.0.0/`
   - Linux: `~/.vscode/extensions/1c-config-viewer-1.0.0/`

**Option B: Package and Install**
1. Install vsce (if not already installed): `npm install -g vsce`
2. In the extension directory: `vsce package`
3. Install the .vsix file: `code --install-extension 1c-config-viewer-1.0.0.vsix`

### 2. Test with the Demo Configuration

1. Open VSCode
2. File → Open Folder → Select the `demo` folder from this project
3. The extension should automatically detect the 1C configuration
4. Look for the "1C Configuration" panel in the Explorer sidebar

### 3. Verify Installation

Check that the extension is working:
- ✅ "1C Configuration" appears in Explorer panel
- ✅ Tree shows object categories (Справочники, Документы, etc.)
- ✅ Objects are listed under each category
- ✅ Right-click → "Open Object Details" works
- ✅ Search functionality works (search icon in tree toolbar)

## Detailed Testing Procedure

### Test 1: Configuration Detection
1. Open VSCode in a folder **without** 1C configuration
2. Verify no "1C Configuration" panel appears
3. Open the demo folder
4. Verify automatic detection and notification message

### Test 2: Tree Navigation
1. Expand "Справочники" (Catalogs) folder
2. Verify objects like "Товары", "Контрагенты" are listed
3. Click on "Товары" - should open XML file
4. Verify Russian display names are shown correctly

### Test 3: Object Details Panel
1. Right-click any object in tree
2. Select "Open Object Details"
3. Verify webview panel opens with:
   - Object header with icon and name
   - Basic information section
   - Properties section (if applicable)
   - Raw data section (collapsible)

### Test 4: Search Functionality
1. Click search icon in tree toolbar
2. Enter "Товар" - should filter to show only matching objects
3. Clear search - should restore full tree
4. Try searching by object type like "Catalog"

### Test 5: Multiple Object Types
Verify these object types are properly displayed:
- ✅ Справочники (Catalogs)
- ✅ Документы (Documents) 
- ✅ Отчеты (Reports)
- ✅ Обработки (DataProcessors)
- ✅ Регистры накопления (AccumulationRegisters)
- ✅ Общие модули (CommonModules)
- ✅ Константы (Constants)

### Test 6: Error Handling
1. Rename Configuration.xml temporarily
2. Verify graceful handling and appropriate error message
3. Restore Configuration.xml
4. Verify recovery when using refresh command

## Development Testing

### Running in Development Mode
1. Open the extension folder in VSCode
2. Press F5 to launch Extension Development Host
3. In the new window, open the demo folder
4. Test all functionality in the development environment

### Debugging
1. Set breakpoints in TypeScript source files
2. Use F5 to start debugging
3. Trigger extension functionality to hit breakpoints
4. Inspect variables and execution flow

## Troubleshooting

### Common Issues

**Extension not appearing:**
- Verify Configuration.xml exists in workspace
- Check VSCode developer console for errors (Help → Toggle Developer Tools)
- Try manually running "Show 1C Configuration Tree" command

**Tree not populating:**
- Check if XML files are properly formatted
- Verify file permissions
- Look for parsing errors in VSCode Output panel

**Object details not opening:**
- Ensure webview panel isn't blocked
- Check for JavaScript errors in webview developer tools
- Verify file paths are accessible

**Search not working:**
- Try refreshing the tree (refresh button)
- Check if objects have proper names/synonyms
- Verify search term formatting

### Debug Information

Enable detailed logging by:
1. Open VSCode settings
2. Search for "1c config viewer"
3. Enable verbose logging (if implemented)

Or check the Output panel:
1. View → Output
2. Select "1C Configuration Viewer" from dropdown

## Performance Considerations

### Large Configurations
- Initial parsing may take 5-10 seconds for configurations with 1000+ objects
- Search results update in real-time but may be slower with large datasets
- Consider using more specific search terms for better performance

### Memory Usage
- Extension uses minimal memory when inactive
- Webview panels consume memory while open
- Close unused object detail panels to free memory

## Compatibility

### VSCode Versions
- Minimum: 1.60.0
- Recommended: Latest stable version
- Works with VSCode Insiders builds

### Operating Systems
- ✅ Windows 10/11
- ✅ macOS 10.14+
- ✅ Linux (Ubuntu 18.04+, other distributions)

### File Formats
- ✅ XML exported configurations (Configuration.xml + object XMLs)
- ❌ Binary .cf files (not supported)
- ❌ .dt templates (not supported)

## Reporting Issues

When reporting issues, please include:
1. VSCode version (`Help → About`)
2. Operating system and version
3. Extension version
4. Configuration details (number of objects, structure)
5. Steps to reproduce
6. Error messages from developer console
7. Sample configuration files (if possible)

## Contributing

To contribute to the extension:
1. Fork the repository
2. Follow the development setup in README.md
3. Test thoroughly using this guide
4. Submit pull request with test results

# Testing Guide for 1C Configuration Viewer

## Manual Testing

### Command Registration Verification

1. **Install the Extension**
   ```bash
   code --install-extension 1c-config-viewer-1.5.0.vsix
   ```

2. **Check Extension Activation**
   - Open VS Code
   - Look for the 1C Configuration icon in the Activity Bar (left sidebar)
   - Extension should activate automatically on startup

3. **Test Commands via Command Palette**
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Type \"1C:\" - should see all commands:
     - `1C: Show Configuration Tree`
     - `1C: Search Objects`
     - `1C: Clear Search`
     - `1C: Scan for Configurations`
     - `1C: Show Help`

4. **Test UI Commands**
   - Click on the 1C Configuration icon in Activity Bar
   - Should see the Configuration Tree view
   - Test toolbar buttons:
     - 🔄 Refresh (sync icon)
     - 🔍 Search (search icon)
     - 🗑️ Clear Search (clear-all icon)
     - 🗄️ Scan (database icon)

### Developer Console Testing

1. **Open Developer Tools**
   - `Help` → `Toggle Developer Tools`
   - Go to `Console` tab

2. **Run Test Script**
   ```javascript
   // Copy and paste content from manual-test.js
   ```

3. **Check Console Output**
   - Should see \"✓ All commands verified successfully\"
   - All 7 commands should be registered
   - Command execution should work without errors

## Expected Behavior

### ✅ Correct Registration
- All 7 commands registered: `showConfigTree`, `refreshTree`, `openObjectDetails`, `searchObjects`, `clearSearch`, `scanConfigurations`, `showHelp`
- Commands accessible via Command Palette
- UI buttons work when clicked
- No \"command not found\" errors

### ✅ Activation Events
- Extension activates on startup (`onStartupFinished`)
- Extension activates when view is opened (`onView:1cConfigTreeView`)
- Extension activates when any command is triggered

### ✅ Error Handling
- Commands provide user feedback
- Errors are logged to console
- Graceful fallbacks for missing configurations

## Troubleshooting

### Commands Not Found
1. Check if extension is active:
   ```javascript
   vscode.extensions.getExtension('raschiren.1c-config-viewer')?.isActive
   ```

2. Reload VS Code completely

3. Check console for activation errors:
   ```javascript
   // Should see: \"✓ Extension activation completed successfully\"
   // Should see: \"✓ All 7 commands registered and subscribed\"
   ```

### UI Not Visible
1. Check Activity Bar for 1C Configuration icon
2. Try command: `1C: Show Configuration Tree`
3. Check if `activationEvents` are correct in package.json

### Performance Issues
1. Verify no `*` activation event (should use specific events)
2. Check for proper async initialization
3. Monitor console for excessive logging

## Automated Testing (Future)

The project includes test infrastructure for:
- Extension activation tests
- Command registration verification
- Tree provider functionality
- Configuration parser tests

To run tests (when dependencies are installed):
```bash
npm install  # Install test dependencies
npm test     # Run test suite
```

## Test Configuration

### Required Test Environment
- VS Code ^1.60.0
- Node.js compatible with npm
- Test workspace with or without 1C configuration files

### Test Data
For comprehensive testing, create test workspace with:
- Valid 1C configuration XML files
- Typical folder structure (Catalogs/, Documents/, etc.)
- Mixed file types and nested directories
