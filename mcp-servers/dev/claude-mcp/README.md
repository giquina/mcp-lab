# Claude MCP

**Port:** 4042  
**Purpose:** Claude AI integration for chat, code analysis, summarization, and translation

## Features

- 💬 Chat conversations with Claude
- 🔍 Code analysis and review
- 📝 Text summarization (short/medium/long)
- 🌐 Text translation
- 🏥 Health monitoring endpoint

## Environment Variables

- `CLAUDE_API_KEY` - Your Anthropic API key (required)

## API Endpoints

### Health Check
```bash
GET /health
```

### Chat with Claude
```bash
curl -X POST http://localhost:4042/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello Claude!",
    "model": "claude-3-sonnet-20240229",
    "max_tokens": 1000,
    "temperature": 0.7
  }'
```

### Code Analysis
```bash
curl -X POST http://localhost:4042/analyze-code \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function hello() { console.log(\"Hello World\"); }",
    "language": "javascript",
    "task": "review and suggest improvements"
  }'
```

### Text Summarization
```bash
curl -X POST http://localhost:4042/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your long text content here...",
    "length": "medium"
  }'
```

### Translation
```bash
curl -X POST http://localhost:4042/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, how are you?",
    "target_language": "Spanish",
    "source_language": "English"
  }'
```

## Usage

1. Set your `CLAUDE_API_KEY` in the `.env` file
2. Install dependencies: `npm install @anthropic-ai/sdk express dotenv`
3. Start server: `npm start`

## Supported Models

- `claude-3-opus-20240229` (Most capable)
- `claude-3-sonnet-20240229` (Balanced)
- `claude-3-haiku-20240307` (Fastest)