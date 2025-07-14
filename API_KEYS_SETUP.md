# 🔑 API Keys Setup Guide

This guide will walk you through obtaining all the necessary API keys for your MCP Lab setup.

## Required API Keys

### 1. Figma API Key 🎨
**Purpose**: Design-to-code automation, component generation

**Steps**:
1. Go to [Figma Settings](https://www.figma.com/settings)
2. Scroll down to "Personal access tokens"
3. Click "Create new token"
4. Name it "MCP Lab Integration"
5. Copy the token (you won't see it again!)

**Permissions Needed**: Read access to your Figma files

### 2. GitHub Personal Access Token 📂
**Purpose**: Repository management, CI/CD, automated releases

**Steps**:
1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Name: "MCP Lab Integration"
4. Select scopes:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
   - `write:packages` (Upload packages to GitHub Package Registry)
5. Click "Generate token"
6. Copy the token immediately

### 3. Notion Integration Token 📚
**Purpose**: Documentation, project management, knowledge base

**Steps**:
1. Go to [Notion Integrations](https://www.notion.so/profile/integrations)
2. Click "New integration"
3. Name: "MCP Lab"
4. Select associated workspace
5. Choose capabilities:
   - ✅ Read content
   - ✅ Update content
   - ✅ Insert content
6. Click "Submit"
7. Copy the "Internal Integration Token"

**Important**: You need to share specific Notion pages with your integration:
1. Go to the Notion page you want to access
2. Click "Share" in the top right
3. Click "Invite" and search for your integration name
4. Select your integration and click "Invite"

### 4. DeepSeek API Key 🤖
**Purpose**: Advanced reasoning, code analysis, technical problem solving

**Steps**:
1. Go to [DeepSeek Platform](https://platform.deepseek.com/)
2. Sign up/Login with your account
3. Go to API Keys section
4. Click "Create API Key"
5. Name: "MCP Lab Integration"
6. Copy the API key

**Note**: DeepSeek offers competitive pricing for API usage

### 5. Google Gemini API Key ✨
**Purpose**: Large context analysis, file processing, web search

**Steps**:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Select project or create new one
5. Copy the generated API key

**Free Tier**: Google provides generous free tier for Gemini API

### 6. OpenAI API Key 🧠
**Purpose**: GPT-4 access through Zen AI orchestration

**Steps**:
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in to your account
3. Click "Create new secret key"
4. Name: "MCP Lab Integration"
5. Copy the key (starts with `sk-`)

**Note**: Requires paid account for GPT-4 access

### 7. X.AI Grok API Key (Optional) 🚀
**Purpose**: Grok AI model access through Zen AI

**Steps**:
1. Go to [X.AI Console](https://console.x.ai/)
2. Sign up/Login
3. Navigate to API Keys
4. Generate new API key
5. Copy the key

**Note**: This is optional but provides access to Grok's unique capabilities

## 🔒 Securing Your API Keys

### Environment Variables Method (Recommended)
Instead of putting keys directly in the config, use environment variables:

**Windows**:
```cmd
setx FIGMA_API_KEY "your_figma_key_here"
setx GITHUB_TOKEN "your_github_token_here"
setx NOTION_TOKEN "your_notion_token_here"
setx DEEPSEEK_API_KEY "your_deepseek_key_here"
setx GEMINI_API_KEY "your_gemini_key_here"
setx OPENAI_API_KEY "your_openai_key_here"
setx XAI_API_KEY "your_grok_key_here"
```

**macOS/Linux**:
```bash
export FIGMA_API_KEY="your_figma_key_here"
export GITHUB_TOKEN="your_github_token_here"
export NOTION_TOKEN="your_notion_token_here"
export DEEPSEEK_API_KEY="your_deepseek_key_here"
export GEMINI_API_KEY="your_gemini_key_here"
export OPENAI_API_KEY="your_openai_key_here"
export XAI_API_KEY="your_grok_key_here"
```

Then update your claude_desktop_config.json to use these variables:
```json
{
  "env": {
    "FIGMA_API_KEY": "${FIGMA_API_KEY}",
    "DEEPSEEK_API_KEY": "${DEEPSEEK_API_KEY}"
  }
}
```

### Security Best Practices

1. **Never commit API keys to version control**
2. **Use separate keys for development and production**
3. **Regularly rotate your API keys**
4. **Monitor API usage for unusual activity**
5. **Restrict API key permissions to minimum required**
6. **Use environment variables instead of hardcoding**

## 💰 Cost Management

### Free Tiers Available
- **Gemini**: Generous free tier with rate limits
- **DeepSeek**: Competitive pricing
- **Figma**: Free for personal use
- **GitHub**: Free for public repositories
- **Notion**: Free for personal use

### Paid Services
- **OpenAI**: Pay-per-use, required for GPT-4
- **X.AI Grok**: Subscription-based
- **GitHub**: Required for private repos (paid plans)
- **Notion**: Team features require paid plans

### Cost Optimization Tips
1. Use **DeepSeek** for cost-effective reasoning tasks
2. Use **Gemini** for large file analysis (free tier)
3. Use **OpenAI** only for specific GPT-4 requirements
4. Monitor usage through each platform's dashboard
5. Set up billing alerts where available

## 🔧 Testing Your Setup

After adding your API keys, test each MCP server:

```bash
# Test in Claude Desktop
"Test Figma MCP connection"
"Test GitHub MCP by listing my repositories" 
"Test Notion MCP by reading a page"
"Test DeepSeek MCP with a simple query"
"Test Gemini MCP with file analysis"
"Test OpenAI through Zen AI MCP"
```

## 🚨 Troubleshooting

### Common Issues

**"Invalid API Key" Errors**:
- Double-check the key was copied correctly (no extra spaces)
- Verify the key hasn't expired
- Check if the service requires account activation

**"Permission Denied" Errors**:
- For Notion: Ensure pages are shared with your integration
- For GitHub: Verify token has required scopes
- For Figma: Check file access permissions

**"Rate Limit Exceeded"**:
- Wait for the rate limit to reset
- Consider upgrading to paid tier
- Implement request throttling

### Getting Help

1. Check the specific service's documentation
2. Verify API key permissions in the service dashboard
3. Test the API key with curl/Postman before using in MCP
4. Create GitHub issues for MCP-specific problems

## 📚 Additional Resources

- [Figma API Documentation](https://www.figma.com/developers/api)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [Notion API Documentation](https://developers.notion.com/)
- [DeepSeek API Documentation](https://platform.deepseek.com/api-docs)
- [Gemini API Documentation](https://ai.google.dev/)
- [OpenAI API Documentation](https://platform.openai.com/docs)

---

Remember: Keep your API keys secure and never share them publicly! 🔐