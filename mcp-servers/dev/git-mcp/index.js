const express = require('express');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 4043;

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${JSON.stringify(req.body)}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: '✅ Alive', service: 'git-mcp', port: PORT });
});

// Git status endpoint
app.post('/status', async (req, res) => {
  try {
    const { repoPath = process.cwd() } = req.body;
    
    const { stdout, stderr } = await execAsync('git status --porcelain', { cwd: repoPath });
    const statusLong = await execAsync('git status', { cwd: repoPath });
    
    res.json({ 
      success: true, 
      status: stdout,
      statusLong: statusLong.stdout,
      repoPath
    });
  } catch (error) {
    console.error('Git status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Git add endpoint
app.post('/add', async (req, res) => {
  try {
    const { repoPath = process.cwd(), files = '.' } = req.body;
    
    const { stdout, stderr } = await execAsync(`git add ${files}`, { cwd: repoPath });
    
    res.json({ 
      success: true, 
      message: 'Files added to staging area',
      files,
      output: stdout,
      repoPath
    });
  } catch (error) {
    console.error('Git add error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Git commit endpoint
app.post('/commit', async (req, res) => {
  try {
    const { repoPath = process.cwd(), message, author } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'commit message is required' });
    }

    let command = `git commit -m "${message}"`;
    if (author) {
      command = `git commit --author="${author}" -m "${message}"`;
    }
    
    const { stdout, stderr } = await execAsync(command, { cwd: repoPath });
    
    res.json({ 
      success: true, 
      message: 'Commit created successfully',
      commitMessage: message,
      output: stdout,
      repoPath
    });
  } catch (error) {
    console.error('Git commit error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Git push endpoint
app.post('/push', async (req, res) => {
  try {
    const { repoPath = process.cwd(), remote = 'origin', branch = 'main' } = req.body;
    
    const { stdout, stderr } = await execAsync(`git push ${remote} ${branch}`, { cwd: repoPath });
    
    res.json({ 
      success: true, 
      message: 'Changes pushed successfully',
      remote,
      branch,
      output: stdout,
      repoPath
    });
  } catch (error) {
    console.error('Git push error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Git pull endpoint
app.post('/pull', async (req, res) => {
  try {
    const { repoPath = process.cwd(), remote = 'origin', branch = 'main' } = req.body;
    
    const { stdout, stderr } = await execAsync(`git pull ${remote} ${branch}`, { cwd: repoPath });
    
    res.json({ 
      success: true, 
      message: 'Changes pulled successfully',
      remote,
      branch,
      output: stdout,
      repoPath
    });
  } catch (error) {
    console.error('Git pull error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Git branch operations
app.post('/branch', async (req, res) => {
  try {
    const { repoPath = process.cwd(), action, branchName } = req.body;
    
    let command;
    switch (action) {
      case 'list':
        command = 'git branch -a';
        break;
      case 'create':
        if (!branchName) return res.status(400).json({ error: 'branchName required for create' });
        command = `git branch ${branchName}`;
        break;
      case 'checkout':
        if (!branchName) return res.status(400).json({ error: 'branchName required for checkout' });
        command = `git checkout ${branchName}`;
        break;
      case 'delete':
        if (!branchName) return res.status(400).json({ error: 'branchName required for delete' });
        command = `git branch -d ${branchName}`;
        break;
      default:
        return res.status(400).json({ error: 'Invalid action. Use: list, create, checkout, delete' });
    }
    
    const { stdout, stderr } = await execAsync(command, { cwd: repoPath });
    
    res.json({ 
      success: true, 
      action,
      branchName,
      output: stdout,
      repoPath
    });
  } catch (error) {
    console.error('Git branch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Git log endpoint
app.post('/log', async (req, res) => {
  try {
    const { repoPath = process.cwd(), limit = 10, format = 'oneline' } = req.body;
    
    const formatOptions = {
      oneline: '--oneline',
      full: '--pretty=full',
      short: '--pretty=short',
      medium: '--pretty=medium'
    };
    
    const command = `git log ${formatOptions[format] || '--oneline'} -${limit}`;
    const { stdout, stderr } = await execAsync(command, { cwd: repoPath });
    
    res.json({ 
      success: true, 
      log: stdout,
      limit,
      format,
      repoPath
    });
  } catch (error) {
    console.error('Git log error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Git diff endpoint
app.post('/diff', async (req, res) => {
  try {
    const { repoPath = process.cwd(), staged = false, file } = req.body;
    
    let command = 'git diff';
    if (staged) command += ' --staged';
    if (file) command += ` ${file}`;
    
    const { stdout, stderr } = await execAsync(command, { cwd: repoPath });
    
    res.json({ 
      success: true, 
      diff: stdout,
      staged,
      file,
      repoPath
    });
  } catch (error) {
    console.error('Git diff error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Quick commit workflow (add + commit + push)
app.post('/quick-commit', async (req, res) => {
  try {
    const { 
      repoPath = process.cwd(), 
      message, 
      files = '.', 
      push = false,
      remote = 'origin',
      branch = 'main'
    } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'commit message is required' });
    }

    // Add files
    await execAsync(`git add ${files}`, { cwd: repoPath });
    
    // Commit
    await execAsync(`git commit -m "${message}"`, { cwd: repoPath });
    
    let pushOutput = null;
    if (push) {
      const pushResult = await execAsync(`git push ${remote} ${branch}`, { cwd: repoPath });
      pushOutput = pushResult.stdout;
    }
    
    res.json({ 
      success: true, 
      message: 'Quick commit completed',
      commitMessage: message,
      files,
      pushed: push,
      pushOutput,
      repoPath
    });
  } catch (error) {
    console.error('Quick commit error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🔧 Git MCP running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

/*
Sample usage:

# Git status
curl -X POST http://localhost:4043/status \
  -H "Content-Type: application/json" \
  -d '{"repoPath": "/path/to/repo"}'

# Git add and commit
curl -X POST http://localhost:4043/add \
  -H "Content-Type: application/json" \
  -d '{"files": ".", "repoPath": "/path/to/repo"}'

curl -X POST http://localhost:4043/commit \
  -H "Content-Type: application/json" \
  -d '{"message": "feat: add new feature", "repoPath": "/path/to/repo"}'

# Quick commit workflow
curl -X POST http://localhost:4043/quick-commit \
  -H "Content-Type: application/json" \
  -d '{"message": "feat: add new feature", "push": true, "repoPath": "/path/to/repo"}'
*/