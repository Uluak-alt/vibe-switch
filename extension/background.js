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
    return false;
  }

  try {
    // Gumroad License Verification API
    // Note: You'll need to replace YOUR_PRODUCT_PERMALINK with your actual product link
    const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'product_id': 'YOUR_PRODUCT_PERMALINK', // Replace with your Gumroad product permalink
        'license_key': licenseKey,
        'increment_uses_count': 'false'
      })
    });

    const data = await response.json();
    
    // Gumroad returns success: true if license is valid
    return data.success === true;
    
  } catch (error) {
    console.error('Gumroad API error:', error);
    // Fallback: Accept any key longer than 20 chars (temporary for testing)
    // REMOVE THIS IN PRODUCTION after setting up Gumroad properly
    return licenseKey.length >= 20;
  }
}

// Optional: Listen for tab updates to inject content script dynamically if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const supportedDomains = ['chatgpt.com', 'claude.ai', 'gemini.google.com'];
    const isSupported = supportedDomains.some(domain => tab.url.includes(domain));
    
    if (isSupported) {
      console.log('Vibe Switch ready on:', tab.url);
    }
  }
});
