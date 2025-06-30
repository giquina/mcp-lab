# Test MCP

**Port:** 4045  
**Purpose:** Test runner for Jest, Playwright, Vitest, and custom testing frameworks

## Features

- 🧪 Jest test execution with coverage
- 🎭 Playwright browser testing
- ⚡ Vitest testing framework
- 🛠️ Custom test command execution
- 📊 Test report generation
- 📋 Test file discovery
- 🏥 Health monitoring endpoint

## API Endpoints

### Health Check
```bash
GET /health
```

### Run Jest Tests
```bash
curl -X POST http://localhost:4045/jest \
  -H "Content-Type: application/json" \
  -d '{
    "projectPath": "/path/to/project",
    "testFile": "src/components/Button.test.js",
    "coverage": true,
    "verbose": true
  }'
```

### Run Playwright Tests
```bash
curl -X POST http://localhost:4045/playwright \
  -H "Content-Type: application/json" \
  -d '{
    "projectPath": "/path/to/project",
    "testFile": "tests/login.spec.js",
    "browser": "chromium",
    "headed": false,
    "debug": false
  }'
```

### Run Vitest Tests
```bash
curl -X POST http://localhost:4045/vitest \
  -H "Content-Type: application/json" \
  -d '{
    "projectPath": "/path/to/project",
    "testFile": "src/utils.test.ts",
    "coverage": true
  }'
```

### Run Custom Test Command
```bash
curl -X POST http://localhost:4045/custom \
  -H "Content-Type: application/json" \
  -d '{
    "command": "npm run test:e2e",
    "projectPath": "/path/to/project",
    "timeout": 600000
  }'
```

### List Test Files
```bash
curl -X POST http://localhost:4045/list-tests \
  -H "Content-Type: application/json" \
  -d '{
    "projectPath": "/path/to/project",
    "pattern": "**/*.{test,spec}.{js,ts}"
  }'
```

### Get Test Results
```bash
curl -X POST http://localhost:4045/results \
  -H "Content-Type: application/json" \
  -d '{
    "projectPath": "/path/to/project",
    "resultsFile": "test-results.json"
  }'
```

### Generate Test Report
```bash
curl -X POST http://localhost:4045/report \
  -H "Content-Type: application/json" \
  -d '{
    "projectPath": "/path/to/project",
    "format": "html",
    "outputDir": "coverage"
  }'
```

## Supported Test Frameworks

- **Jest** - Unit and integration testing
- **Playwright** - End-to-end browser testing
- **Vitest** - Fast unit testing for Vite projects
- **Custom** - Any npm script or command

## Report Formats

- `html` - Interactive HTML coverage report
- `json` - JSON formatted results
- `lcov` - LCOV format for CI/CD integration

## Usage

1. Install dependencies: `npm install express dotenv`
2. Start server: `npm start`
3. Configure your test framework in the target project
4. Use API endpoints to run tests programmatically