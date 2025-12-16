// background.js - Vibe Switch Service Worker

// Initialize extension state on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ 
    activePersonality: 'default', 
    customVibes: [],
    lastSelectedVibe: null 
  });
  chrome.storage.local.set({ 
    isPro: false,
    isCollapsed: false,
    licenseKey: null
  });
  console.log('Vibe Switch installed successfully');
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'validateLicense') {
    validateGumroadLicense(request.licenseKey)
      .then(isValid => {
        if (isValid) {
          chrome.storage.local.set({ 
            isPro: true, 
            licenseKey: request.licenseKey 
          });
          sendResponse({ success: true, message: 'License activated!' });
        } else {
          sendResponse({ success: false, message: 'Invalid license key' });
        }
      })
      .catch(error => {
        console.error('License validation error:', error);
        sendResponse({ success: false, message: 'Validation failed. Please try again.' });
      });
    return true; // Will respond asynchronously
  }
  
  if (request.action === 'checkProStatus') {
    chrome.storage.local.get(['isPro', 'licenseKey'], (result) => {
      sendResponse({ isPro: result.isPro || false });
    });
    return true;
  }
});

// Validate license with Gumroad API
async function validateGumroadLicense(licenseKey) {
  if (!licenseKey || licenseKey.length < 8) {
    console.log('License validation failed: Too short');
    return false;
  }

  console.log('Validating license key:', licenseKey.substring(0, 8) + '...');

  // For testing: Accept any key that matches Gumroad's format
  // Format: XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXX (dashes with alphanumeric)
  const gumroadFormat = /^[A-Z0-9]{8}-[A-Z0-9]{8}-[A-Z0-9]{8}-[A-Z0-9]{5}$/i;
  if (gumroadFormat.test(licenseKey)) {
    console.log('✅ License key format valid - activating Pro');
    return true;
  }

  // Also accept any key 20+ chars for backward compatibility
  if (licenseKey.length >= 20) {
    console.log('✅ License key accepted (20+ chars) - activating Pro');
    return true;
  }

  console.log('❌ License key format invalid');
  return false;

  /* 
  // TODO: Enable real Gumroad validation when you have access token
  // This requires a backend server to keep your API key secret
  try {
    const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'product_id': 'vibeswitch',
        'license_key': licenseKey,
        'increment_uses_count': 'false'
      })
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Gumroad API error:', error);
    return false;
  }
  */
}

// Optional: Listen for tab updates to inject content script dynamically if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const supportedDomains = ['chatgpt.com', 'gemini.google.com'];
    const isSupported = supportedDomains.some(domain => tab.url.includes(domain));
    
    if (isSupported) {
      console.log('Vibe Switch ready on:', tab.url);
    }
  }
});
