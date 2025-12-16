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

// Generate unique device ID
async function getDeviceId() {
  let deviceId = await chrome.storage.local.get('deviceId');
  if (!deviceId.deviceId) {
    // Create unique device ID from browser fingerprint
    const id = 'device_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    await chrome.storage.local.set({ deviceId: id });
    return id;
  }
  return deviceId.deviceId;
}

// Validate license with Gumroad API
async function validateGumroadLicense(licenseKey) {
  if (!licenseKey || licenseKey.length < 8) {
    console.log('License validation failed: Too short');
    return false;
  }

  console.log('Validating license key:', licenseKey.substring(0, 8) + '...');

  // Validate format first
  const gumroadFormat = /^[A-Z0-9]{8}-[A-Z0-9]{8}-[A-Z0-9]{8}-[A-Z0-9]{4,8}$/i;
  if (!gumroadFormat.test(licenseKey) && licenseKey.length < 20) {
    console.log('❌ License key format invalid. Key:', licenseKey);
    console.log('❌ Format expected: XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXX (or 20+ chars)');
    return false;
  }
  
  console.log('✅ License key format valid');

  try {
    // Call Gumroad API directly to verify license
    const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'product_id': '6wYZgAYhn-FRF3vctgVN-A==',
        'license_key': licenseKey,
        'increment_uses_count': 'false' // Don't increment, just check
      })
    });

    const data = await response.json();
    console.log('📡 Gumroad API response:', data);
    
    if (data.success) {
      console.log('✅ License key is valid with Gumroad');
      
      // Check device binding
      const deviceId = await getDeviceId();
      const result = await chrome.storage.sync.get('licensedDevices');
      const licensedDevices = result.licensedDevices || {};
      
      if (!licensedDevices[licenseKey]) {
        // First time using this license - bind to this device
        licensedDevices[licenseKey] = deviceId;
        await chrome.storage.sync.set({ licensedDevices });
        console.log('✅ License bound to this device');
        return true;
      } else if (licensedDevices[licenseKey] === deviceId) {
        // Same device that originally activated
        console.log('✅ License already bound to this device');
        return true;
      } else {
        // Different device trying to use the same license
        console.log('❌ License already used on a different device');
        return false;
      }
    } else {
      console.log('❌ License validation failed with Gumroad:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ License validation error:', error);
    console.log('⚠️ Network error - Gumroad API may be unavailable');
    return false;
  }

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
