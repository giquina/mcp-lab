# 🧠 MCP Lab - AI-Powered Automation Ecosystem

**Your complete automation control center powered by Model Context Protocol (MCP) and AI.**

This is a comprehensive automation ecosystem that allows you to control your entire development workflow through natural language commands. Built with Claude AI integration and designed for maximum productivity.

## 🎯 What is MCP Lab?

MCP Lab is a collection of **microservices (MCPs)** that handle different automation tasks:

- **🛠️ Development Tools**: File operations, Git, GitHub, testing, browser automation
- **🔗 Integrations**: Supabase, n8n, Docker, Google services  
- **⚙️ DevOps**: Deployment, monitoring, AI orchestration
- **🤖 AI Copilot**: Natural language interface to control everything

## 🚀 Quick Start

### 1. Start Control Tower
```bash
cd mcp-lab/mcp-servers/control-tower
npm install && npm start
```
**Dashboard:** http://localhost:4000

### 2. Start Essential Services
```bash
# File operations
cd ../dev/file-mcp && npm install && npm start &

# Git operations  
cd ../git-mcp && npm install && npm start &

# AI Copilot (requires CLAUDE_API_KEY)
cd ../../devops/ai-copilot-mcp && npm install && npm start &
```

### 3. Use Natural Language Commands
```bash
curl -X POST http://localhost:4060/execute \
  -H "Content-Type: application/json" \
  -d '{"command": "Create a README.md file with project documentation"}'
```

## 📊 Control Tower Dashboard

Visit **http://localhost:4000** to see:
- ✅ Service health status
- 🔧 Service categories and descriptions  
- 🌐 Port mappings and endpoints
- 📋 Real-time monitoring

## 🤖 AI Copilot Commands

The AI Copilot (port 4060) accepts natural language and automatically:
1. **Analyzes** your command with Claude AI
2. **Plans** which services to call
3. **Executes** the automation workflow
4. **Reports** results back to you

### Example Commands:

```bash
# Web automation
"Take a screenshot of google.com and save it as google.png"
"Fill out the contact form on mysite.com with name John and email john@example.com"

# Development workflow  
"Commit all changes with message 'feat: add login' and push to GitHub"
"Run all tests and deploy to Vercel if they pass"
"Create a new branch called feature-dashboard"

# File operations
"Create a package.json file with express and dotenv dependencies" 
"Copy all TypeScript files from src/ to dist/"
"Read the README.md file and summarize it"

# Database operations
"Create a new user in Supabase with email test@example.com"
"Get all active users from the database"

# Container management
"Start a Docker container with PostgreSQL on port 5432"
"Stop all running containers"
```

## 🗂️ Service Architecture

### 🛠️ Development MCPs (Ports 4040-4049)
- **puppeteer-mcp** (4040) - Screenshots, PDFs, web scraping
- **file-mcp** (4041) - File operations (read, write, copy, delete)
- **claude-mcp** (4042) - AI chat, code analysis, summarization  
- **git-mcp** (4043) - Git operations (add, commit, push, branch)
- **github-mcp** (4044) - GitHub API (repos, issues, PRs)
- **test-mcp** (4045) - Test runners (Jest, Playwright, Vitest)
- **playwright-mcp** (4046) - Advanced browser automation
- **deployment-mcp** (4047) - Deploy to Vercel, Netlify, Firebase

### 🔗 Integration MCPs (Ports 4050-4059)  
- **supabase-mcp** (4050) - Database operations, auth, storage
- **n8n-mcp** (4051) - Workflow automation
- **docker-mcp** (4052) - Container management
- **google-sheets-mcp** (4053) - Spreadsheet automation *[Coming Soon]*
- **google-maps-mcp** (4054) - Geocoding, directions *[Coming Soon]*
- **notion-mcp** (4055) - Task and database sync *[Coming Soon]*

### ⚙️ DevOps MCPs (Ports 4060-4069)
- **ai-copilot-mcp** (4060) - Natural language command interface
- **workflow-mcp** (4061) - Chain multiple MCPs together *[Coming Soon]*
- **monitoring-mcp** (4062) - Service health monitoring *[Coming Soon]*
- **project-scanner-mcp** (4063) - Repo analysis and auditing *[Coming Soon]*
- **logbook-mcp** (4064) - Action logging and history *[Coming Soon]*

## ⚙️ Environment Setup

### Required API Keys
Create `.env` files in each service directory:

```bash
# claude-mcp & ai-copilot-mcp
CLAUDE_API_KEY=your_anthropic_api_key

# github-mcp & deployment-mcp  
GITHUB_TOKEN=your_github_token

# supabase-mcp
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

# deployment-mcp
VERCEL_TOKEN=your_vercel_token
NETLIFY_AUTH_TOKEN=your_netlify_token

# n8n-mcp
N8N_BASE_URL=http://localhost:5678
N8N_API_KEY=your_n8n_api_key
```

### Installing Dependencies

Each MCP has its own `package.json`. Install dependencies per service:

```bash
cd mcp-lab/mcp-servers/dev/puppeteer-mcp
npm install puppeteer express dotenv

cd ../file-mcp  
npm install express dotenv

cd ../claude-mcp
npm install @anthropic-ai/sdk express dotenv
```

## 🔧 Service Management

### Start All Services
```bash
# From mcp-lab/mcp-servers/
find . -name "index.js" -path "*/dev/*" -exec bash -c 'cd $(dirname {}) && npm start &' \;
find . -name "index.js" -path "*/integration/*" -exec bash -c 'cd $(dirname {}) && npm start &' \;
find . -name "index.js" -path "*/devops/*" -exec bash -c 'cd $(dirname {}) && npm start &' \;
```

### Check Service Health
```bash
curl http://localhost:4000/services
```

### Individual Service Usage
Each MCP can be used independently:

```bash
# File operations
curl -X POST http://localhost:4041/read \
  -H "Content-Type: application/json" \
  -d '{"filePath": "/path/to/file.txt"}'

# Git operations
curl -X POST http://localhost:4043/commit \
  -H "Content-Type: application/json" \
  -d '{"message": "feat: add new feature"}'

# Take screenshot
curl -X POST http://localhost:4040/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "filename": "example.png"}'
```

## 🌐 Development & Extension

### Adding New MCPs

1. Create new directory: `mcp-servers/category/new-mcp/`
2. Add `index.js`, `.env`, `README.md`
3. Update `mcp-config.json`
4. Use ports 4070+ for custom services

### MCP Template Structure
```
new-mcp/
├── index.js          # Express server with /health endpoint
├── .env              # Port and secrets
├── README.md         # Documentation and curl examples
└── package.json      # Dependencies
```

### Port Allocation
- **4000**: Control Tower Dashboard
- **4040-4049**: Development MCPs
- **4050-4059**: Integration MCPs  
- **4060-4069**: DevOps MCPs
- **4070+**: Custom/Future MCPs

## 🔐 Security & Best Practices

- Store API keys in `.env` files (never commit)
- Each MCP runs on isolated port
- Use health checks for monitoring
- Log all requests for debugging
- Validate inputs in all endpoints

## 📱 GitHub Codespaces Ready

This lab includes `.devcontainer/devcontainer.json` for instant setup:

1. Open in GitHub Codespaces
2. All ports auto-forwarded (4000-4100)
3. Node.js + Docker pre-installed  
4. Auto-start Control Tower on launch

## 🎯 Use Cases

- **🤖 AI-Powered Development**: "Build a React component, test it, and deploy"
- **📊 Data Workflows**: "Scrape pricing data and save to database"  
- **🔄 CI/CD Automation**: "Run tests, build, and deploy on success"
- **📧 Communication**: "Send Slack notification when build completes"
- **🗃️ Content Management**: "Generate blog post and publish to CMS"

## 🚀 Deployment

Deploy individual MCPs or the entire lab:

```bash
# Deploy to cloud (via deployment-mcp)
curl -X POST http://localhost:4047/vercel \
  -H "Content-Type: application/json" \
  -d '{"projectPath": "/path/to/mcp-lab", "production": true}'
```

## 📞 Support

- **Issues**: Create GitHub issues for bugs
- **Docs**: Each MCP has detailed README with examples
- **Health**: Monitor via Control Tower dashboard
- **Logs**: Check individual service logs for debugging

---

**🧠 MCP Lab** - From natural language to automated execution. Your AI-powered development companion.

*Built with ❤️ for developers who want to focus on creativity, not repetitive tasks.*