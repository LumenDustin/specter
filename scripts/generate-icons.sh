#!/bin/bash

# Generate app icons from a source 1024x1024 PNG
# Usage: ./generate-icons.sh path/to/icon-1024.png

SOURCE=$1

if [ -z "$SOURCE" ]; then
    echo "Usage: ./generate-icons.sh path/to/icon-1024.png"
    echo ""
    echo "First, export the SVG at public/icons/icon-base.svg to a 1024x1024 PNG"
    echo "Then run this script with that PNG file"
    exit 1
fi

if [ ! -f "$SOURCE" ]; then
    echo "Error: Source file not found: $SOURCE"
    exit 1
fi

PROJECT_ROOT=$(dirname "$0")/..
cd "$PROJECT_ROOT"

echo "Generating icons from: $SOURCE"

# PWA icons
echo "Creating PWA icons..."
mkdir -p public/icons
sips -z 512 512 "$SOURCE" --out public/icons/icon-512x512.png
sips -z 384 384 "$SOURCE" --out public/icons/icon-384x384.png
sips -z 192 192 "$SOURCE" --out public/icons/icon-192x192.png
sips -z 152 152 "$SOURCE" --out public/icons/icon-152x152.png
sips -z 144 144 "$SOURCE" --out public/icons/icon-144x144.png
sips -z 128 128 "$SOURCE" --out public/icons/icon-128x128.png
sips -z 96 96 "$SOURCE" --out public/icons/icon-96x96.png
sips -z 72 72 "$SOURCE" --out public/icons/icon-72x72.png

# iOS icons
echo "Creating iOS icons..."
IOS_ICONS="ios/App/App/Assets.xcassets/AppIcon.appiconset"
mkdir -p "$IOS_ICONS"
sips -z 1024 1024 "$SOURCE" --out "$IOS_ICONS/AppIcon-512@2x.png"
sips -z 180 180 "$SOURCE" --out "$IOS_ICONS/AppIcon-60@3x.png"
sips -z 120 120 "$SOURCE" --out "$IOS_ICONS/AppIcon-60@2x.png"
sips -z 167 167 "$SOURCE" --out "$IOS_ICONS/AppIcon-83.5@2x.png"
sips -z 152 152 "$SOURCE" --out "$IOS_ICONS/AppIcon-76@2x.png"
sips -z 76 76 "$SOURCE" --out "$IOS_ICONS/AppIcon-76.png"

# Android icons
echo "Creating Android icons..."
sips -z 192 192 "$SOURCE" --out android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
sips -z 144 144 "$SOURCE" --out android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
sips -z 96 96 "$SOURCE" --out android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
sips -z 72 72 "$SOURCE" --out android/app/src/main/res/mipmap-hdpi/ic_launcher.png
sips -z 48 48 "$SOURCE" --out android/app/src/main/res/mipmap-mdpi/ic_launcher.png

# Copy for round icons (Android)
cp android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png
cp android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png
cp android/app/src/main/res/mipmap-xhdpi/ic_launcher.png android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png
cp android/app/src/main/res/mipmap-hdpi/ic_launcher.png android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png
cp android/app/src/main/res/mipmap-mdpi/ic_launcher.png android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png

# Favicon
echo "Creating favicon..."
sips -z 32 32 "$SOURCE" --out public/favicon.ico

echo ""
echo "Done! Icons generated successfully."
echo ""
echo "Next steps:"
echo "1. Update ios/App/App/Assets.xcassets/AppIcon.appiconset/Contents.json if needed"
echo "2. Run 'npx cap sync' to sync changes to native projects"
