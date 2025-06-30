const express = require('express');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 4045;

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${JSON.stringify(req.body)}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: '✅ Alive', service: 'test-mcp', port: PORT });
});

// Run Jest tests
app.post('/jest', async (req, res) => {
  try {
    const { 
      projectPath = process.cwd(), 
      testFile, 
      watch = false,
      coverage = false,
      verbose = false
    } = req.body;
    
    let command = 'npm test';
    
    if (testFile) {
      command += ` -- ${testFile}`;
    }
    
    if (watch) {
      command += ' --watch';
    }
    
    if (coverage) {
      command += ' --coverage';
    }
    
    if (verbose) {
      command += ' --verbose';
    }
    
    const { stdout, stderr } = await execAsync(command, { 
      cwd: projectPath,
      timeout: 300000 // 5 minutes
    });
    
    res.json({ 
      success: true, 
      output: stdout,
      error: stderr,
      command,
      projectPath
    });
  } catch (error) {
    console.error('Jest test error:', error);
    res.status(500).json({ 
      error: error.message,
      output: error.stdout,
      stderr: error.stderr
    });
  }
});

// Run Playwright tests
app.post('/playwright', async (req, res) => {
  try {
    const { 
      projectPath = process.cwd(), 
      testFile,
      browser = 'chromium',
      headed = false,
      debug = false
    } = req.body;
    
    let command = 'npx playwright test';
    
    if (testFile) {
      command += ` ${testFile}`;
    }
    
    command += ` --project=${browser}`;
    
    if (headed) {
      command += ' --headed';
    }
    
    if (debug) {
      command += ' --debug';
    }
    
    const { stdout, stderr } = await execAsync(command, { 
      cwd: projectPath,
      timeout: 600000 // 10 minutes
    });
    
    res.json({ 
      success: true, 
      output: stdout,
      error: stderr,
      command,
      projectPath
    });
  } catch (error) {
    console.error('Playwright test error:', error);
    res.status(500).json({ 
      error: error.message,
      output: error.stdout,
      stderr: error.stderr
    });
  }
});

// Run Vitest tests
app.post('/vitest', async (req, res) => {
  try {
    const { 
      projectPath = process.cwd(), 
      testFile,
      watch = false,
      coverage = false
    } = req.body;
    
    let command = 'npx vitest';
    
    if (testFile) {
      command += ` ${testFile}`;
    }
    
    if (watch) {
      command += ' --watch';
    }
    
    if (coverage) {
      command += ' --coverage';
    } else {
      command += ' --run'; // Run once without watch mode
    }
    
    const { stdout, stderr } = await execAsync(command, { 
      cwd: projectPath,
      timeout: 300000 // 5 minutes
    });
    
    res.json({ 
      success: true, 
      output: stdout,
      error: stderr,
      command,
      projectPath
    });
  } catch (error) {
    console.error('Vitest test error:', error);
    res.status(500).json({ 
      error: error.message,
      output: error.stdout,
      stderr: error.stderr
    });
  }
});

// Run custom test command
app.post('/custom', async (req, res) => {
  try {
    const { 
      projectPath = process.cwd(), 
      command,
      timeout = 300000
    } = req.body;
    
    if (!command) {
      return res.status(400).json({ error: 'command is required' });
    }
    
    const { stdout, stderr } = await execAsync(command, { 
      cwd: projectPath,
      timeout
    });
    
    res.json({ 
      success: true, 
      output: stdout,
      error: stderr,
      command,
      projectPath
    });
  } catch (error) {
    console.error('Custom test error:', error);
    res.status(500).json({ 
      error: error.message,
      output: error.stdout,
      stderr: error.stderr
    });
  }
});

// Get test results from file
app.post('/results', async (req, res) => {
  try {
    const { 
      projectPath = process.cwd(), 
      resultsFile = 'test-results.json'
    } = req.body;
    
    const resultsPath = path.join(projectPath, resultsFile);
    const results = await fs.readFile(resultsPath, 'utf8');
    
    res.json({ 
      success: true, 
      results: JSON.parse(results),
      resultsFile,
      projectPath
    });
  } catch (error) {
    console.error('Results error:', error);
    res.status(500).json({ error: error.message });
  }
});

// List test files
app.post('/list-tests', async (req, res) => {
  try {
    const { 
      projectPath = process.cwd(), 
      pattern = '**/*.{test,spec}.{js,ts,jsx,tsx}'
    } = req.body;
    
    const { stdout } = await execAsync(`find . -name "${pattern}" -type f`, { 
      cwd: projectPath 
    });
    
    const testFiles = stdout.trim().split('\n').filter(file => file);
    
    res.json({ 
      success: true, 
      testFiles,
      count: testFiles.length,
      pattern,
      projectPath
    });
  } catch (error) {
    console.error('List tests error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate test report
app.post('/report', async (req, res) => {
  try {
    const { 
      projectPath = process.cwd(), 
      format = 'html',
      outputDir = 'test-reports'
    } = req.body;
    
    let command;
    
    switch (format) {
      case 'html':
        command = 'npx jest --coverage --coverageReporters=html';
        break;
      case 'json':
        command = 'npx jest --coverage --coverageReporters=json';
        break;
      case 'lcov':
        command = 'npx jest --coverage --coverageReporters=lcov';
        break;
      default:
        command = 'npx jest --coverage';
    }
    
    const { stdout, stderr } = await execAsync(command, { 
      cwd: projectPath,
      timeout: 300000
    });
    
    res.json({ 
      success: true, 
      output: stdout,
      error: stderr,
      format,
      outputDir,
      projectPath
    });
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ 
      error: error.message,
      output: error.stdout,
      stderr: error.stderr
    });
  }
});

app.listen(PORT, () => {
  console.log(`🧪 Test MCP running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

/*
Sample usage:

# Run Jest tests
curl -X POST http://localhost:4045/jest \
  -H "Content-Type: application/json" \
  -d '{"projectPath": "/path/to/project", "coverage": true}'

# Run Playwright tests
curl -X POST http://localhost:4045/playwright \
  -H "Content-Type: application/json" \
  -d '{"projectPath": "/path/to/project", "browser": "chromium"}'

# Run custom test command
curl -X POST http://localhost:4045/custom \
  -H "Content-Type: application/json" \
  -d '{"command": "npm run test:unit", "projectPath": "/path/to/project"}'
*/