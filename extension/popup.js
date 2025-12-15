// popup.js - Vibe Switch Popup Logic

document.addEventListener('DOMContentLoaded', async () => {
  const statusText = document.getElementById('status-text');
  const statusBadge = document.getElementById('status-badge');
  const freeContent = document.getElementById('free-content');
  const proContent = document.getElementById('pro-content');
  const successMessage = document.getElementById('success-message');
  const errorMessage = document.getElementById('error-message');
  
  const buyBtn = document.getElementById('buy-btn');
  const activateBtn = document.getElementById('activate-btn');
  const deactivateBtn = document.getElementById('deactivate-btn');
  const licenseInput = document.getElementById('license-input');
  const licenseKeyDisplay = document.getElementById('license-key-display');

  // Check Pro status
  function checkProStatus() {
    chrome.storage.local.get(['isPro', 'licenseKey'], (result) => {
      if (result.isPro) {
        showProUI(result.licenseKey);
      } else {
        showFreeUI();
      }
    });
  }

  function showProUI(licenseKey) {
    statusText.textContent = 'Pro';
    statusBadge.textContent = 'PRO';
    statusBadge.classList.remove('badge-free');
    statusBadge.classList.add('badge-pro');
    freeContent.style.display = 'none';
    proContent.style.display = 'block';
    
    // Mask license key for security
    if (licenseKey) {
      const masked = licenseKey.substring(0, 8) + '...' + licenseKey.substring(licenseKey.length - 4);
      licenseKeyDisplay.textContent = masked;
    }
  }

  function showFreeUI() {
    statusText.textContent = 'Free';
    statusBadge.textContent = 'FREE';
    statusBadge.classList.add('badge-free');
    statusBadge.classList.remove('badge-pro');
    freeContent.style.display = 'block';
    proContent.style.display = 'none';
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
      errorMessage.style.display = 'none';
    }, 5000);
  }

  function showSuccess() {
    successMessage.style.display = 'block';
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 5000);
  }

  // Buy button - opens Gumroad
  buyBtn.addEventListener('click', () => {
    // Replace with your actual Gumroad product URL
    chrome.tabs.create({ url: 'https://vibeswitch.gumroad.com/l/vibeswitch' });
  });

  // Activate license
  activateBtn.addEventListener('click', async () => {
    const licenseKey = licenseInput.value.trim();
    
    if (!licenseKey) {
      showError('Please enter a license key');
      return;
    }

    if (licenseKey.length < 8) {
      showError('Invalid license key format');
      return;
    }

    // Disable button while processing
    activateBtn.disabled = true;
    activateBtn.textContent = 'Verifying...';

    try {
      // Send to background script for validation
      chrome.runtime.sendMessage(
        { action: 'validateLicense', licenseKey: licenseKey },
        (response) => {
          if (response && response.success) {
            showSuccess();
            licenseInput.value = '';
            checkProStatus();
          } else {
            showError(response?.message || 'Invalid license key. Please try again.');
          }
          
          activateBtn.disabled = false;
          activateBtn.textContent = 'Activate License';
        }
      );
    } catch (error) {
      console.error('Activation error:', error);
      showError('Activation failed. Please try again.');
      activateBtn.disabled = false;
      activateBtn.textContent = 'Activate License';
    }
  });

  // Deactivate license
  deactivateBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to deactivate your Pro license?')) {
      chrome.storage.local.set({ isPro: false, licenseKey: null }, () => {
        checkProStatus();
      });
    }
  });

  // Allow Enter key to activate
  licenseInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      activateBtn.click();
    }
  });

  // Initial check
  checkProStatus();
});
