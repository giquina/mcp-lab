# 🧠 MCP Lab - Complete Mobile Development & AI Automation Ecosystem

**Your ultimate mobile development automation control center powered by Model Context Protocol (MCP) and AI.**

This is a comprehensive ecosystem that allows you to control your entire mobile development workflow through natural language commands. Built with Claude AI integration and designed for maximum productivity in mobile app development, design-to-code workflows, and AI-assisted development.

## 🎯 What is MCP Lab?

MCP Lab is a collection of **Model Context Protocol (MCP) servers** that handle different automation tasks specifically focused on mobile development and AI-powered workflows:

- **🛠️ Development Tools**: Desktop command execution, file operations, Git, GitHub, testing, browser automation
- **📱 Mobile Development**: React Native debugging, Flutter tools, mobile device automation, app store management
- **🎨 Design & UI/UX**: Figma design-to-code, Playwright testing, responsive design workflows
- **🤖 AI Models**: DeepSeek, Gemini, OpenAI/ChatGPT integration, multi-AI orchestration
- **🔗 Integrations**: Notion, Docker, deployment automation
- **⚙️ DevOps**: Container management, deployment, CI/CD

## 🚀 Installed MCP Servers

### Core System Control
- **🖥️ Desktop Commander** - Full system access, command execution, file management
- **🐳 Docker MCP** - Container management and development environments

### Mobile Development Stack  
- **📱 Mobile MCP** - iOS/Android device automation, real device testing, simulator control
- **⚛️ React Native Debugger** - RN app debugging, performance analysis, component inspection
- **🎨 Flutter MCP** - Flutter development tools, widget analysis, hot reload (requires build)

### Design & Development Integration
- **🎨 Figma MCP** - Design-to-code automation, component generation, design system sync
- **🎭 Playwright MCP** - Web automation, cross-platform testing, PWA functionality
- **📚 Notion MCP** - Documentation, project management, knowledge base

### AI Model Integration
- **🤖 DeepSeek MCP** - Advanced reasoning, code analysis, technical problem solving
- **✨ Gemini MCP** - Large context analysis, file processing, web search capabilities  
- **🧠 Zen AI MCP** - Multi-AI orchestration (OpenAI, Gemini, Grok, custom models)

### Version Control & Deployment
- **📂 GitHub MCP** - Repository management, PR workflows, automated releases
- **☁️ App Store Connect** - iOS app submission, TestFlight management (requires build)

## 🔧 Configuration File (claude_desktop_config.json)

Your complete working configuration:

\`\`\`json
{
  "serverConfig": {
    "command": "cmd.exe",
    "args": ["/c"]
  },
  "mcpServers": {
    "desktop-commander": {
      "command": "npx.cmd",
      "args": ["@wonderwhy-er/desktop-commander@latest"]
    },
    "playwright": {
      "command": "npx", 
      "args": ["@playwright/mcp@latest"]
    },
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--stdio"],
      "env": {
        "FIGMA_API_KEY": "REPLACE_WITH_YOUR_FIGMA_API_KEY"
      }
    },
    "github": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "-e", "GITHUB_PERSONAL_ACCESS_TOKEN", "ghcr.io/github/github-mcp-server"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "REPLACE_WITH_YOUR_GITHUB_TOKEN"
      }
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "OPENAPI_MCP_HEADERS": "{\"Authorization\": \"Bearer REPLACE_WITH_YOUR_NOTION_TOKEN\", \"Notion-Version\": \"2022-06-28\"}"
      }
    },
    "mobile-mcp": {
      "command": "npx",
      "args": ["-y", "@mobilenext/mobile-mcp@latest"]
    },
    "react-native-debugger": {
      "command": "npx", 
      "args": ["-y", "@twodoorsdev/react-native-debugger-mcp"]
    },
    "docker": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "docker/mcp-servers-docker"]
    },
    "deepseek": {
      "command": "npx",
      "args": ["-y", "deepseek-mcp-server"],
      "env": {
        "DEEPSEEK_API_KEY": "REPLACE_WITH_YOUR_DEEPSEEK_API_KEY"
      }
    },
    "gemini": {
      "command": "npx",
      "args": ["-y", "gemini-mcp-tool"], 
      "env": {
        "GEMINI_API_KEY": "REPLACE_WITH_YOUR_GEMINI_API_KEY"
      }
    },
    "zen-ai": {
      "command": "node",
      "args": ["C:\\\\zen-mcp-server\\\\dist\\\\index.js"],
      "env": {
        "GEMINI_API_KEY": "REPLACE_WITH_YOUR_GEMINI_API_KEY",
        "OPENAI_API_KEY": "REPLACE_WITH_YOUR_OPENAI_API_KEY", 
        "XAI_API_KEY": "REPLACE_WITH_YOUR_GROK_API_KEY"
      }
    }
  }
}
\`\`\`

## 🔑 API Keys & Setup Requirements

### Required API Keys
1. **Figma API Key** - [Get from Figma Developer Settings](https://www.figma.com/developers/api#access-tokens)
2. **GitHub Personal Access Token** - [Create at GitHub Settings](https://github.com/settings/tokens)
3. **Notion Integration Token** - [Create at Notion Integrations](https://www.notion.so/profile/integrations)
4. **DeepSeek API Key** - [Get from DeepSeek Platform](https://platform.deepseek.com/)
5. **Gemini API Key** - [Get from Google AI Studio](https://makersuite.google.com/app/apikey)
6. **OpenAI API Key** - [Get from OpenAI Platform](https://platform.openai.com/api-keys)
7. **Grok API Key** - [Get from X.AI Console](https://console.x.ai/) *(Optional)*

### Prerequisites
- **Node.js 18+** - For running npm packages
- **Docker Desktop** - For containerized MCPs
- **Claude Desktop** - For MCP client interface
- **Git** - For version control operations

### Mobile Development Prerequisites
- **Android Studio** + Android SDK (for Android development)
- **Xcode** + iOS Simulator (for iOS development, macOS only)
- **React Native CLI** or **Expo CLI** (for React Native development)
- **Flutter SDK** (for Flutter development)

## 📱 Mobile Development Workflows

### React Native Development
\`\`\`bash
# Example AI commands you can use:
"Use Mobile MCP to test my React Native app on iPhone simulator"
"Debug performance issues in my RN app using React Native Debugger"
"Convert this Figma design to React Native components"
"Run Metro bundler and hot reload my React Native app"
"Deploy my RN app to TestFlight using App Store Connect"
\`\`\`

### Flutter Development  
\`\`\`bash
# Example AI commands:
"Use Flutter MCP to analyze widget tree in my running Flutter app"
"Hot reload my Flutter app and capture performance metrics"
"Convert Figma designs to Flutter widgets using design tokens"
"Run Flutter tests and generate coverage report"
\`\`\`

### Cross-Platform Testing
\`\`\`bash
# Mobile automation examples:
"Use Mobile MCP to automate user flow testing on both iOS and Android"
"Take screenshots of my app on different device sizes for app store"
"Test my app's responsive design using Playwright on various screen sizes"
"Automate form filling and submission testing across platforms"
\`\`\`

## 🎨 Design-to-Code Workflows

### Figma Integration
\`\`\`bash
# Design workflow examples:
"Import design tokens from Figma and generate React Native style sheets"
"Convert this Figma component to a reusable React Native component"
"Sync design system updates from Figma to my codebase"
"Generate responsive layouts based on Figma breakpoints"
\`\`\`

### Multi-AI Design Analysis
\`\`\`bash
# Using multiple AI models for design:
"Use Gemini to analyze this large Figma file and DeepSeek to suggest implementation"
"Have OpenAI review the generated component code for best practices"
"Use Zen AI to orchestrate design review between multiple AI models"
\`\`\`

## 🤖 AI-Powered Development

### Multi-AI Collaboration
\`\`\`bash
# AI orchestration examples:
"Use DeepSeek for complex algorithm design, then Gemini for documentation"
"Have multiple AI models review my code architecture in parallel"
"Use Zen AI to coordinate between OpenAI for planning and DeepSeek for implementation"
"Get different perspectives on mobile app architecture from various AI models"
\`\`\`

### Code Analysis & Debugging
\`\`\`bash
# AI-assisted debugging:
"Use DeepSeek to analyze this complex React Native crash and suggest fixes"
"Have Gemini review my entire Flutter project structure for improvements"
"Use OpenAI to explain this mobile performance bottleneck and optimization strategies"
\`\`\`

## 🔄 Complete Development Pipeline

### 1. Design Phase
- **Figma MCP** → Extract designs and components
- **Notion MCP** → Document requirements and specifications

### 2. Development Phase  
- **Desktop Commander** → Manage development environment
- **Mobile MCP** → Test on real devices and simulators
- **React Native/Flutter MCPs** → Debug and optimize
- **AI Models** → Code review and assistance

### 3. Testing Phase
- **Playwright MCP** → Cross-platform web testing
- **Mobile MCP** → Device automation and E2E testing
- **AI Models** → Automated code review

### 4. Deployment Phase
- **GitHub MCP** → Version control and CI/CD
- **Docker MCP** → Containerized deployments
- **App Store Connect** → Mobile app distribution

### 5. Documentation Phase
- **Notion MCP** → Project documentation
- **AI Models** → Automated documentation generation

## 🛠️ Installation & Setup

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/giquina/mcp-lab.git
cd mcp-lab
\`\`\`

### 2. Install Global Dependencies
\`\`\`bash
# Install all required MCP packages
npm install -g @wonderwhy-er/desktop-commander@latest
npm install -g @playwright/mcp@latest  
npm install -g figma-developer-mcp
npm install -g @notionhq/notion-mcp-server
npm install -g @mobilenext/mobile-mcp@latest
npm install -g @twodoorsdev/react-native-debugger-mcp
npm install -g deepseek-mcp-server
npm install -g gemini-mcp-tool
npm install -g @anthropic-ai/claude-code
\`\`\`

### 3. Setup Configuration
1. Copy the configuration above to your Claude Desktop config file:
   - **Windows**: \`%APPDATA%\\Claude\\claude_desktop_config.json\`
   - **macOS**: \`~/Library/Application Support/Claude/claude_desktop_config.json\`

2. Replace all API key placeholders with your actual keys

3. Install Docker Desktop and ensure it's running

### 4. Build Local MCPs (Optional)
Some MCPs require building from source:
\`\`\`bash
# Build Zen AI MCP
cd zen-mcp-server
npm install && npm run build

# Build App Store Connect MCP (if needed)
cd app-store-connect-mcp
npm install && npm run build
\`\`\`

### 5. Restart Claude Desktop
Close and reopen Claude Desktop to load all MCP servers.

## 📊 MCP Server Status Dashboard

Check your MCP server status by asking Claude:
\`\`\`
"Show me the status of all MCP servers and which ones are working"
\`\`\`

**Working MCPs:**
- ✅ Desktop Commander
- ✅ Playwright  
- ✅ Mobile MCP
- ✅ React Native Debugger
- ✅ Docker
- ✅ DeepSeek
- ✅ Gemini

**Requires API Keys:**
- 🔑 Figma MCP
- 🔑 GitHub MCP  
- 🔑 Notion MCP
- 🔑 Zen AI MCP

**Requires Building:**
- 🔨 App Store Connect MCP
- 🔨 Flutter MCP

## 🎯 Example Use Cases

### Mobile App Development
\`\`\`bash
"Create a new React Native app, set up navigation, integrate with Firebase, and deploy to TestFlight"
"Convert my Figma mobile designs to Flutter widgets with proper responsive breakpoints"
"Set up automated E2E testing for my mobile app on both iOS and Android devices"
\`\`\`

### AI-Assisted Code Review
\`\`\`bash
"Use DeepSeek to analyze my React Native performance, Gemini to review architecture, and OpenAI to suggest improvements"
"Have multiple AI models collaborate on optimizing my Flutter app's widget tree"
\`\`\`

### Design-to-Code Pipeline
\`\`\`bash
"Import design tokens from Figma, generate React Native components, test on simulators, and create documentation in Notion"
\`\`\`

### DevOps Automation
\`\`\`bash
"Build my mobile app, run tests, create Docker containers, and deploy using GitHub Actions"
\`\`\`

## 🔐 Security & Best Practices

- **API Keys**: Store in environment variables, never commit to version control
- **Docker**: Run MCPs in isolated containers when possible
- **Testing**: Always test on simulators before real devices
- **Version Control**: Use GitHub MCP for proper version management
- **Documentation**: Keep Notion updated with all project decisions

## 📚 Additional Resources

- **[Claude Desktop MCP Documentation](https://docs.anthropic.com/en/docs/build-with-claude/mcp)**
- **[Mobile MCP Wiki](https://github.com/mobile-next/mobile-mcp/wiki)**
- **[Figma Developer API](https://www.figma.com/developers/api)**
- **[React Native Documentation](https://reactnative.dev/)**
- **[Flutter Documentation](https://flutter.dev/)**

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit changes (\`git commit -m 'Add amazing feature'\`)
4. Push to branch (\`git push origin feature/amazing-feature\`)
5. Open Pull Request

## 📞 Support

- **Issues**: Create GitHub issues for bugs or feature requests
- **Documentation**: Each MCP has detailed README with examples
- **Community**: Join discussions in GitHub Discussions
- **Updates**: Watch repository for latest MCP additions

---

**🧠 MCP Lab** - From natural language to automated mobile development. Your AI-powered development companion for building amazing mobile apps.

*Built with ❤️ for mobile developers who want to focus on creativity, not repetitive tasks.*