# Auto-Search Functionality - Version 1.1.0

## 🔍 Новые возможности автопоиска конфигурации

### Что добавлено:

#### 1. **Автоматическое обнаружение конфигураций**
- ✅ Автоматический поиск `Configuration.xml` во всех подкаталогах
- ✅ Поддержка нескольких конфигураций в одном workspace
- ✅ Интеллектуальное определение структур 1С даже без Configuration.xml
- ✅ Глубокое сканирование по шаблонам типичных папок 1С

#### 2. **Улучшенное обнаружение**
- 🔍 Поиск по шаблонам: `**/Catalogs/**/*.xml`, `**/Documents/**/*.xml`, etc.
- 📁 Автоматическое определение корневых папок конфигураций
- 🏗️ Распознавание структуры даже при отсутствии главного файла конфигурации
- 📊 Показ количества найденных конфигураций

#### 3. **Новые команды**
- `1C: Scan for Configurations` - ручное сканирование workspace
- Добавлена кнопка сканирования в панели инструментов дерева
- Улучшенные уведомления о найденных конфигурациях

#### 4. **Дополнительные типы объектов**
- Exchange Plans (Планы обмена)
- Scheduled Jobs (Регламентные задания)  
- Functional Options (Функциональные опции)
- HTTP Services (HTTP сервисы)
- Web Services (Web сервисы)

### Как работает автопоиск:

#### Этап 1: Первичное обнаружение
```
Поиск Configuration.xml файлов в workspace
↓
Если найдено → Парсинг каждой конфигурации
↓  
Отображение в дереве объектов
```

#### Этап 2: Глубокое сканирование (если Configuration.xml не найден)
```
Поиск типичных папок 1С (Catalogs, Documents, etc.)
↓
Определение корневых директорий конфигураций
↓
Попытка найти Configuration.xml в родительских папках
↓
Создание виртуальной структуры конфигурации
```

#### Этап 3: Множественные конфигурации
```
Если найдено >1 конфигурации
↓
Группировка под корневыми узлами
↓
Configuration: FolderName1
├── Справочники
├── Документы
└── ...
Configuration: FolderName2
├── Справочники
├── Документы
└── ...
```

### Новые функции в коде:

#### Extension.ts
- `checkFor1CConfig()` - Enhanced configuration detection
- `performDeepConfigSearch()` - Deep pattern-based scanning  
- `findConfigurationXmlInParents()` - Smart parent directory search
- `getRelativePath()` - Relative path formatting
- New command: `1cConfigViewer.scanConfigurations`

#### ConfigParser.ts  
- `parseWorkspace()` - Multi-configuration parsing
- `parseConfigurationRoot()` - Individual config processing
- `detectConfigurationStructures()` - Pattern detection
- `findConfigurationRoot()` - Root directory detection
- `getObjectTypes()` - Centralized object type definitions

#### ConfigTreeProvider.ts
- Support for `configuration-root` objects
- Enhanced icon mapping
- Improved context value handling

### Пример использования:

#### Сценарий 1: Обычная конфигурация
```
workspace/
├── Configuration.xml
├── Catalogs/
└── Documents/
```
**Результат**: Автоматическое обнаружение и отображение объектов

#### Сценарий 2: Конфигурация в подпапке  
```
workspace/
├── project/
│   ├── 1c-config/
│   │   ├── Configuration.xml
│   │   ├── Catalogs/
│   │   └── Documents/
```
**Результат**: Автоматическое обнаружение в `project/1c-config/`

#### Сценарий 3: Множественные конфигурации
```
workspace/
├── config1/
│   ├── Configuration.xml
│   └── Catalogs/
├── config2/  
│   ├── Configuration.xml
│   └── Documents/
```
**Результат**: Два узла "Configuration: config1" и "Configuration: config2"

#### Сценарий 4: Неполная структура
```
workspace/
├── some-project/
│   ├── Catalogs/
│   │   └── Товары.xml
│   └── Documents/
│       └── Заказ.xml
```
**Результат**: Обнаружение как "Configuration: some-project (detected)"

### Улучшения пользовательского интерфейса:

- 📢 **Информативные уведомления**: "1C Configuration detected in: demo/! Use the 1C Configuration view..."
- 🔄 **Автообновление**: Дерево автоматически обновляется при обнаружении
- 🎯 **Точная навигация**: Показ относительных путей к конфигурациям
- ⚡ **Быстрое сканирование**: Кнопка принудительного сканирования в панели

### Технические улучшения:

- **Производительность**: Оптимизированные алгоритмы поиска
- **Масштабируемость**: Поддержка больших workspace с множественными конфигурациями  
- **Надежность**: Улучшенная обработка ошибок и восстановление
- **Расширяемость**: Модульная архитектура для добавления новых типов объектов

## Файл расширения обновлен:
📦 **1c-config-viewer-1.1.0.vsix** (28.3 KB)

Готово к установке и использованию!