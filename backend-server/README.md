# Vibe Switch License Validation Server

This backend server validates Gumroad license keys and prevents unlimited reuse.

## Features
- ✅ Validates license keys with Gumroad API
- ✅ Tracks usage count (prevents reuse on unlimited devices)
- ✅ Keeps your API token secret (not exposed in extension)
- ✅ CORS enabled for extension access

## Setup

### Option 1: Deploy on Vercel (Free & Easy)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd backend-server
vercel
```

3. Set environment variable:
```bash
vercel env add GUMROAD_ACCESS_TOKEN
# Paste your Gumroad access token when prompted
```

4. Get your deployment URL (e.g., `https://vibeswitch-api.vercel.app`)

5. Update `extension/background.js`:
   - Replace `YOUR-BACKEND-URL.com` with your Vercel URL

### Option 2: Deploy on Render/Railway/Heroku

1. Create account on hosting platform
2. Connect this repo
3. Set `GUMROAD_ACCESS_TOKEN` environment variable
4. Deploy

## Get Gumroad Access Token

1. Go to https://app.gumroad.com/settings/advanced#application-form
2. Create a new application
3. Copy your access token
4. Add it as environment variable in your hosting platform

## API Endpoint

**POST** `/api/validate-license`

Request:
```json
{
  "license_key": "XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXX",
  "product_id": "vibeswitch"
}
```

Response (Valid):
```json
{
  "success": true,
  "uses": 1,
  "purchase": {
    "email": "customer@example.com",
    "sale_timestamp": "2025-12-16T12:00:00Z"
  }
}
```

Response (Invalid):
```json
{
  "success": false,
  "message": "License key not found"
}
```

## Testing Locally

```bash
npm install
export GUMROAD_ACCESS_TOKEN="your_token_here"
npm start
```

Server runs on http://localhost:3000
