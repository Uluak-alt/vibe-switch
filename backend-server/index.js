// Simple backend server to validate Gumroad licenses
// Deploy this on Vercel, Netlify, or any Node.js host

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// Your Gumroad access token (KEEP THIS SECRET!)
const GUMROAD_ACCESS_TOKEN = 'YOUR_GUMROAD_ACCESS_TOKEN_HERE';

app.post('/api/validate-license', async (req, res) => {
  const { license_key, product_id } = req.body;

  if (!license_key || !product_id) {
    return res.json({ success: false, message: 'Missing parameters' });
  }

  try {
    // Call Gumroad API to verify and increment uses
    const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'product_permalink': product_id,
        'license_key': license_key,
        'increment_uses_count': 'true' // This prevents unlimited reuse!
      })
    });

    const data = await response.json();

    if (data.success) {
      res.json({
        success: true,
        uses: data.uses,
        purchase: data.purchase
      });
    } else {
      res.json({
        success: false,
        message: data.message || 'Invalid license'
      });
    }
  } catch (error) {
    console.error('Gumroad API error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`License validation server running on port ${PORT}`);
});
