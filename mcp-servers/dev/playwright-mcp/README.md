# Playwright MCP

**Port:** 4046  
**Purpose:** Advanced browser automation with Playwright - navigation, interaction, and data extraction

## Features

- 🌐 Multi-browser support (Chromium, Firefox, WebKit)
- 🖱️ Advanced page interactions (click, type, select, scroll)
- 📸 Screenshot capture
- 📝 Form filling and submission
- 🔍 Data extraction from pages
- ⏱️ Element waiting and synchronization
- 🏥 Health monitoring endpoint

## API Endpoints

### Health Check
```bash
GET /health
```

### Navigate and Interact
```bash
curl -X POST http://localhost:4046/navigate \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "browserType": "chromium",
    "headless": true,
    "actions": [
      {"type": "click", "selector": "#login-button"},
      {"type": "type", "selector": "#username", "text": "user@example.com"},
      {"type": "wait", "ms": 2000}
    ]
  }'
```

### Take Screenshot
```bash
curl -X POST http://localhost:4046/screenshot \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "browserType": "chromium",
    "fullPage": true,
    "filename": "example.png"
  }'
```

### Fill Form
```bash
curl -X POST http://localhost:4046/fill-form \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/contact",
    "formData": {
      "#name": "John Doe",
      "#email": "john@example.com",
      "#message": "Hello world"
    },
    "submit": true,
    "browserType": "chromium"
  }'
```

### Extract Data
```bash
curl -X POST http://localhost:4046/extract \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "selectors": {
      "title": "h1",
      "description": ".description",
      "price": ".price"
    },
    "browserType": "chromium"
  }'
```

### Wait for Element
```bash
curl -X POST http://localhost:4046/wait-for \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "selector": "#dynamic-content",
    "timeout": 30000,
    "browserType": "chromium"
  }'
```

## Supported Browsers

- `chromium` - Google Chrome/Chromium (default)
- `firefox` - Mozilla Firefox
- `webkit` - Safari WebKit

## Action Types

- `click` - Click on element
- `type` - Type text into input
- `select` - Select option from dropdown
- `scroll` - Scroll page
- `wait` - Wait for specified time

## Usage

1. Install dependencies: `npm install playwright express dotenv`
2. Install browser binaries: `npx playwright install`
3. Start server: `npm start`
4. Screenshots saved to: `./screenshots/`

## Browser Options

- `headless` - Run without GUI (default: true)
- `timeout` - Operation timeout in milliseconds
- `viewport` - Browser viewport size
- `userAgent` - Custom user agent string