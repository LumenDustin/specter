# App Icon Generation Guide

## Required Icon Sizes

### iOS (App Store)
- 1024x1024 - App Store icon (required)
- 180x180 - iPhone app icon (@3x)
- 120x120 - iPhone app icon (@2x)
- 167x167 - iPad Pro app icon
- 152x152 - iPad app icon (@2x)
- 76x76 - iPad app icon (@1x)

### Android (Play Store)
- 512x512 - Play Store icon (required)
- 192x192 - xxxhdpi
- 144x144 - xxhdpi
- 96x96 - xhdpi
- 72x72 - hdpi
- 48x48 - mdpi

### PWA / Web
- 512x512
- 384x384
- 192x192
- 152x152
- 144x144
- 128x128
- 96x96
- 72x72

## Quick Generation with ImageMagick

If you have ImageMagick installed:

```bash
# From the Specter project root

# Generate iOS icons
convert public/icons/icon-1024.png -resize 180x180 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-180.png
convert public/icons/icon-1024.png -resize 120x120 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-120.png
# ... etc

# Generate Android icons
convert public/icons/icon-512.png -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
# ... etc

# Generate PWA icons
convert public/icons/icon-512.png -resize 192x192 public/icons/icon-192x192.png
# ... etc
```

## Using Online Tools

1. **App Icon Generator**: https://appicon.co/
   - Upload a 1024x1024 PNG
   - Download iOS and Android icon sets

2. **Favicon.io**: https://favicon.io/
   - For web favicons and PWA icons

3. **PWA Asset Generator**: https://progressier.com/pwa-icons-and-splash-screen-generator

## Source File

The base icon design is at: `public/icons/icon-base.svg`

Export this at 1024x1024 PNG, then use the tools above to generate all sizes.

## Important Notes

1. **iOS Requirements**:
   - No transparency allowed
   - No rounded corners (iOS applies them automatically)
   - Solid background required

2. **Android Requirements**:
   - Adaptive icons need foreground and background layers
   - Current setup uses legacy icons

3. **PWA Requirements**:
   - Needs both `maskable` and `any` purpose icons
   - Maskable icons need safe zone (center 80%)
