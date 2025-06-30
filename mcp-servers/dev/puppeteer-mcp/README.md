# Puppeteer MCP

**Port:** 4040  
**Purpose:** Website screenshots, PDF generation, and web scraping

## Features

- 📸 Screenshot capture (full page or viewport)
- 📄 PDF generation from web pages
- 🕷️ Content scraping with CSS selectors
- 🏥 Health monitoring endpoint

## API Endpoints

### Health Check
```bash
GET /health
```

### Screenshot
```bash
curl -X POST http://localhost:4040/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "filename": "example.png", "fullPage": true}'
```

### PDF Generation
```bash
curl -X POST http://localhost:4040/pdf \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "filename": "example.pdf", "format": "A4"}'
```

### Content Scraping
```bash
curl -X POST http://localhost:4040/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "selector": "h1"}'
```

## Usage

1. Install dependencies: `npm install puppeteer express dotenv`
2. Start server: `npm start`
3. Screenshots saved to: `./screenshots/`
4. PDFs saved to: `./pdfs/`