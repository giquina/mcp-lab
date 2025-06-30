const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4040;

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${JSON.stringify(req.body)}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: '✅ Alive', service: 'puppeteer-mcp', port: PORT });
});

// Screenshot endpoint
app.post('/screenshot', async (req, res) => {
  try {
    const { url, filename = 'screenshot.png', fullPage = true } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    const screenshotPath = path.join(__dirname, 'screenshots', filename);
    await fs.promises.mkdir(path.dirname(screenshotPath), { recursive: true });
    
    await page.screenshot({ path: screenshotPath, fullPage });
    await browser.close();

    res.json({ 
      success: true, 
      message: 'Screenshot captured', 
      path: screenshotPath,
      url 
    });
  } catch (error) {
    console.error('Screenshot error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PDF generation endpoint
app.post('/pdf', async (req, res) => {
  try {
    const { url, filename = 'page.pdf', format = 'A4' } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    const pdfPath = path.join(__dirname, 'pdfs', filename);
    await fs.promises.mkdir(path.dirname(pdfPath), { recursive: true });
    
    await page.pdf({ path: pdfPath, format });
    await browser.close();

    res.json({ 
      success: true, 
      message: 'PDF generated', 
      path: pdfPath,
      url 
    });
  } catch (error) {
    console.error('PDF error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Page content scraping
app.post('/scrape', async (req, res) => {
  try {
    const { url, selector } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    let content;
    if (selector) {
      content = await page.$eval(selector, el => el.textContent);
    } else {
      content = await page.content();
    }
    
    await browser.close();

    res.json({ 
      success: true, 
      content,
      url,
      selector 
    });
  } catch (error) {
    console.error('Scrape error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🎭 Puppeteer MCP running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

/*
Sample usage:

# Take screenshot
curl -X POST http://localhost:4040/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "filename": "example.png"}'

# Generate PDF
curl -X POST http://localhost:4040/pdf \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "filename": "example.pdf"}'

# Scrape content
curl -X POST http://localhost:4040/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "selector": "h1"}'
*/