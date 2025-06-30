const express = require('express');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Load MCP configuration
let mcpConfig = {};
const configPath = path.join(__dirname, '..', 'mcp-config.json');

async function loadConfig() {
  try {
    const data = await fs.readFile(configPath, 'utf8');
    mcpConfig = JSON.parse(data);
    console.log(`📋 Loaded ${Object.keys(mcpConfig.services).length} MCP services`);
  } catch (error) {
    console.error('Failed to load MCP config:', error.message);
    mcpConfig = { services: {} };
  }
}

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${JSON.stringify(req.body)}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: '✅ Alive', service: 'control-tower', port: PORT });
});

// Dashboard - show all MCP services
app.get('/', async (req, res) => {
  try {
    const services = {};
    
    for (const [name, config] of Object.entries(mcpConfig.services || {})) {
      try {
        const response = await axios.get(`${config.url}/health`, { timeout: 3000 });
        services[name] = {
          ...config,
          status: response.data.status || '✅ Online',
          healthy: true,
          last_checked: new Date().toISOString()
        };
      } catch (error) {
        services[name] = {
          ...config,
          status: '❌ Offline',
          healthy: false,
          error: error.message,
          last_checked: new Date().toISOString()
        };
      }
    }

    const healthyCount = Object.values(services).filter(s => s.healthy).length;
    const totalCount = Object.keys(services).length;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>MCP Lab Control Tower</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 20px; background: #f5f5f5; }
        .header { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .service { background: white; margin: 10px 0; padding: 15px; border-radius: 8px; border-left: 4px solid #ddd; }
        .service.online { border-left-color: #28a745; }
        .service.offline { border-left-color: #dc3545; }
        .status { font-weight: bold; }
        .online { color: #28a745; }
        .offline { color: #dc3545; }
        .stats { display: flex; gap: 20px; margin: 20px 0; }
        .stat { background: white; padding: 15px; border-radius: 8px; text-align: center; }
        .categories { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .category { background: white; padding: 20px; border-radius: 8px; }
        .category h3 { margin-top: 0; color: #333; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏗️ MCP Lab Control Tower</h1>
        <p>Central management for all MCP services</p>
        <div class="stats">
            <div class="stat">
                <h3>${totalCount}</h3>
                <p>Total Services</p>
            </div>
            <div class="stat">
                <h3 class="online">${healthyCount}</h3>
                <p>Online</p>
            </div>
            <div class="stat">
                <h3 class="offline">${totalCount - healthyCount}</h3>
                <p>Offline</p>
            </div>
        </div>
    </div>
    
    <div class="categories">
        ${generateCategoryHTML(services)}
    </div>
    
    <script>
        // Auto-refresh every 30 seconds
        setTimeout(() => location.reload(), 30000);
    </script>
</body>
</html>`;

    res.send(html);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: error.message });
  }
});

function generateCategoryHTML(services) {
  const categories = {
    dev: { title: '🛠️ Development', services: [] },
    integration: { title: '🔗 Integration', services: [] },
    devops: { title: '⚙️ DevOps', services: [] }
  };

  Object.entries(services).forEach(([name, service]) => {
    if (categories[service.category]) {
      categories[service.category].services.push({ name, ...service });
    }
  });

  return Object.entries(categories).map(([key, cat]) => {
    if (cat.services.length === 0) return '';
    
    return `
      <div class="category">
        <h3>${cat.title}</h3>
        ${cat.services.map(s => `
          <div class="service ${s.healthy ? 'online' : 'offline'}">
            <h4>${s.name}</h4>
            <p><strong>Port:</strong> ${s.port} | <strong>Status:</strong> <span class="status ${s.healthy ? 'online' : 'offline'}">${s.status}</span></p>
            <p>${s.description}</p>
            ${s.healthy ? `<a href="${s.url}/health" target="_blank">Health Check</a>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }).join('');
}

// Proxy requests to specific MCP services
app.use('/proxy/:service/*', async (req, res) => {
  try {
    const { service } = req.params;
    const targetPath = req.params[0];
    
    const serviceConfig = mcpConfig.services[service];
    if (!serviceConfig) {
      return res.status(404).json({ error: `Service ${service} not found` });
    }

    const targetUrl = `${serviceConfig.url}/${targetPath}`;
    
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      params: req.query,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers
      },
      timeout: 30000
    });

    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: error.message,
      response: error.response?.data
    });
  }
});

// Get all services status
app.get('/services', async (req, res) => {
  try {
    const services = {};
    
    for (const [name, config] of Object.entries(mcpConfig.services || {})) {
      try {
        const response = await axios.get(`${config.url}/health`, { timeout: 3000 });
        services[name] = {
          ...config,
          status: 'online',
          healthy: true,
          response: response.data
        };
      } catch (error) {
        services[name] = {
          ...config,
          status: 'offline',
          healthy: false,
          error: error.message
        };
      }
    }

    res.json({ success: true, services });
  } catch (error) {
    console.error('Services status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Reload configuration
app.post('/reload-config', async (req, res) => {
  try {
    await loadConfig();
    res.json({ 
      success: true, 
      message: 'Configuration reloaded',
      services: Object.keys(mcpConfig.services).length
    });
  } catch (error) {
    console.error('Config reload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Initialize and start server
async function start() {
  await loadConfig();
  
  app.listen(PORT, () => {
    console.log(`🏗️ MCP Control Tower running on port ${PORT}`);
    console.log(`Dashboard: http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Services: http://localhost:${PORT}/services`);
  });
}

start().catch(console.error);

/*
Sample usage:

# View dashboard
open http://localhost:4000

# Get services status
curl -X GET http://localhost:4000/services

# Proxy to a service
curl -X POST http://localhost:4000/proxy/puppeteer-mcp/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Reload configuration
curl -X POST http://localhost:4000/reload-config
*/