# AI Copilot MCP

**Port:** 4060  
**Purpose:** Natural language interface to control all MCP services - the brain of the MCP Lab

## Features

- 🧠 Natural language command processing
- 🤖 AI-powered action planning with Claude
- 🔗 Automatic MCP service orchestration
- 📊 Service health monitoring
- 📋 Command examples and documentation
- 🏥 Health monitoring endpoint

## Environment Variables

- `CLAUDE_API_KEY` - Your Anthropic API key (required)

## API Endpoints

### Health Check
```bash
GET /health
```

### Execute Natural Language Command
```bash
curl -X POST http://localhost:4060/execute \
  -H "Content-Type: application/json" \
  -d '{
    "command": "Take a screenshot of google.com and save it as google.png",
    "context": {
      "project": "web-scraping",
      "environment": "development"
    }
  }'
```

### Check All Services Health
```bash
curl -X GET http://localhost:4060/services/health
```

### Get Command Examples
```bash
curl -X GET http://localhost:4060/commands
```

## Example Commands

### Web Automation
```bash
"Take a screenshot of example.com and save it as homepage.png"
"Fill out the contact form on mysite.com with name John and email john@example.com"
"Scrape all product prices from shop.example.com"
```

### Development Workflow
```bash
"Commit all changes with message 'feat: add new feature' and push to GitHub"
"Run tests and deploy to Vercel if they pass"
"Create a new branch called feature-login and switch to it"
```

### File Operations
```bash
"Create a new file called README.md with project documentation"
"Copy all .js files from src/ to dist/ directory"
"Read the package.json file and show me the dependencies"
```

### Database Operations
```bash
"Create a new user in Supabase with email john@example.com"
"Get all active users from the database"
"Update user ID 123 to set their status as premium"
```

### Container Management
```bash
"Start a Docker container with nginx and map port 8080"
"Stop all running containers"
"Run a PostgreSQL container with password 'secret'"
```

### Testing & Analysis
```bash
"Run all unit tests in the project"
"Analyze the code in main.js and suggest improvements"
"Take screenshots of all pages for testing"
```

### Automation Workflows
```bash
"Trigger the user-signup workflow in n8n with user data"
"Deploy the project to production after running tests"
"Backup all files and push to GitHub"
```

## How It Works

1. **Command Analysis**: AI Copilot uses Claude to analyze your natural language command
2. **Action Planning**: Determines which MCP services to call and in what order
3. **Execution**: Automatically calls the required MCP services with proper parameters
4. **Result Summary**: Provides a clear summary of what was accomplished

## Available MCP Services

- **puppeteer-mcp** (4040) - Web scraping, screenshots, PDFs
- **file-mcp** (4041) - File operations (read, write, copy, delete)
- **claude-mcp** (4042) - AI chat, code analysis, summarization
- **git-mcp** (4043) - Git operations (add, commit, push, branch)
- **github-mcp** (4044) - GitHub API (repos, issues, PRs)
- **test-mcp** (4045) - Test runners (Jest, Playwright, Vitest)
- **playwright-mcp** (4046) - Advanced browser automation
- **deployment-mcp** (4047) - Deploy to Vercel, Netlify, Firebase
- **supabase-mcp** (4050) - Database operations, auth, storage
- **n8n-mcp** (4051) - Workflow automation
- **docker-mcp** (4052) - Container management

## Context Parameters

You can provide additional context to help the AI make better decisions:

```json
{
  "command": "Deploy the project",
  "context": {
    "project": "my-web-app",
    "environment": "production",
    "platform": "vercel",
    "branch": "main"
  }
}
```

## Usage

1. Set your `CLAUDE_API_KEY` in the `.env` file
2. Ensure other MCP services are running
3. Install dependencies: `npm install @anthropic-ai/sdk axios express dotenv`
4. Start server: `npm start`
5. Use natural language to control your entire development workflow

## Tips for Better Commands

- Be specific about what you want to accomplish
- Include relevant details (filenames, URLs, parameters)
- Mention the target environment when relevant
- Use action words (create, deploy, test, analyze, etc.)