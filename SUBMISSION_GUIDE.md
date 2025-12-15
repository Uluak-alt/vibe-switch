# 🚀 Chrome Web Store Submission Checklist

## ✅ Pre-Submission Checklist

### 1. Complete All Files

- [x] `manifest.json` - Complete and valid
- [x] `background.js` - Service worker implemented
- [x] `content.js` - Main functionality
- [x] `popup.html` - Extension popup UI
- [x] `popup.js` - Popup logic
- [ ] `icons/icon16.png` - **ACTION REQUIRED: Convert SVG to PNG**
- [ ] `icons/icon48.png` - **ACTION REQUIRED: Convert SVG to PNG**
- [ ] `icons/icon128.png` - **ACTION REQUIRED: Convert SVG to PNG**
- [x] `README.md` - Documentation
- [x] `PRIVACY.md` - Privacy policy

### 2. Update Configuration

#### manifest.json
```json
{
  "homepage_url": "https://vibeswitch.app", // UPDATE THIS
  "author": "Vibe Switch Team"             // UPDATE THIS
}
```

#### background.js
```javascript
// Line 31-32: Replace with YOUR Gumroad product info
'product_id': 'YOUR_PRODUCT_PERMALINK',
```

### 3. Create Icons (PNG Required)

**Current Status**: SVG files created ✓
**Action Required**: Convert to PNG

#### Option A: Online Converter (Easiest)
1. Visit https://cloudconvert.com/svg-to-png
2. Upload `extension/icons/icon16.svg`
3. Set size to 16x16
4. Download as `icon16.png`
5. Repeat for 48x48 and 128x128

#### Option B: Using Figma (Free)
1. Open https://figma.com
2. Import SVG files
3. Export as PNG at exact sizes
4. Download and replace

#### Option C: macOS Preview App
1. Open SVG in Preview
2. File → Export
3. Format: PNG
4. Size: Match original (16, 48, 128)

### 4. Set Up Gumroad

1. **Create Account**: https://gumroad.com/signup
2. **Create Product**:
   - Title: "Vibe Switch Pro License"
   - Price: $4.99
   - Enable "Generate license keys"
3. **Get Product Permalink**:
   - It looks like: `vibeswitch-pro` or similar
   - Update in `background.js` line 32

### 5. Test Extension Locally

```bash
# 1. Open Chrome
# 2. Navigate to chrome://extensions/
# 3. Enable "Developer mode"
# 4. Click "Load unpacked"
# 5. Select the /extension folder
# 6. Test on chatgpt.com, claude.ai, gemini.google.com
```

**Test Checklist**:
- [ ] Extension loads without errors
- [ ] Sidebar appears on supported sites
- [ ] Can select free vibes
- [ ] Locked vibes show upgrade modal
- [ ] Popup opens correctly
- [ ] License activation works (use test key)

### 6. Create ZIP Package

```bash
cd extension
zip -r ../vibe-switch-v1.0.0.zip * -x "*.DS_Store" -x "*.git*"
```

Or manually:
1. Select all files in `extension/` folder
2. Right-click → Compress
3. Rename to `vibe-switch-v1.0.0.zip`

---

## 📋 Chrome Web Store Submission

### Step 1: Developer Account

1. Go to: https://chrome.google.com/webstore/devconsole
2. **One-time fee**: $5 USD developer registration
3. Pay and verify email

### Step 2: Upload Extension

1. Click "New Item"
2. Upload `vibe-switch-v1.0.0.zip`
3. Wait for automated checks to complete

### Step 3: Store Listing

#### Product Details

**Title** (max 75 chars):
```
Vibe Switch - Pro Tools for ChatGPT, Claude & Gemini
```

**Summary** (max 132 chars):
```
Transform your AI prompts with personality. 20+ expert vibes for better conversations on ChatGPT, Claude & Gemini.
```

**Description** (max 16,000 chars):
```markdown
# 🎯 Transform Your AI Conversations

Vibe Switch adds powerful personality modes to ChatGPT, Claude, and Gemini. Switch between 20+ expert "vibes" to get better, more tailored responses.

## ✨ What is Vibe Switch?

A vibe is a pre-configured system prompt that transforms how the AI responds. Instead of generic answers, get responses from a:

- 📝 Senior Copy Editor (perfect grammar)
- 💻 Staff Engineer (clean, production-ready code)  
- 🎓 Socratic Tutor (teaches with questions)
- 📊 Data Analyst (formulas and insights)
- ✍️ Novelist (engaging storytelling)
- ...and 20+ more!

## 🚀 Free Features

✅ 3 Expert Vibes (Grammar Pro, Code Expert, TL;DR)
✅ Works on ChatGPT, Claude & Gemini
✅ Beautiful sidebar interface
✅ Keyboard shortcuts
✅ No account required

## 💎 Pro Features - $4.99

⭐ 20+ Expert Vibes across 5 categories:
   • Writing (Grammar, Email, Copywriting, Executive)
   • Learning (ELI5, Socratic, Summarizer, Devil's Advocate)
   • Career (Resume, Meetings, Negotiation, Excel)
   • Technical (Code, Security, Legal, Culinary)
   • Creative (UX/UI, Screenwriting, Comedy, Poetry)
   • Lifestyle (Travel, Gifts, Fitness, D&D, Philosophy)

⭐ Create Unlimited Custom Vibes
⭐ Advanced Vibe Tuner (5 dimensions)
⭐ Priority Support

## 🔐 Privacy First

• All data stored locally on your device
• No tracking or analytics
• No external servers
• Open source code
• See full privacy policy in extension

## 🎯 How It Works

1. Install extension
2. Visit ChatGPT, Claude, or Gemini
3. Click Vibe Switch sidebar
4. Select a vibe
5. Type your prompt as normal
6. Get enhanced, personality-driven responses

## 💬 Perfect For

• Writers seeking polished prose
• Developers writing better code
• Students learning complex topics
• Professionals drafting emails
• Creators brainstorming ideas
• Anyone wanting better AI conversations

## 🛠️ Technical Details

✅ Manifest V3 (latest standard)
✅ Lightweight (<100KB)
✅ Fast performance
✅ No external dependencies
✅ Works offline (after setup)

## 📞 Support

• Email: support@vibeswitch.app
• Help Center: vibeswitch.app/help
• Updates: Follow @vibeswitch

---

Transform your AI conversations today with Vibe Switch! 🎉
```

**Category**:
- Primary: "Productivity"
- Secondary: "Communication"

**Language**:
- English

#### Visual Assets

**Icon** (128x128 PNG):
- Use `extension/icons/icon128.png`

**Screenshots** (1280x800 or 640x400 PNG - Required: minimum 1, max 5):

Create screenshots showing:
1. Extension sidebar in action on ChatGPT
2. Vibe selection interface
3. Before/After prompt comparison
4. Pro upgrade modal
5. Custom vibe creation form

**Tips for screenshots**:
- Use ChatGPT/Claude interface as background
- Show real examples of vibes in action
- Add annotations to highlight features
- Use 1280x800 resolution for clarity

**Promotional Images** (440x280 PNG - Optional but recommended):
- Small tile for store
- Shows icon + "Vibe Switch" text
- Eye-catching gradient background

#### Privacy & Permissions

**Privacy Policy URL**:
```
https://vibeswitch.app/privacy
```
(Or host `PRIVACY.md` on GitHub Pages)

**Justification for Permissions**:

**storage**:
```
Required to save user preferences, custom vibes, and license status locally.
```

**activeTab**:
```
Required to inject the Vibe Switch sidebar on ChatGPT, Claude, and Gemini websites.
```

**scripting**:
```
Required to add the sidebar interface and modify prompts with personality instructions.
```

**Host permissions (chatgpt.com, claude.ai, gemini.google.com)**:
```
Required to function on these AI chat platforms where users want to enhance their prompts.
```

#### Single Purpose Statement

```
Vibe Switch enhances AI chat conversations by applying expert personality modes to user prompts on ChatGPT, Claude, and Gemini.
```

### Step 4: Distribution

**Visibility**:
- [x] Public
- [ ] Unlisted

**Regions**:
- [x] All regions (default)

**Pricing**:
- Extension: Free
- In-extension purchase: $4.99 (via Gumroad)

---

## 🎨 Marketing Assets Needed

Before submission, create:

### 1. Screenshots (Required)
- [ ] Screenshot 1: Sidebar on ChatGPT showing vibe list
- [ ] Screenshot 2: Prompt before/after with vibe applied
- [ ] Screenshot 3: Pro modal showing upgrade
- [ ] Screenshot 4: Custom vibe creation form
- [ ] Screenshot 5: Extension popup with license activation

### 2. Promotional Tile (Recommended)
- [ ] 440x280 PNG with icon and branding

### 3. Website Landing Page (Highly Recommended)
Create simple page at https://vibeswitch.app with:
- Hero section explaining what it is
- Feature list with screenshots
- Pricing ($4.99 Pro)
- Privacy policy link
- Support email

Can use: Carrd, Webflow, or host on GitHub Pages

---

## ⚠️ Common Rejection Reasons (Avoid These!)

### 1. Invalid Icons
- ❌ Using SVG instead of PNG
- ✅ Convert to PNG at exact sizes

### 2. Missing Privacy Policy
- ❌ No policy URL
- ✅ Host PRIVACY.md online

### 3. Unclear Permissions
- ❌ Generic justifications
- ✅ Specific use case for each permission

### 4. Misleading Branding
- ❌ Using "ChatGPT" in title
- ✅ Using "for ChatGPT" is OK

### 5. Broken Functionality
- ❌ Extension errors in console
- ✅ Test thoroughly before upload

---

## 📊 Post-Submission

### Review Timeline
- Initial review: 1-3 business days
- If changes needed: Resubmit → 1-2 days
- Typical total: 3-7 days to go live

### After Approval

1. **Announce Launch**:
   - Twitter/X
   - Product Hunt
   - Reddit (r/ChatGPT, r/ClaudeAI)
   - Hacker News (Show HN)

2. **Monitor**:
   - Reviews in Chrome Web Store
   - Support emails
   - Gumroad sales

3. **Update Regularly**:
   - Fix bugs
   - Add new vibes
   - Improve UI based on feedback

---

## 🆘 Need Help?

### Resources
- Chrome Web Store Docs: https://developer.chrome.com/docs/webstore/
- Extension Development: https://developer.chrome.com/docs/extensions/
- Gumroad Help: https://help.gumroad.com

### Troubleshooting

**"Manifest not valid"**
- Check JSON syntax in manifest.json
- Ensure all icons exist and are PNG

**"Privacy policy required"**
- Host PRIVACY.md online (GitHub Pages is free)
- Add URL to manifest.json

**"Permission justification insufficient"**
- Be specific about HOW each permission is used
- Reference exact features

---

## ✅ Final Check Before Submit

- [ ] All icons are PNG format (not SVG)
- [ ] Gumroad product created and permalink added
- [ ] Privacy policy hosted online
- [ ] Tested on all 3 sites (ChatGPT, Claude, Gemini)
- [ ] License activation works
- [ ] No console errors
- [ ] ZIP file created (under 10MB)
- [ ] Screenshots prepared (1280x800)
- [ ] Store listing written
- [ ] $5 developer fee paid

---

**Ready? Let's ship! 🚀**

Submit at: https://chrome.google.com/webstore/devconsole
