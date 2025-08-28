# ЭТО VIBE ТЕСТ нового инструмента. НЕ РАБОТАЕТ!!!
# 1C Configuration Viewer / Просмотрщик конфигураций 1С

[English](#english) | [Русский](#русский)

---

## Русский

### 📋 Описание

Расширение для Visual Studio Code, которое автоматически обнаруживает и предоставляет визуальное представление объектов конфигурации 1С Предприятие, экспортированных в XML формат.

### ⚡ **Автоматическое обнаружение** - Никаких настроек не требуется!

Расширение **автоматически активируется при открытии VSCode** и немедленно сканирует ваше рабочее пространство на наличие конфигураций 1С. Никаких ручных команд не требуется!

🎯 **Просто откройте папку с файлами конфигурации 1С** и расширение:
- Автоматически обнаружит конфигурации в любых подкаталогах
- Покажет дерево "Конфигурация 1С" в Проводнике
- Включит всю функциональность без ручной настройки

### 🚀 Основные возможности

- **🔍 Автоматическое обнаружение конфигураций**: Сканирует рабочее пространство на наличие конфигураций 1С, включая подкаталоги
- **📁 Поддержка множественных конфигураций**: Обрабатывает несколько конфигураций 1С в одном рабочем пространстве
- **🧠 Интеллектуальное распознавание структуры**: Обнаруживает структуры 1С даже без файлов Configuration.xml
- **🌳 Древовидное представление**: Просматривайте объекты конфигурации 1С в организованной древовидной структуре
- **📄 Детали объектов**: Просматривайте подробную информацию об объектах конфигурации в красивой веб-панели
- **🔎 Функция поиска**: Быстро находите объекты по имени, типу или синониму
- **📚 Множественные типы объектов**: Поддержка Справочников, Документов, Отчетов, Обработок, Регистров и многого другого
- **🌐 Локализованное отображение**: Показывает русские синонимы для лучшего понимания
- **📂 Навигация по файлам**: Кликните на объекты для открытия их XML файлов
- **🔄 Ручное сканирование**: Принудительное пересканирование рабочего пространства при необходимости

### 📦 Установка

#### Вариант 1: Установка готового расширения
Если у вас есть файл `.vsix`:
```bash
code --install-extension 1c-config-viewer-1.5.0.vsix
```

#### Вариант 2: Сборка из исходного кода
См. [BUILD.md](BUILD.md) для подробных инструкций по сборке.

Быстрая сборка:
```bash
cd vscode-1c-config-viewer
npm install
npm run compile
vsce package
```

#### Вариант 3: Ручная установка
1. Скопируйте папку расширения в каталог расширений VSCode:
   - Windows: `%USERPROFILE%\.vscode\extensions\`
   - macOS: `~/.vscode/extensions/`
   - Linux: `~/.vscode/extensions/`

### 💡 Использование

#### Автоматическое обнаружение

Расширение автоматически обнаруживает конфигурации 1С при открытии рабочего пространства:

1. **Основное обнаружение**: Ищет файлы `Configuration.xml` в рабочем пространстве
2. **Глубокое сканирование**: Если Configuration.xml не найден, сканирует типичные структуры папок 1С
3. **Множественные конфигурации**: Обрабатывает несколько конфигураций в одном рабочем пространстве
4. **Поиск в подкаталогах**: Автоматически ищет конфигурации в подкаталогах

При обнаружении расширение:
- Покажет уведомление с найденными местоположениями
- Добавит представление "Конфигурация 1С" в панель Проводника
- Включит команды, специфичные для конфигурации

#### Ручная активация

Если конфигурации не обнаружены автоматически, вы можете:

1. **Палитра команд**: Откройте Палитру команд (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. **Ручное сканирование**: Выполните команду "1C: Сканировать конфигурации"
3. **Показать дерево**: Выполните команду "Показать дерево конфигурации 1С"
4. **Обновить**: Используйте кнопку обновления в панели инструментов дерева

### 📊 Поддерживаемые типы объектов

- **📚 Справочники** - Хранение справочных данных
- **📄 Документы** - Записи бизнес-транзакций
- **📈 Отчеты** - Объекты отчетности
- **⚙️ Обработки** - Процедуры обработки данных
- **📊 Регистры накопления** - Данные накопления
- **ℹ️ Регистры сведений** - Хранение информации
- **📋 Планы видов характеристик** - Определения типов характеристик
- **🔧 Общие модули** - Общие модули кода
- **🖼️ Общие формы** - Общие формы пользовательского интерфейса
- **⚡ Общие команды** - Глобальные команды
- **📌 Константы** - Системные константы
- **📝 Перечисления** - Предопределенные списки значений
- **🔐 Роли** - Роли безопасности
- **🏗️ Подсистемы** - Функциональные подсистемы

### 🛠️ Команды

| Команда | Описание |
|---------|----------|
| `1cConfigViewer.showConfigTree` | Показать дерево конфигурации 1С |
| `1cConfigViewer.refreshTree` | Обновить дерево конфигурации |
| `1cConfigViewer.openObjectDetails` | Открыть подробное представление объекта |
| `1cConfigViewer.searchObjects` | Поиск объектов конфигурации |
| `1cConfigViewer.scanConfigurations` | Ручное сканирование рабочего пространства для конфигураций 1С |

### ✅ Требования

- Visual Studio Code 1.60.0 или выше
- Конфигурация 1С Предприятие, экспортированная в XML файлы
- Файл Configuration.xml в рабочем пространстве (рекомендуется)

### 📁 Структура конфигурации

Расширение ожидает следующую структуру каталогов:

```
workspace/
├── Configuration.xml
├── Catalogs/
│   ├── ИмяОбъекта.xml
│   └── ИмяОбъекта/
├── Documents/
│   ├── ИмяОбъекта.xml
│   └── ИмяОбъекта/
├── Reports/
│   ├── ИмяОбъекта.xml
│   └── ИмяОбъекта/
└── ... (другие типы объектов)
```

### 🔧 Разработка

Для модификации или расширения этого расширения:

1. Клонируйте/скачайте исходный код
2. Установите зависимости: `npm install`
3. Скомпилируйте TypeScript: `npm run compile`
4. Нажмите F5 для запуска среды разработки расширений
5. Протестируйте ваши изменения

### 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку функции
3. Внесите ваши изменения
4. Добавьте тесты, если применимо
5. Отправьте pull request

### 📝 Лицензия

Этот проект лицензирован под лицензией MIT.

### 🆘 Поддержка

Для вопросов, проблем или запросов функций:

1. Проверьте существующие issues в репозитории
2. Создайте новый issue с подробным описанием
3. Включите примеры файлов конфигурации, если это актуально

---

## English

### 📋 Description

A Visual Studio Code extension that automatically discovers and provides visual representation and navigation for 1C Enterprise configuration objects exported to XML format.

### ⚡ **Automatic Discovery** - No Setup Required!

The extension **automatically activates when you open VSCode** and immediately scans your workspace for 1C configurations. No manual commands needed!

🎯 **Just open a folder containing 1C configuration files** and the extension will:
- Automatically detect configurations in any subdirectory
- Show the "1C Configuration" tree view in Explorer
- Enable all functionality without any manual setup

### 🚀 Features

- **🔍 Automatic Configuration Discovery**: Automatically scans workspace for 1C configurations, including subdirectories
- **📁 Multi-Configuration Support**: Handles multiple 1C configurations in the same workspace
- **🧠 Intelligent Structure Detection**: Detects 1C structures even without Configuration.xml files
- **🌳 Configuration Tree View**: Browse 1C configuration objects in an organized tree structure
- **📄 Object Details**: View detailed information about configuration objects in a beautiful webview panel
- **🔎 Search Functionality**: Quickly find objects by name, type, or synonym
- **📚 Multiple Object Types**: Support for Catalogs, Documents, Reports, Data Processors, Registers, and more
- **🌐 Localized Display**: Shows Russian synonyms for better understanding
- **📂 File Navigation**: Click on objects to open their XML definition files
- **🔄 Manual Scanning**: Force rescan workspace for configurations when needed

### 📦 Installation

#### Option 1: Install Pre-built Extension
If you have the `.vsix` file:
```bash
code --install-extension 1c-config-viewer-1.5.0.vsix
```

#### Option 2: Build from Source
See [BUILD.md](BUILD.md) for detailed build instructions.

Quick build:
```bash
cd vscode-1c-config-viewer
npm install
npm run compile
vsce package
```

#### Option 3: Manual Installation
1. Copy the extension folder to your VSCode extensions directory:
   - Windows: `%USERPROFILE%\.vscode\extensions\`
   - macOS: `~/.vscode/extensions/`
   - Linux: `~/.vscode/extensions/`

### 💡 Usage

### Automatic Detection

The extension automatically detects 1C configurations when you open a workspace:

1. **Primary Detection**: Looks for `Configuration.xml` files in the workspace
2. **Deep Scanning**: If no Configuration.xml is found, scans for typical 1C folder structures
3. **Multi-Configuration**: Handles multiple configurations in the same workspace
4. **Subdirectory Search**: Automatically searches subdirectories for configurations

When detected, the extension will:
- Show a notification with the location(s) found
- Add a "1C Configuration" view to the Explorer panel
- Enable configuration-specific commands

### Manual Activation

If configurations are not automatically detected, you can:

1. **Command Palette**: Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. **Manual Scan**: Run command "1C: Scan for Configurations"
3. **Show Tree**: Run command "Show 1C Configuration Tree"
4. **Refresh**: Use the refresh button in the tree view toolbar

### Browsing Objects

1. **Tree Navigation**: 
   - Expand folders to see object types (Catalogs, Documents, etc.)
   - Click on objects to open their XML files
   - Use context menu for additional options

2. **Object Details**:
   - Right-click on any object and select "Open Object Details"
   - View comprehensive information including properties, attributes, forms, and commands
   - Browse raw XML data in a collapsible section

3. **Search Objects**:
   - Click the search icon in the tree view toolbar
   - Enter search terms to filter objects
   - Search works on object names, display names, and types

### 📊 Supported Object Types

- **📚 Catalogs** (Справочники) - Reference data storage
- **📄 Documents** (Документы) - Business transaction records
- **📈 Reports** (Отчеты) - Reporting objects
- **⚙️ Data Processors** (Обработки) - Data processing routines
- **📊 Accumulation Registers** (Регистры накопления) - Accumulation data
- **ℹ️ Information Registers** (Регистры сведений) - Information storage
- **📋 Charts of Characteristic Types** (Планы видов характеристик) - Characteristic type definitions
- **🔧 Common Modules** (Общие модули) - Shared code modules
- **🖼️ Common Forms** (Общие формы) - Shared user interface forms
- **⚡ Common Commands** (Общие команды) - Global commands
- **📌 Constants** (Константы) - System constants
- **📝 Enumerations** (Перечисления) - Predefined value lists
- **🔐 Roles** (Роли) - Security roles
- **🏗️ Subsystems** (Подсистемы) - Functional subsystems

### 🛠️ Commands

| Command | Description |
|---------|-------------|
| `1cConfigViewer.showConfigTree` | Show 1C Configuration Tree |
| `1cConfigViewer.refreshTree` | Refresh the configuration tree |
| `1cConfigViewer.openObjectDetails` | Open detailed object view |
| `1cConfigViewer.searchObjects` | Search configuration objects |
| `1cConfigViewer.clearSearch` | Clear search filter |
| `1cConfigViewer.scanConfigurations` | Manually scan workspace for 1C configurations |
| `1cConfigViewer.showHelp` | Show help and diagnostic information |

### ✅ Requirements

- Visual Studio Code 1.60.0 or higher
- 1C Enterprise configuration exported to XML files
- Configuration.xml file in the workspace (recommended)

### 📁 Configuration Structure

The extension expects the following directory structure:

```
workspace/
├── Configuration.xml
├── Catalogs/
│   ├── ObjectName.xml
│   └── ObjectName/
├── Documents/
│   ├── ObjectName.xml
│   └── ObjectName/
├── Reports/
│   ├── ObjectName.xml
│   └── ObjectName/
└── ... (other object types)
```

### 📊 Features in Detail

#### Tree View
- Organized by object types with Russian localized names
- Shows object count in each category
- Icons for different object types
- Collapsible/expandable sections

#### Object Details Panel
- **Basic Information**: Name, type, UUID, file path
- **Properties**: Object-specific properties (hierarchical, autonumbering, etc.)
- **Attributes**: Custom attributes defined for the object
- **Forms**: Associated forms for user interface
- **Commands**: Available commands for the object
- **Raw Data**: Complete XML structure for advanced users

#### Search Functionality
- Real-time filtering as you type
- Searches object names, display names, and types
- Maintains tree structure while filtering
- Easy clear functionality

### 🔧 Development

To modify or extend this extension:

1. Clone/download the source code
2. Install dependencies: `npm install`
3. Compile TypeScript: `npm run compile`
4. Press F5 to launch Extension Development Host
5. Test your changes

#### Project Structure

```
src/
├── extension.ts          # Main extension entry point
├── configParser.ts       # XML parsing and object model
├── configTreeProvider.ts # Tree view data provider
└── objectDetailsPanel.ts # Webview panel for details

media/
├── styles.css           # Webview styling
└── main.js             # Webview JavaScript

package.json             # Extension manifest
tsconfig.json           # TypeScript configuration
```

### ⚠️ Known Limitations

- Only supports XML-exported 1C configurations
- Does not parse binary .cf files directly
- Russian language support is built-in but not configurable
- Large configurations may take time to parse initially

### 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### 📝 License

This project is licensed under the MIT License.

### 🆘 Support

For issues, questions, or feature requests:

1. Check existing issues in the repository
2. Create a new issue with detailed description
3. Include sample configuration files if relevant

### 📅 Changelog

#### 1.5.0 (Latest)
- ✅ Complete command registration verification
- 🧪 Comprehensive test infrastructure
- 🛠️ Enhanced error handling and user feedback
- 🚀 Improved extension activation performance
- 📊 Better search functionality with result counts
- 🔧 Code quality improvements and TypeScript strict mode

#### 1.4.x
- 🔍 Enhanced search and filtering capabilities
- 🖄 Improved configuration detection
- 💲 Performance optimizations

#### 1.3.x
- 🌳 Improved tree view with better icons
- 📄 Enhanced object details panel
- 🔎 Advanced search functionality

#### 1.2.x
- 🚀 Multi-configuration support
- 🧠 Intelligent structure detection
- 🖄 Auto-refresh on file changes

#### 1.1.x
- 🌐 Russian localization improvements
- 💲 Performance enhancements
- 🐛 Bug fixes and stability improvements

#### 1.0.0
- 🎉 Initial release
- 🌳 Basic tree view for configuration objects
- 🖼️ Object details webview panel
- 🔍 Search and filter functionality
- 📚 Support for major 1C object types
- 🔍 Automatic configuration detection
