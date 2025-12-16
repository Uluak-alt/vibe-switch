# Privacy Policy for Vibe Switch

**Last Updated: December 15, 2025**

## Overview

Vibe Switch ("we", "our", or "the extension") is committed to protecting your privacy. This Privacy Policy explains how we handle information in our Chrome extension.

## Data Collection

### What We Collect

Vibe Switch collects and stores the following data **ONLY locally on your device**:

1. **User Preferences**
   - Selected personality/vibe
   - Custom vibe configurations you create
   - UI preferences (collapsed/expanded state)
   
2. **License Information**
   - Pro license key (if purchased)
   - License activation status

### What We DON'T Collect

- ❌ Your chat conversations or prompts
- ❌ Personal information
- ❌ Browsing history
- ❌ Any data sent to external servers
- ❌ Analytics or usage statistics
- ❌ Cookies or tracking data

## Data Storage

All data is stored locally using Chrome's built-in storage API (`chrome.storage`):

- **chrome.storage.sync**: User preferences and custom vibes (synced across your Chrome browsers)
- **chrome.storage.local**: License information and UI state (device-specific)

This data never leaves your browser except:
- Sync data goes through Google's Chrome Sync (if you have Chrome Sync enabled)
- License validation communicates with Gumroad's API (only when you activate a license)

## Third-Party Services

### Gumroad License Validation

When you purchase and activate a Pro license, we communicate with Gumroad's API to validate your license key:

- **Purpose**: Verify license authenticity
- **Data Sent**: License key and product ID only
- **Frequency**: Only during activation
- **Gumroad Privacy**: See [Gumroad's Privacy Policy](https://gumroad.com/privacy)

We do NOT:
- Store your payment information
- Access your Gumroad account details
- Send any personal information to Gumroad

### Website Interactions

The extension operates on these websites:
- chatgpt.com
- gemini.google.com

**We only**:
- Inject our sidebar interface
- Read text from input fields when you press Enter (to add personality instructions)
- Never send this data anywhere

## Permissions Explained

### Required Permissions

1. **storage**
   - Purpose: Save your preferences and custom vibes locally
   - Scope: Only accessible by this extension

2. **activeTab**
   - Purpose: Inject sidebar on supported chat websites
   - Scope: Only when you visit ChatGPT or Gemini

3. **scripting**
   - Purpose: Add the Vibe Switch interface to web pages
   - Scope: Limited to declared host sites

### Host Permissions

We request access to:
- `*://chatgpt.com/*`
- `*://gemini.google.com/*`

**Purpose**: Inject the Vibe Switch sidebar and modify your prompts with personality instructions.

**We Cannot**: Access any other websites or data outside these domains.

## Data Security

- All data is stored using Chrome's secure storage APIs
- License keys are validated through HTTPS
- No passwords or payment information is handled by the extension
- Open source code available for audit

## Children's Privacy

Vibe Switch is not directed at children under 13. We do not knowingly collect information from children.

## Changes to Privacy Policy

We may update this policy occasionally. Changes will be posted:
- In this document with a new "Last Updated" date
- On our website: https://vibeswitch.app/privacy
- In the Chrome Web Store listing

## Your Rights

You have the right to:
- Access your stored data via `chrome://extensions` → Vibe Switch → "Inspect views: service worker" → Storage
- Delete all data by removing the extension
- Request information about your data (though we don't have access to it)

## Contact Us

Questions about privacy?

- Email: privacy@vibeswitch.app
- Website: https://vibeswitch.app/privacy
- GitHub: https://github.com/yourusername/vibe-switch/issues

## Compliance

This extension complies with:
- ✅ Chrome Web Store Developer Program Policies
- ✅ GDPR (we don't collect personal data)
- ✅ CCPA (California Consumer Privacy Act)
- ✅ Google's Limited Use Requirements

## Summary

**In Plain English:**

Vibe Switch is a privacy-first extension. We:
- Store your settings locally on your device
- Never collect your chat conversations
- Never track you
- Only communicate with Gumroad to verify license keys
- Are completely transparent (open source)

Your data stays on your device. Period.

---

Last Updated: December 15, 2025
