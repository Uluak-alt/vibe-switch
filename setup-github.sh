#!/bin/bash

# GitHub Setup and Push Script for Vibe Switch
# This script helps you push your extension to GitHub and set up GitHub Pages

echo "🚀 Vibe Switch - GitHub Setup"
echo "============================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Run: git init"
    exit 1
fi

# Check if there are commits
if ! git rev-parse HEAD > /dev/null 2>&1; then
    echo "❌ No commits found. Run: git add . && git commit -m 'Initial commit'"
    exit 1
fi

echo "📋 Step 1: Create GitHub Repository"
echo "-----------------------------------"
echo "1. Go to: https://github.com/new"
echo "2. Repository name: vibe-switch"
echo "3. Description: Transform your AI chat prompts with personality"
echo "4. Visibility: Public"
echo "5. DON'T initialize with README (we already have files)"
echo "6. Click 'Create repository'"
echo ""
read -p "Press Enter after you've created the repository..."

echo ""
echo "📋 Step 2: What's your GitHub username?"
read -p "Username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Username required"
    exit 1
fi

REPO_URL="https://github.com/${GITHUB_USERNAME}/vibe-switch.git"

echo ""
echo "📋 Step 3: Adding remote and pushing..."
echo "--------------------------------------"

# Add remote
git remote remove origin 2>/dev/null
git remote add origin "$REPO_URL"

# Rename branch to main if needed
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    git branch -M main
fi

# Push to GitHub
echo "Pushing to: $REPO_URL"
if git push -u origin main; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
else
    echo ""
    echo "⚠️  Push failed. You may need to authenticate."
    echo ""
    echo "Options:"
    echo "1. If using HTTPS, enter your GitHub token when prompted"
    echo "2. Or switch to SSH:"
    echo "   git remote set-url origin git@github.com:${GITHUB_USERNAME}/vibe-switch.git"
    echo "   git push -u origin main"
    echo ""
    exit 1
fi

echo "📋 Step 4: Enable GitHub Pages"
echo "-------------------------------"
echo "1. Go to: https://github.com/${GITHUB_USERNAME}/vibe-switch/settings/pages"
echo "2. Under 'Source', select: Deploy from a branch"
echo "3. Branch: main"
echo "4. Folder: /docs"
echo "5. Click 'Save'"
echo "6. Wait 1-2 minutes for deployment"
echo ""
read -p "Press Enter after you've enabled GitHub Pages..."

echo ""
echo "✅ Setup Complete!"
echo "=================="
echo ""
echo "🌐 Your URLs:"
echo "   Repository: https://github.com/${GITHUB_USERNAME}/vibe-switch"
echo "   Website:    https://${GITHUB_USERNAME}.github.io/vibe-switch/"
echo ""
echo "📋 Next Steps:"
echo "   1. Wait 1-2 minutes for GitHub Pages to deploy"
echo "   2. Visit your website to confirm it's live"
echo "   3. Use the website URL for:"
echo "      - Chrome Web Store homepage_url"
echo "      - Gumroad product page link"
echo "      - Privacy policy hosting"
echo ""
echo "🔧 Update Extension Files:"
echo "   Edit extension/manifest.json:"
echo "     \"homepage_url\": \"https://${GITHUB_USERNAME}.github.io/vibe-switch/\""
echo ""
echo "   Edit extension/background.js (line 32):"
echo "     'product_id': 'your-gumroad-permalink'"
echo ""
echo "🎉 You're ready to submit to Chrome Web Store!"
echo ""
