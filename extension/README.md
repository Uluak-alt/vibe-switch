# Vibe Switch - Chrome Extension

Transform your AI chat prompts with personality! Pro tools for ChatGPT, Claude & Gemini.

## 🚀 Features

### Free Features
- ✅ 3 expert vibe presets (Grammar Pro, Code Expert, TL;DR Summarizer)
- ✅ Works on ChatGPT, Claude, and Gemini
- ✅ Easy-to-use sidebar interface
- ✅ Collapsible design

### Pro Features ($4.99)
- ✨ 20+ expert vibe presets across 5 categories
- ✨ Create unlimited custom vibes
- ✨ Advanced vibe tuner with 5 dimensions
- ✨ Priority support

## 📦 Installation

### For Users
1. Download from Chrome Web Store (coming soon)
2. Click "Add to Chrome"
3. Visit ChatGPT, Claude, or Gemini
4. Click the Vibe Switch icon to get started

### For Developers
1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `extension` folder
6. Visit ChatGPT, Claude, or Gemini to test

## 🔐 Privacy

Vibe Switch respects your privacy:
- No data is sent to external servers
- No tracking or analytics
- All settings stored locally in your browser
- Open source code for full transparency

See [PRIVACY.md](PRIVACY.md) for full details.

## 💳 Licensing

### Gumroad Integration

To unlock Pro features, users purchase a license key from Gumroad for $4.99.

**For Extension Maintainers:**
1. Create a product on [Gumroad](https://gumroad.com)
2. Set price to $4.99
3. Enable license keys in product settings
4. Update `background.js` with your product permalink:
   ```javascript
   'product_id': 'YOUR_PRODUCT_PERMALINK'
   ```

**License Validation:**
- Uses Gumroad's License API
- Validates on activation
- Stores encrypted in chrome.storage.local
- No recurring validation (respects privacy)

## 🛠️ Technical Details

### Manifest V3
- Service worker architecture
- Content script injection
- Chrome Storage API
- No external dependencies in extension

### Supported Sites
- ✅ chatgpt.com
- ✅ claude.ai
- ✅ gemini.google.com

### How It Works
1. Content script injects sidebar on supported sites
2. User selects a vibe personality
3. On Enter key, system instruction is prepended to prompt
4. AI receives enhanced prompt with personality context

## 📝 Development

### Project Structure
```
extension/
├── manifest.json       # Extension configuration
├── background.js       # Service worker
├── content.js         # Main content script
├── popup.html         # Extension popup UI
├── popup.js           # Popup logic
└── icons/             # Extension icons
```

### Build for Production
The extension is already built and ready to submit. Just:

1. **Update manifest.json** with your details:
   - Update `homepage_url`
   - Update `author`

2. **Update Gumroad integration** in `background.js`:
   - Add your product permalink

3. **Convert icons** from SVG to PNG:
   ```bash
   cd extension/icons
   # Use online converter or ImageMagick
   magick icon16.svg icon16.png
   magick icon48.svg icon48.png
   magick icon128.svg icon128.png
   ```

4. **Zip the extension folder**:
   ```bash
   cd extension
   zip -r ../vibe-switch.zip *
   ```

5. **Submit to Chrome Web Store**:
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Upload `vibe-switch.zip`
   - Fill in store listing details
   - Submit for review

## 🐛 Troubleshooting

### Extension not appearing
- Make sure you're on a supported site (ChatGPT, Claude, or Gemini)
- Try refreshing the page
- Check if extension is enabled in `chrome://extensions/`

### License key not working
- Check for typos in the license key
- Ensure you're connected to the internet
- Contact support with order details

### Sidebar position issues
- Sidebar appears at top-right by default
- Check if another extension is conflicting
- Try disabling other extensions temporarily

## 🤝 Support

- Email: support@vibeswitch.app
- Issues: [GitHub Issues](https://github.com/yourusername/vibe-switch/issues)
- Updates: Follow on Twitter [@vibeswitch](https://twitter.com/vibeswitch)

## 📄 License

Copyright © 2025 Vibe Switch Team. All rights reserved.

This extension's code is proprietary. The extension is free to use with paid Pro upgrade.

## 🙏 Acknowledgments

Built with:
- Lucide Icons (https://lucide.dev)
- Chrome Extension Manifest V3
- Gumroad License API

---

Made with ❤️ for better AI conversations
