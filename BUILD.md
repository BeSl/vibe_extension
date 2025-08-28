# Build Guide - 1C Configuration Viewer Extension

## Как собрать файл расширения (How to Build the Extension)

### Предварительные требования (Prerequisites)

1. **Node.js** - установите последнюю LTS версию
2. **npm** - обычно устанавливается вместе с Node.js
3. **@vscode/vsce** - инструмент для сборки расширений VSCode

### Шаг 1: Установка инструментов (Install Tools)

```powershell
# Установить vsce глобально
npm install -g @vscode/vsce
```

### Шаг 2: Подготовка проекта (Project Preparation)

```powershell
# Перейти в директорию расширения
cd c:\develop\vscode-1c-config-viewer

# Установить зависимости
npm install

# Скомпилировать TypeScript
npm run compile
# или напрямую:
npx tsc -p ./
```

### Шаг 3: Сборка расширения (Build Extension)

```powershell
# Находясь в директории расширения, выполните:
vsce package

# Это создаст файл: 1c-config-viewer-1.0.0.vsix
```

### Полная команда сборки (Complete Build Command)

```powershell
# Из корневой директории проекта:
Push-Location ".\vscode-1c-config-viewer"; vsce package; Pop-Location
```

## Структура файлов после сборки

```
vscode-1c-config-viewer/
├── 1c-config-viewer-1.0.0.vsix  ← Готовый файл расширения
├── package.json
├── out/                          ← Скомпилированный JavaScript
│   ├── extension.js
│   ├── configParser.js
│   ├── configTreeProvider.js
│   └── objectDetailsPanel.js
├── media/
│   ├── styles.css
│   └── main.js
└── src/                          ← Исходный TypeScript код
    ├── extension.ts
    ├── configParser.ts
    ├── configTreeProvider.ts
    └── objectDetailsPanel.ts
```

## Установка собранного расширения

### Способ 1: Через командную строку
```powershell
code --install-extension 1c-config-viewer-1.1.0.vsix
```

### Способ 2: Через VSCode
1. Откройте VSCode
2. Ctrl+Shift+P → "Extensions: Install from VSIX..."
3. Выберите файл `1c-config-viewer-1.0.0.vsix`

### Способ 3: Ручная установка
Скопируйте распакованное содержимое в:
- Windows: `%USERPROFILE%\.vscode\extensions\1c-config-viewer-1.1.0\`
- macOS: `~/.vscode/extensions/1c-config-viewer-1.1.0/`
- Linux: `~/.vscode/extensions/1c-config-viewer-1.1.0/`

## Автоматизация сборки

Можно добавить скрипт в `package.json`:

```json
{
  "scripts": {
    "package": "vsce package",
    "install-local": "code --install-extension $(ls *.vsix | head -1)"
  }
}
```

Тогда сборка выполняется командой:
```powershell
npm run package
```

## Решение проблем

### Ошибка "Manifest missing field: engines"
- Убедитесь, что находитесь в правильной директории
- Проверьте наличие `engines` в `package.json`

### Ошибка компиляции TypeScript
```powershell
# Переустановите TypeScript
npm install typescript

# Скомпилируйте с указанием полного пути
npx tsc -p "c:\develop\raschiren\vscode-1c-config-viewer\tsconfig.json"
```

### Предупреждения при сборке
Можно игнорировать предупреждения о missing repository и LICENSE:
```powershell
vsce package --allow-missing-repository
```

## Дополнительные команды

```powershell
# Посмотреть что будет включено в пакет
vsce ls

# Опубликовать в Marketplace (требует токен)
vsce publish

# Создать пакет в определенной директории
vsce package --out "c:\path\to\output\"
```

## Содержимое готового .vsix файла

Файл `1c-config-viewer-1.0.0.vsix` содержит:
- ✅ Скомпилированный JavaScript код
- ✅ CSS стили для webview
- ✅ JavaScript для интерактивности
- ✅ Манифест расширения
- ✅ Документацию (README, CHANGELOG)
- ❌ Исходный TypeScript код (исключен)
- ❌ node_modules (исключен)

Размер пакета: ~24 KB

## Тестирование собранного расширения

После установки:
1. Откройте папку `demo` в VSCode
2. Проверьте появление панели "1C Configuration"
3. Протестируйте функциональность согласно `TESTING.md`

Расширение готово к использованию!