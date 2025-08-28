# Extension Icon

The 1C Configuration Viewer extension needs an icon. Since we can't create image files directly, here are the specifications:

## Icon Requirements
- Size: 128x128 pixels
- Format: PNG
- Background: Transparent or VSCode theme compatible
- Design: Should represent 1C Enterprise and configuration visualization

## Suggested Design
- Base: Folder or tree icon
- Overlay: "1C" text or "📊" chart emoji
- Colors: Blue (#0078d4) and white for contrast
- Style: Modern, flat design matching VSCode aesthetic

## Icon Files Needed
1. `icon.png` (128x128) - Main extension icon
2. `icon.svg` (optional) - Vector version for scaling

## Placeholder Description
For now, the extension will use default VSCode extension icon. To add a custom icon:
1. Create a 128x128 PNG file named `icon.png`
2. Place it in the extension root directory
3. Add `"icon": "icon.png"` to package.json

The icon should visually represent:
- 1C Enterprise platform
- Configuration structure
- Visual/tree organization
- Professional business application theme