const express = require('express');
const { chromium, firefox, webkit } = require('playwright');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4046;

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${JSON.stringify(req.body)}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: '✅ Alive', service: 'playwright-mcp', port: PORT });
});

// Navigate to page and interact
app.post('/navigate', async (req, res) => {
  let browser;
  try {
    const { 
      url, 
      browserType = 'chromium',
      headless = true,
      actions = []
    } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Launch browser
    const browsers = { chromium, firefox, webkit };
    browser = await browsers[browserType].launch({ headless });
    const page = await browser.newPage();
    
    // Navigate to URL
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // Execute actions
    const results = [];
    for (const action of actions) {
      try {
        const result = await executeAction(page, action);
        results.push({ action, result, success: true });
      } catch (error) {
        results.push({ action, error: error.message, success: false });
      }
    }
    
    await browser.close();

    res.json({ 
      success: true, 
      url,
      browserType,
      actions: results
    });
  } catch (error) {
    if (browser) await browser.close();
    console.error('Navigate error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Take screenshot
app.post('/screenshot', async (req, res) => {
  let browser;
  try {
    const { 
      url, 
      browserType = 'chromium',
      fullPage = true,
      filename = 'screenshot.png'
    } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const browsers = { chromium, firefox, webkit };
    browser = await browsers[browserType].launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle' });
    
    const screenshotPath = `./screenshots/${filename}`;
    await page.screenshot({ path: screenshotPath, fullPage });
    
    await browser.close();

    res.json({ 
      success: true, 
      url,
      screenshot: screenshotPath,
      browserType
    });
  } catch (error) {
    if (browser) await browser.close();
    console.error('Screenshot error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Fill form
app.post('/fill-form', async (req, res) => {
  let browser;
  try {
    const { 
      url, 
      formData,
      browserType = 'chromium',
      submit = false
    } = req.body;
    
    if (!url || !formData) {
      return res.status(400).json({ error: 'URL and formData are required' });
    }

    const browsers = { chromium, firefox, webkit };
    browser = await browsers[browserType].launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // Fill form fields
    for (const [selector, value] of Object.entries(formData)) {
      await page.fill(selector, value);
    }
    
    if (submit) {
      await page.click('input[type="submit"], button[type="submit"]');
      await page.waitForLoadState('networkidle');
    }
    
    await browser.close();

    res.json({ 
      success: true, 
      url,
      formData,
      submitted: submit,
      browserType
    });
  } catch (error) {
    if (browser) await browser.close();
    console.error('Fill form error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Extract data from page
app.post('/extract', async (req, res) => {
  let browser;
  try {
    const { 
      url, 
      selectors,
      browserType = 'chromium'
    } = req.body;
    
    if (!url || !selectors) {
      return res.status(400).json({ error: 'URL and selectors are required' });
    }

    const browsers = { chromium, firefox, webkit };
    browser = await browsers[browserType].launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle' });
    
    const extractedData = {};
    for (const [key, selector] of Object.entries(selectors)) {
      try {
        const element = await page.$(selector);
        if (element) {
          extractedData[key] = await element.textContent();
        } else {
          extractedData[key] = null;
        }
      } catch (error) {
        extractedData[key] = { error: error.message };
      }
    }
    
    await browser.close();

    res.json({ 
      success: true, 
      url,
      data: extractedData,
      browserType
    });
  } catch (error) {
    if (browser) await browser.close();
    console.error('Extract error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Wait for element
app.post('/wait-for', async (req, res) => {
  let browser;
  try {
    const { 
      url, 
      selector,
      timeout = 30000,
      browserType = 'chromium'
    } = req.body;
    
    if (!url || !selector) {
      return res.status(400).json({ error: 'URL and selector are required' });
    }

    const browsers = { chromium, firefox, webkit };
    browser = await browsers[browserType].launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForSelector(selector, { timeout });
    
    await browser.close();

    res.json({ 
      success: true, 
      url,
      selector,
      timeout,
      found: true,
      browserType
    });
  } catch (error) {
    if (browser) await browser.close();
    console.error('Wait for error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to execute actions
async function executeAction(page, action) {
  switch (action.type) {
    case 'click':
      await page.click(action.selector);
      return 'clicked';
    case 'type':
      await page.fill(action.selector, action.text);
      return 'typed';
    case 'select':
      await page.selectOption(action.selector, action.value);
      return 'selected';
    case 'scroll':
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      return 'scrolled';
    case 'wait':
      await page.waitForTimeout(action.ms || 1000);
      return 'waited';
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

app.listen(PORT, () => {
  console.log(`🎭 Playwright MCP running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

/*
Sample usage:

# Navigate and interact
curl -X POST http://localhost:4046/navigate \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "actions": [
      {"type": "click", "selector": "#login-button"},
      {"type": "type", "selector": "#username", "text": "user@example.com"}
    ]
  }'

# Take screenshot
curl -X POST http://localhost:4046/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "filename": "example.png"}'

# Fill form
curl -X POST http://localhost:4046/fill-form \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/form",
    "formData": {"#name": "John Doe", "#email": "john@example.com"},
    "submit": true
  }'
*/