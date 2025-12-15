# 🚀 Push to GitHub - Quick Guide

## ✅ What's Ready

Your repository is initialized with:
- ✅ All extension files
- ✅ Complete documentation
- ✅ GitHub Pages website in `/docs` folder
- ✅ Two commits ready to push

## 🎯 Quick Setup (5 minutes)

### Option 1: Use the Automated Script (Easiest)

```bash
./setup-github.sh
```

This script will guide you through:
1. Creating the GitHub repository
2. Pushing your code
3. Setting up GitHub Pages

### Option 2: Manual Setup

#### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Name: `vibe-switch`
3. Description: `Transform your AI chat prompts with personality`
4. Visibility: **Public**
5. **DON'T** check any initialization boxes
6. Click "Create repository"

#### Step 2: Push Your Code

Replace `YOUR_USERNAME` with your GitHub username:

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/vibe-switch.git

# Push to GitHub
git push -u origin main
```

If you need authentication, use a [Personal Access Token](https://github.com/settings/tokens).

#### Step 3: Enable GitHub Pages

1. Go to: `https://github.com/YOUR_USERNAME/vibe-switch/settings/pages`
2. Source: **Deploy from a branch**
3. Branch: **main**
4. Folder: **/docs**
5. Click **Save**
6. Wait 1-2 minutes for deployment

## 🌐 Your URLs

After setup, you'll have:

```
Repository:  https://github.com/YOUR_USERNAME/vibe-switch
Website:     https://YOUR_USERNAME.github.io/vibe-switch/
Privacy:     https://YOUR_USERNAME.github.io/vibe-switch/extension/PRIVACY.md
```

## 🔧 Update Extension Files

Once GitHub Pages is live, update these files:

### 1. extension/manifest.json
```json
{
  "homepage_url": "https://YOUR_USERNAME.github.io/vibe-switch/"
}
```

### 2. extension/background.js (line 32)
```javascript
'product_id': 'your-gumroad-permalink',  // After you create Gumroad product
```

### 3. docs/index.html (multiple places)
Replace `yourusername` with your actual GitHub username in links

## 📝 Commit and Push Updates

After making changes:

```bash
git add .
git commit -m "Update URLs with actual GitHub username"
git push
```

## 🎯 Use Your URLs For

1. **Chrome Web Store Submission**:
   - Homepage URL: `https://YOUR_USERNAME.github.io/vibe-switch/`
   - Privacy Policy: `https://YOUR_USERNAME.github.io/vibe-switch/extension/PRIVACY.md`

2. **Gumroad Product Page**:
   - Website: `https://YOUR_USERNAME.github.io/vibe-switch/`
   - Product link: Add Chrome Web Store link when available

3. **Social Media**:
   - Share your GitHub Pages site as the official landing page

## 🐛 Troubleshooting

### Authentication Issues
If push fails with authentication error:

**Option 1: Personal Access Token (Recommended)**
1. Go to: https://github.com/settings/tokens/new
2. Note: "Vibe Switch Extension"
3. Expiration: 90 days
4. Scopes: Check `repo` (all)
5. Generate token
6. Use token as password when pushing

**Option 2: SSH Key**
```bash
# Switch to SSH
git remote set-url origin git@github.com:YOUR_USERNAME/vibe-switch.git
git push -u origin main
```

### GitHub Pages Not Loading
- Wait 2-3 minutes after enabling
- Check Settings → Pages shows "Your site is live"
- Clear browser cache
- Try incognito/private mode

### 404 on Privacy Policy
The full URL should be:
```
https://YOUR_USERNAME.github.io/vibe-switch/extension/PRIVACY.md
```

GitHub automatically renders `.md` files as HTML.

## ✅ Verification Checklist

After setup:
- [ ] Repository is public on GitHub
- [ ] Code is pushed and visible
- [ ] GitHub Pages is enabled
- [ ] Website loads at `https://YOUR_USERNAME.github.io/vibe-switch/`
- [ ] Privacy policy accessible
- [ ] Updated manifest.json with correct homepage_url
- [ ] Updated docs/index.html with your username
- [ ] Committed and pushed all changes

## 🎉 You're Done!

Once everything is live:
1. ✅ Use GitHub Pages URL in Chrome Web Store submission
2. ✅ Use it in your Gumroad product page
3. ✅ Share it on social media
4. ✅ Include it in extension popup

---

**Need Help?**
- GitHub Pages Docs: https://docs.github.com/en/pages
- GitHub Auth: https://docs.github.com/en/authentication

**Ready to Submit?**
Open `SUBMISSION_GUIDE.md` for Chrome Web Store walkthrough!
