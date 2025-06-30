const express = require('express');
const { Anthropic } = require('@anthropic-ai/sdk');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4060;

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// MCP Service registry
const MCP_SERVICES = {
  'puppeteer-mcp': 'http://localhost:4040',
  'file-mcp': 'http://localhost:4041',
  'claude-mcp': 'http://localhost:4042',
  'git-mcp': 'http://localhost:4043',
  'github-mcp': 'http://localhost:4044',
  'test-mcp': 'http://localhost:4045',
  'playwright-mcp': 'http://localhost:4046',
  'deployment-mcp': 'http://localhost:4047',
  'supabase-mcp': 'http://localhost:4050',
  'n8n-mcp': 'http://localhost:4051',
  'docker-mcp': 'http://localhost:4052'
};

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${JSON.stringify(req.body)}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: '✅ Alive', service: 'ai-copilot-mcp', port: PORT });
});

// Main AI Copilot endpoint - processes natural language commands
app.post('/execute', async (req, res) => {
  try {
    const { command, context = {} } = req.body;
    
    if (!command) {
      return res.status(400).json({ error: 'command is required' });
    }

    // Step 1: Analyze the command with Claude to determine intent and actions
    const analysisPrompt = `
You are an AI Copilot for a development automation system. Analyze this command and determine which MCP services to call and in what order.

Available MCP Services:
- puppeteer-mcp (4040): Screenshots, PDFs, web scraping
- file-mcp (4041): File operations (read, write, copy, delete)
- claude-mcp (4042): AI chat, code analysis, summarization
- git-mcp (4043): Git operations (add, commit, push, branch)
- github-mcp (4044): GitHub API (repos, issues, PRs)
- test-mcp (4045): Run tests (Jest, Playwright, Vitest)
- playwright-mcp (4046): Browser automation
- deployment-mcp (4047): Deploy to Vercel, Netlify, Firebase
- supabase-mcp (4050): Database operations, auth, storage
- n8n-mcp (4051): Workflow automation
- docker-mcp (4052): Container management

Command: "${command}"
Context: ${JSON.stringify(context)}

Respond with a JSON object containing:
{
  "intent": "brief description of what user wants",
  "actions": [
    {
      "service": "service-name",
      "endpoint": "/endpoint",
      "method": "POST",
      "data": { /* request data */ },
      "description": "what this step does"
    }
  ],
  "reasoning": "why these actions were chosen"
}

Only include actions that are necessary. Be specific with endpoints and data.
`;

    const analysis = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [{ role: 'user', content: analysisPrompt }]
    });

    let planData;
    try {
      planData = JSON.parse(analysis.content[0].text);
    } catch (error) {
      return res.status(500).json({ 
        error: 'Failed to parse AI analysis',
        raw_analysis: analysis.content[0].text
      });
    }

    // Step 2: Execute the planned actions
    const results = [];
    
    for (const action of planData.actions) {
      try {
        const serviceUrl = MCP_SERVICES[action.service];
        if (!serviceUrl) {
          results.push({
            action,
            error: `Unknown service: ${action.service}`,
            success: false
          });
          continue;
        }

        const response = await axios({
          method: action.method || 'POST',
          url: `${serviceUrl}${action.endpoint}`,
          data: action.data || {},
          timeout: 30000
        });

        results.push({
          action,
          result: response.data,
          success: true
        });
      } catch (error) {
        results.push({
          action,
          error: error.message,
          success: false
        });
      }
    }

    // Step 3: Summarize results
    const summary = results.map(r => 
      r.success ? `✅ ${r.action.description}` : `❌ ${r.action.description}: ${r.error}`
    ).join('\n');

    res.json({ 
      success: true, 
      command,
      intent: planData.intent,
      reasoning: planData.reasoning,
      actions_executed: results.length,
      results,
      summary
    });
  } catch (error) {
    console.error('AI Copilot error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check MCP service health
app.get('/services/health', async (req, res) => {
  try {
    const healthChecks = await Promise.allSettled(
      Object.entries(MCP_SERVICES).map(async ([name, url]) => {
        try {
          const response = await axios.get(`${url}/health`, { timeout: 5000 });
          return { name, url, status: response.data.status, healthy: true };
        } catch (error) {
          return { name, url, status: '❌ Offline', healthy: false, error: error.message };
        }
      })
    );

    const services = healthChecks.map(result => result.value || result.reason);
    const healthyCount = services.filter(s => s.healthy).length;

    res.json({ 
      success: true, 
      services,
      total: services.length,
      healthy: healthyCount,
      unhealthy: services.length - healthyCount
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get available commands/examples
app.get('/commands', (req, res) => {
  const examples = [
    {
      command: "Take a screenshot of example.com and save it as homepage.png",
      services: ["puppeteer-mcp"]
    },
    {
      command: "Create a new file called README.md with project documentation",
      services: ["file-mcp", "claude-mcp"]
    },
    {
      command: "Commit all changes with message 'feat: add new feature' and push to GitHub",
      services: ["git-mcp"]
    },
    {
      command: "Run tests and deploy to Vercel if they pass",
      services: ["test-mcp", "deployment-mcp"]
    },
    {
      command: "Start a Docker container with nginx and map port 8080",
      services: ["docker-mcp"]
    },
    {
      command: "Create a new user in Supabase database with email and password",
      services: ["supabase-mcp"]
    },
    {
      command: "Trigger the user-signup workflow in n8n with user data",
      services: ["n8n-mcp"]
    },
    {
      command: "Analyze the code in main.js and suggest improvements",
      services: ["file-mcp", "claude-mcp"]
    },
    {
      command: "Fill out the contact form on example.com and submit it",
      services: ["playwright-mcp"]
    }
  ];

  res.json({ 
    success: true, 
    examples,
    available_services: Object.keys(MCP_SERVICES)
  });
});

app.listen(PORT, () => {
  console.log(`🤖 AI Copilot MCP running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Commands: http://localhost:${PORT}/commands`);
});

/*
Sample usage:

# Execute natural language command
curl -X POST http://localhost:4060/execute \
  -H "Content-Type: application/json" \
  -d '{
    "command": "Take a screenshot of google.com and save it as google.png",
    "context": {"project": "web-scraping", "environment": "development"}
  }'

# Check service health
curl -X GET http://localhost:4060/services/health

# Get command examples
curl -X GET http://localhost:4060/commands
*/