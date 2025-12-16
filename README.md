# 🎭 Vibe Switch - Chrome Extension

**Transform your AI prompts with expert personalities**

Vibe Switch is a Chrome extension that injects 30+ expert vibes into ChatGPT and Gemini. Get professional writing, creative storytelling, technical expertise, and more - all with a single click.

🌐 **Website:** https://uluak-alt.github.io/vibe-switch/

## ✨ Features

- 🎯 **30+ Expert Vibes** - Grammar Pro, Code Expert, Copywriter, Screenwriter, and more
- 🎨 **Custom Vibe Creator** - Design your own expert personalities
- 🎚️ **5-Dimension Tuner** - Fine-tune depth, tone, creativity, format, and expertise level
- 🆓 **Free Tier** - 5 essential vibes (Grammar Pro, Code Expert, TL;DR, Resume Roaster, Travel Planner)
- 💎 **Pro Mode** - Unlock all 25+ vibes + custom creation for $4.99

## 🚀 Installation

### From Chrome Web Store
*Coming soon - currently in review*

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the `extension/` folder
6. Pin the extension to your toolbar

## 📖 How It Works

1. Visit ChatGPT or Gemini
2. Click a vibe from the sidebar (collapses/expands with toggle)
3. Your prompt gets transformed with expert personality
4. Hit Enter to send the enhanced prompt

## 🔓 Unlock Pro

Get access to all 25+ vibes and custom vibe creation:
1. Click "Unlock Pro" in the sidebar
2. Purchase a license ($4.99) via Gumroad
3. Paste your license key in the extension popup
4. Enjoy unlimited expert personalities!

## 🛠️ Development

This repository contains both the extension and a demo app:

### Extension (Production)
```bash
cd extension/
# Load in Chrome via chrome://extensions/
```

### Demo App (Development)
```bash
npm install
npm run dev
```

## 📁 Project Structure

```
extension/          # Chrome Extension (production code)
├── manifest.json   # Extension configuration
├── background.js   # Service worker for license validation
├── content.js      # Main extension logic (30+ vibes)
├── popup.html/js   # License management UI
├── icons/          # Extension icons
└── PRIVACY.md      # Privacy policy

docs/               # GitHub Pages landing page
App.tsx             # Demo app (not part of extension)
```

## 🔒 Privacy & Security

- **Zero tracking** - No analytics or user data collection
- **Local storage only** - All preferences stored on your device
- **No API keys** - Pure prompt injection, no external calls
- **Open source** - Full transparency

Read our full [Privacy Policy](https://uluak-alt.github.io/vibe-switch/privacy.html)

## 📜 License

MIT License - see [LICENSE](LICENSE) file

## 🤝 Contributing

Issues and pull requests welcome! Please read our submission guidelines first.

## 📧 Support

- GitHub Issues: [Report a bug](https://github.com/Uluak-alt/vibe-switch/issues)
- GitHub Issues: https://github.com/Uluak-alt/vibe-switch/issues

---

**Made with ❤️ for AI power users**
