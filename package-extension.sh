#!/bin/bash

# Package Chrome Extension for Submission
# This script prepares the extension for Chrome Web Store upload

echo "🎨 Vibe Switch - Chrome Web Store Packager"
echo "==========================================="
echo ""

# Check if we're in the right directory
if [ ! -d "extension" ]; then
    echo "❌ Error: extension/ folder not found"
    echo "   Please run this script from the project root"
    exit 1
fi

# Step 1: Check for PNG icons
echo "📋 Step 1: Checking icons..."
ICONS_OK=true

for size in 16 48 128; do
    if [ ! -f "extension/icons/icon${size}.png" ]; then
        if [ -f "extension/icons/icon${size}.svg" ]; then
            echo "⚠️  icon${size}.png not found (SVG exists)"
            ICONS_OK=false
        else
            echo "❌ icon${size} not found at all!"
            ICONS_OK=false
        fi
    else
        echo "✅ icon${size}.png exists"
    fi
done

if [ "$ICONS_OK" = false ]; then
    echo ""
    echo "⚠️  PNG icons required for Chrome Web Store"
    echo ""
    echo "🔧 To convert SVG to PNG:"
    echo "   Option 1: Visit https://cloudconvert.com/svg-to-png"
    echo "   Option 2: Use this command (if you have ImageMagick):"
    echo "      brew install imagemagick"
    echo "      cd extension/icons"
    echo "      magick icon16.svg icon16.png"
    echo "      magick icon48.svg icon48.png"
    echo "      magick icon128.svg icon128.png"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 2: Check for Gumroad configuration
echo ""
echo "📋 Step 2: Checking Gumroad configuration..."

if grep -q "YOUR_PRODUCT_PERMALINK" extension/background.js; then
    echo "⚠️  Gumroad product not configured in background.js"
    echo ""
    echo "🔧 Setup instructions:"
    echo "   1. Create product at https://gumroad.com"
    echo "   2. Get your product permalink"
    echo "   3. Update line 32 in extension/background.js"
    echo "      Replace: 'product_id': 'YOUR_PRODUCT_PERMALINK'"
    echo "      With:    'product_id': 'your-actual-permalink'"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ Gumroad configured"
fi

# Step 3: Create ZIP package
echo ""
echo "📋 Step 3: Creating ZIP package..."

# Get version from manifest
VERSION=$(grep '"version"' extension/manifest.json | sed 's/.*"version": "\(.*\)".*/\1/')
OUTPUT_FILE="vibe-switch-v${VERSION}.zip"

# Remove old zip if exists
if [ -f "$OUTPUT_FILE" ]; then
    rm "$OUTPUT_FILE"
    echo "🗑️  Removed old $OUTPUT_FILE"
fi

# Create zip
cd extension
zip -r "../${OUTPUT_FILE}" . -x "*.DS_Store" -x "*.git*" -x "*.svg" > /dev/null 2>&1
cd ..

if [ -f "$OUTPUT_FILE" ]; then
    SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
    echo "✅ Created: $OUTPUT_FILE ($SIZE)"
else
    echo "❌ Failed to create ZIP file"
    exit 1
fi

# Final summary
echo ""
echo "=========================================="
echo "✅ Package created successfully!"
echo "=========================================="
echo ""
echo "📦 File: $OUTPUT_FILE"
echo ""
echo "📋 Next Steps:"
echo "   1. Convert SVG icons to PNG (if not done)"
echo "   2. Update Gumroad product ID (if not done)"
echo "   3. Test extension in Chrome"
echo "   4. Upload to Chrome Web Store Developer Dashboard"
echo "   5. Follow SUBMISSION_GUIDE.md for details"
echo ""
echo "🌐 Submit at: https://chrome.google.com/webstore/devconsole"
echo ""
