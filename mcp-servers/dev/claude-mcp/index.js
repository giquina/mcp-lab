const express = require('express');
const { Anthropic } = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4042;

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${JSON.stringify(req.body)}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: '✅ Alive', service: 'claude-mcp', port: PORT });
});

// Chat completion endpoint
app.post('/chat', async (req, res) => {
  try {
    const { 
      message, 
      model = 'claude-3-sonnet-20240229',
      max_tokens = 1000,
      temperature = 0.7,
      system = null,
      conversation = []
    } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    const messages = [
      ...conversation,
      { role: 'user', content: message }
    ];

    const response = await anthropic.messages.create({
      model,
      max_tokens,
      temperature,
      system,
      messages
    });

    res.json({ 
      success: true, 
      response: response.content[0].text,
      usage: response.usage,
      model,
      message_id: response.id
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Code analysis endpoint
app.post('/analyze-code', async (req, res) => {
  try {
    const { code, language, task = 'analyze' } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'code is required' });
    }

    const systemPrompt = `You are a senior software engineer. Analyze the provided ${language || 'code'} and provide insights based on the task: ${task}`;
    
    const message = `Please ${task} this ${language || 'code'}:\n\n\`\`\`${language || ''}\n${code}\n\`\`\``;

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [{ role: 'user', content: message }],
      system: systemPrompt
    });

    res.json({ 
      success: true, 
      analysis: response.content[0].text,
      code,
      language,
      task
    });
  } catch (error) {
    console.error('Code analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Text summarization endpoint
app.post('/summarize', async (req, res) => {
  try {
    const { text, length = 'medium' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'text is required' });
    }

    const lengthInstructions = {
      short: 'in 1-2 sentences',
      medium: 'in 1-2 paragraphs',
      long: 'in detail with key points'
    };

    const message = `Please summarize the following text ${lengthInstructions[length] || lengthInstructions.medium}:\n\n${text}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [{ role: 'user', content: message }]
    });

    res.json({ 
      success: true, 
      summary: response.content[0].text,
      original_length: text.length,
      summary_length: response.content[0].text.length
    });
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Translation endpoint
app.post('/translate', async (req, res) => {
  try {
    const { text, target_language, source_language = 'auto-detect' } = req.body;
    
    if (!text || !target_language) {
      return res.status(400).json({ error: 'text and target_language are required' });
    }

    const message = `Translate the following text from ${source_language} to ${target_language}:\n\n${text}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1500,
      messages: [{ role: 'user', content: message }]
    });

    res.json({ 
      success: true, 
      translation: response.content[0].text,
      source_language,
      target_language,
      original_text: text
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🤖 Claude MCP running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

/*
Sample usage:

# Chat with Claude
curl -X POST http://localhost:4042/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?", "max_tokens": 500}'

# Analyze code
curl -X POST http://localhost:4042/analyze-code \
  -H "Content-Type: application/json" \
  -d '{"code": "function hello() { console.log(\"hi\"); }", "language": "javascript", "task": "review"}'

# Summarize text
curl -X POST http://localhost:4042/summarize \
  -H "Content-Type: application/json" \
  -d '{"text": "Long text here...", "length": "short"}'
*/