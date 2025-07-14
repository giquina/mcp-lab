# 🔧 Installation Guide

Complete step-by-step installation guide for MCP Lab mobile development environment.

## 📋 Prerequisites

### System Requirements
- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **Node.js**: Version 18 or higher
- **Git**: Latest version
- **Docker Desktop**: For containerized MCPs
- **Claude Desktop**: Latest version

### Mobile Development Prerequisites
- **For iOS Development** (macOS only):
  - Xcode 14+ with iOS Simulator
  - iOS Developer Account (for device testing)
- **For Android Development**:
  - Android Studio with Android SDK
  - Android device or emulator
- **For React Native**:
  - React Native CLI or Expo CLI
- **For Flutter**:
  - Flutter SDK

## 🚀 Quick Installation (Automated)

### 1. Clone Repository
```bash
git clone https://github.com/giquina/mcp-lab.git
cd mcp-lab
```

### 2. Run Installation Script
```bash
# Windows (PowerShell)
.\install.ps1

# macOS/Linux
chmod +x install.sh
./install.sh
```

## 📖 Manual Installation

### Step 1: Install Node.js
Download and install Node.js 18+ from [nodejs.org](https://nodejs.org/)

Verify installation:
```bash
node --version
npm --version
```

### Step 2: Install Docker Desktop
Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)

Verify installation:
```bash
docker --version
```

### Step 3: Install Claude Desktop
Download from [claude.ai/download](https://claude.ai/download)

### Step 4: Install Global MCP Packages
```bash
# Core System Control
npm install -g @wonderwhy-er/desktop-commander@latest

# Web & Testing
npm install -g @playwright/mcp@latest

# Design Integration
npm install -g figma-developer-mcp

# Documentation
npm install -g @notionhq/notion-mcp-server

# Mobile Development
npm install -g @mobilenext/mobile-mcp@latest
npm install -g @twodoorsdev/react-native-debugger-mcp

# AI Models
npm install -g deepseek-mcp-server
npm install -g gemini-mcp-tool

# Development Tools
npm install -g @anthropic-ai/claude-code
```

### Step 5: Clone Additional MCP Servers
```bash
# Zen AI for multi-model orchestration
git clone https://github.com/BeehiveInnovations/zen-mcp-server.git
cd zen-mcp-server
npm install && npm run build
cd ..

# App Store Connect (optional)
git clone https://github.com/JoshuaRileyDev/app-store-connect-mcp-server.git
cd app-store-connect-mcp-server
npm install && npm run build
cd ..
```

### Step 6: Configure Claude Desktop

1. **Locate Config File**:
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. **Copy Configuration**:
   Copy the contents of `claude_desktop_config.json` from this repository to your Claude Desktop config file.

3. **Add API Keys**:
   Replace all placeholder values with your actual API keys (see [API_KEYS_SETUP.md](./API_KEYS_SETUP.md)).

### Step 7: Restart Claude Desktop
Close Claude Desktop completely and reopen it to load all MCP servers.

## 📱 Mobile Development Setup

### React Native Environment

#### Android Setup
1. **Install Android Studio**
2. **Configure Android SDK**:
   ```bash
   # Add to your environment variables
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```
3. **Create Virtual Device** in Android Studio AVD Manager

#### iOS Setup (macOS only)
1. **Install Xcode** from Mac App Store
2. **Install Xcode Command Line Tools**:
   ```bash
   xcode-select --install
   ```
3. **Install CocoaPods**:
   ```bash
   sudo gem install cocoapods
   ```

#### React Native CLI
```bash
npm install -g @react-native-community/cli
```

### Flutter Environment

1. **Download Flutter SDK** from [flutter.dev](https://flutter.dev/docs/get-started/install)
2. **Add Flutter to PATH**:
   ```bash
   export PATH="$PATH:`pwd`/flutter/bin"
   ```
3. **Run Flutter Doctor**:
   ```bash
   flutter doctor
   ```
4. **Accept Android Licenses**:
   ```bash
   flutter doctor --android-licenses
   ```

### Expo Development (Optional)
```bash
npm install -g @expo/cli
```

## 🔑 API Keys Configuration

Follow the detailed guide in [API_KEYS_SETUP.md](./API_KEYS_SETUP.md) to obtain and configure all required API keys:

- Figma API Key
- GitHub Personal Access Token
- Notion Integration Token
- DeepSeek API Key
- Google Gemini API Key
- OpenAI API Key
- X.AI Grok API Key (optional)

## ✅ Verification & Testing

### 1. Test MCP Server Status
Ask Claude:
```
"Show me the status of all MCP servers"
```

### 2. Test Individual MCPs
```bash
# Test Desktop Commander
"Use Desktop Commander to list files in current directory"

# Test Mobile MCP
"Use Mobile MCP to check available iOS simulators"

# Test Figma MCP (requires API key)
"Test Figma MCP connection"

# Test AI Models
"Use DeepSeek to explain Model Context Protocol"
"Use Gemini to analyze a simple code file"
```

### 3. Test Mobile Development Environment
```bash
# React Native
npx react-native --version

# Flutter
flutter --version

# Android
adb devices

# iOS (macOS only)
xcrun simctl list devices
```

## 🐛 Troubleshooting

### Common Issues

#### "Command not found" errors
```bash
# Refresh your PATH
source ~/.bashrc  # Linux/macOS
# Or restart terminal/PowerShell
```

#### NPM Permission Issues (macOS/Linux)
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
# Or use a Node version manager like nvm
```

#### Docker Issues
```bash
# Restart Docker Desktop
# Check Docker is running
docker ps
```

#### MCP Server Not Loading
1. Check Claude Desktop config file syntax
2. Verify API keys are correct
3. Restart Claude Desktop completely
4. Check individual MCP server logs

#### Mobile Development Issues
```bash
# Android
flutter doctor
react-native doctor

# iOS (macOS only)
xcrun simctl list devices
```

### Getting Help

1. **Check logs** in Claude Desktop
2. **Verify prerequisites** are installed correctly
3. **Test API keys** individually
4. **Create GitHub issue** with specific error details
5. **Join Discord community** for real-time help

## 🔄 Updates & Maintenance

### Updating MCPs
```bash
# Update global packages
npm update -g @wonderwhy-er/desktop-commander
npm update -g @playwright/mcp
npm update -g deepseek-mcp-server
npm update -g gemini-mcp-tool

# Update local repositories
cd zen-mcp-server && git pull && npm install && npm run build
cd app-store-connect-mcp-server && git pull && npm install && npm run build
```

### Updating Mobile SDKs
```bash
# Flutter
flutter upgrade

# React Native
npx @react-native-community/cli@latest --version

# Android SDK via Android Studio
# Xcode via Mac App Store
```

## 📚 Next Steps

After successful installation:

1. **Read [MOBILE_WORKFLOWS.md](./MOBILE_WORKFLOWS.md)** for mobile development workflows
2. **Set up your first mobile project** using AI assistance
3. **Explore design-to-code workflows** with Figma integration
4. **Try multi-AI collaboration** for code review and optimization
5. **Set up automated testing** and deployment pipelines

## 🎯 Quick Start Commands

Once everything is installed, try these commands in Claude:

```bash
# Mobile Development
"Create a new React Native project with TypeScript"
"Set up Flutter development environment"
"Test my app on iOS simulator and Android emulator"

# Design Integration
"Import design tokens from my Figma file"
"Convert Figma components to React Native code"

# AI Collaboration
"Use multiple AI models to review my mobile app architecture"
"Get DeepSeek analysis and Gemini optimization suggestions"

# Automation
"Set up CI/CD pipeline for my mobile app"
"Automate app store submission process"
```

---

**🎉 Congratulations!** You now have a complete AI-powered mobile development environment ready to accelerate your app development process.