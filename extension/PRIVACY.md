# Privacy Policy for Vibe Switch

**Last Updated: December 16, 2025**

## Overview

Vibe Switch (hereinafter "the extension") is committed to protecting your privacy. This Privacy Policy explains how the extension manages the minimal data required for its operation.

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

All data is stored locally using Chrome's built-in storage API (`chrome.storage`), though certain subsets of this data are transmitted only under specific conditions, namely:

- **chrome.storage.sync**: User preferences and custom vibes (synchronized across your Chrome browsers via Google's Chrome Sync service)
- **chrome.storage.local**: License information and UI state (device-specific)

**Third-Party Sync Disclaimer:** Vibe Switch does not control, and is not responsible for, the security and privacy practices of Google's Chrome Sync service. By enabling Chrome Sync, you acknowledge and accept Google's policies and procedures regarding the transfer and storage of your synced data.

**Data Transmission Exceptions:**
1. Sync data is transmitted through Google's Chrome Sync (only if you have Chrome Sync enabled in your browser)
2. License validation communicates with Gumroad's API (only when you activate a Pro license)

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

**Functionality:**
- The extension injects a sidebar interface for vibe selection
- The extension intercepts and reads text from the chat input field momentarily, solely for the purpose of locally prepending or appending the selected personality instructions to the prompt before it is submitted to the third-party chat service
- This content is neither stored nor transmitted by Vibe Switch
- The modified prompt (user text + personality instructions) is then sent directly to the third-party service (ChatGPT or Gemini) by your browser, following that service's own privacy practices

## Permissions Explained

### Required Permissions

1. **storage**
   - Purpose: Save your preferences and custom vibes locally
   - Scope: Only accessible by this extension

2. **activeTab**
   - Purpose: Inject sidebar on supported chat websites
   - Scope: The activeTab permission is a temporary, minimal permission that only grants the extension access to the current tab when you actively interact with the extension icon, and access is automatically revoked when you leave the tab

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
- Open source code available for audit at https://github.com/Uluak-alt/vibe-switch

## Limitation of Liability

**IMPORTANT LEGAL DISCLAIMER:**

In no event shall Vibe Switch, its developers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:

(i) the use or inability to use the extension;

(ii) any conduct or content of any third party on the extension (including Gumroad or Google's Chrome Sync);

(iii) any unauthorized access, use, or alteration of your data stored locally on your device;

(iv) any errors, bugs, or technical failures in the extension's operation;

(v) any security vulnerabilities in your local device or browser.

**User Responsibility:** You acknowledge that the security of data stored locally on your device is dependent on your device's security measures, browser configuration, and Chrome Sync settings. Vibe Switch cannot guarantee the security of data stored on devices we do not control.

## Children's Privacy

Vibe Switch is not directed at children under 13. We do not knowingly collect information from children.

## Changes to Privacy Policy

We may update this policy occasionally. Changes will be posted:
- In this document with a new "Last Updated" date
- On the GitHub Pages website: https://uluak-alt.github.io/vibe-switch/privacy.html
- In the Chrome Web Store listing

## Your Data Rights

Given the local-only storage model, your data control is primarily exercised by managing the Chrome extension itself:

- **Access**: You may inspect your stored data directly via the Chrome Developer Tools interface: `chrome://extensions` → Vibe Switch → "Inspect views: service worker" → Application tab → Storage
- **Deletion**: You may delete all data by completely removing the Vibe Switch extension from Chrome via `chrome://extensions`
- **Portability**: Your custom vibes and preferences can be exported manually through the browser's developer tools if needed

## Contact Us

Questions about privacy?

- GitHub Issues: https://github.com/Uluak-alt/vibe-switch/issues
- Website: https://uluak-alt.github.io/vibe-switch/

## Regulatory Compliance

**Data Protection Regulations:** As Vibe Switch does not collect, store, or transmit Personal Data (as defined under GDPR and CCPA), the core requirements of these regulations are satisfied. Should our data handling practices change to involve Personal Data, this policy will be immediately updated to reflect specific compliance mechanisms.

**Chrome Web Store Policies:** This extension complies with Chrome Web Store Developer Program Policies and Google's Limited Use Requirements.

**Ongoing Commitment:** The extension's implementation rigorously adheres to the privacy representations made in this policy.

## Summary

**In Plain English:**

Vibe Switch is a privacy-first extension. The extension:
- Stores your settings locally on your device
- Never collects your chat conversations
- Never tracks you
- Only communicates with Gumroad to verify license keys (one-time)
- Is completely transparent with open source code available for audit

Your data stays on your device, subject to the sync and third-party service limitations described above.

---

**Effective Date:** December 16, 2025

**Version:** 1.1

This Privacy Policy sets a high bar for privacy protection. The extension's implementation rigorously adheres to these representations.
