# Changelog

All notable changes to the "1C Configuration Viewer" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-08-28

### Added
- **Automatic Startup Search**: Extension now automatically searches for 1C configurations when VSCode opens
- **Extension Icon**: Added custom icon for the extension (blue background with "1C" text and folder structure)
- **Immediate Activation**: Extension activates on startup instead of waiting for manual commands
- **Workspace Change Detection**: Automatically re-scans when workspace folders are added or changed

### Improved
- **Activation Events**: Enhanced activation to trigger on `onStartupFinished` and `workspaceContains:**/*.xml`
- **User Experience**: No need to manually invoke commands - configurations are found automatically
- **Async Activation**: Extension activation is now asynchronous for better performance
- **File Watching**: Improved file system watching for Configuration.xml changes

### Technical Details
- Made `activate()` function async to support immediate configuration scanning
- Added `onDidChangeWorkspaceFolders` event listener for dynamic workspace changes
- Enhanced file watcher to re-scan when Configuration.xml files are added/removed
- Created PowerShell script for generating extension icon
- Updated packaging to include icon.png file

### User Impact
- ✅ **Zero Configuration**: Just open a folder with 1C configuration - extension works immediately
- ✅ **Visual Recognition**: Extension now has a distinctive icon in the extensions panel
- ✅ **Responsive**: Automatically adapts when workspace structure changes
- ✅ **No Manual Commands**: No need to run "Show 1C Configuration Tree" manually

## [1.1.0] - 2025-08-28

### Added
- **Automatic Configuration Discovery**: Enhanced workspace scanning to automatically find 1C configurations in subdirectories
- **Multi-Configuration Support**: Support for multiple 1C configurations in the same workspace
- **Intelligent Structure Detection**: Detects 1C folder structures even without Configuration.xml files
- **Deep Scanning**: Performs thorough search for 1C patterns when primary detection fails
- **Manual Scan Command**: Added "1C: Scan for Configurations" command for manual workspace scanning
- **Enhanced Detection Messages**: More informative notifications about found configurations
- **Additional Object Types**: Support for more 1C object types including:
  - Exchange Plans (Планы обмена)
  - Scheduled Jobs (Регламентные задания)
  - Functional Options (Функциональные опции)
  - HTTP Services (HTTP сервисы)
  - Web Services (Web сервисы)

### Improved
- **Configuration Tree**: Better handling of configuration roots and nested structures
- **Search Performance**: Optimized scanning algorithms for large workspaces
- **Error Handling**: Enhanced error handling during configuration discovery
- **User Experience**: More responsive configuration detection and loading

### Technical Details
- Enhanced `parseWorkspace()` method to handle multiple configuration scenarios
- Added `detectConfigurationStructures()` for pattern-based detection
- Implemented `findConfigurationRoot()` for intelligent root directory discovery
- Updated tree provider to handle configuration-root objects
- Added proper handling of nested and distributed 1C structures

### Bug Fixes
- Fixed directory navigation issues during configuration scanning
- Improved handling of malformed or incomplete 1C structures
- Better error recovery when Configuration.xml is missing or corrupted

## [1.0.0] - 2025-08-28

### Added
- Initial release of 1C Configuration Viewer extension
- Automatic detection of 1C Enterprise configurations in workspace
- Tree view for browsing configuration objects by type
- Support for major 1C object types:
  - Catalogs (Справочники)
  - Documents (Документы) 
  - Reports (Отчеты)
  - Data Processors (Обработки)
  - Accumulation Registers (Регистры накопления)
  - Information Registers (Регистры сведений)
  - Charts of Characteristic Types (Планы видов характеристик)
  - Common Modules (Общие модули)
  - Common Forms (Общие формы)
  - Common Commands (Общие команды)
  - Constants (Константы)
  - Enumerations (Перечисления)
  - Roles (Роли)
  - Subsystems (Подсистемы)
- Object details webview panel with comprehensive information display
- Russian localized display names for object types
- Search and filter functionality for quick object discovery
- Visual icons for different object types
- File navigation - click objects to open XML definition files
- Copy-to-clipboard functionality for technical data
- Collapsible sections in object details
- Responsive design for different screen sizes
- Real-time parsing of XML configuration files
- Support for hierarchical objects and complex structures

### Features
- **Configuration Tree View**: Organized display of all configuration objects
- **Object Details Panel**: Rich information display including:
  - Basic object information (name, type, UUID, file path)
  - Object-specific properties
  - Attributes and their types
  - Associated forms and commands
  - Raw XML data viewer with search
- **Search Functionality**: Quick filtering across all object types
- **Visual Design**: VSCode-integrated styling with proper theming support
- **File Integration**: Direct navigation to XML source files
- **Error Handling**: Graceful handling of parsing errors and missing files

### Technical Details
- Built with TypeScript for type safety and better development experience
- Uses fast-xml-parser for efficient XML processing
- Implements VSCode Tree Data Provider API
- Custom webview implementation for object details
- Responsive CSS with VSCode theme integration
- Modular architecture for easy maintenance and extension

### Supported File Structure
```
Configuration.xml
├── Catalogs/
├── Documents/
├── Reports/
├── DataProcessors/
├── AccumulationRegisters/
├── InformationRegisters/
├── ChartsOfCharacteristicTypes/
├── CommonModules/
├── CommonForms/
├── CommonCommands/
├── Constants/
├── Enums/
├── Roles/
└── Subsystems/
```

### Commands Added
- `1cConfigViewer.showConfigTree` - Show 1C Configuration Tree
- `1cConfigViewer.refreshTree` - Refresh configuration tree
- `1cConfigViewer.openObjectDetails` - Open object details panel
- `1cConfigViewer.searchObjects` - Search configuration objects

### Known Issues
- Large configurations may take some time to parse initially
- Only supports XML-exported configurations (not binary .cf files)
- TypeScript module resolution warnings in development (does not affect functionality)

### Requirements
- Visual Studio Code 1.60.0 or higher
- 1C Enterprise configuration exported to XML format
- Configuration.xml file present in workspace root or subdirectory