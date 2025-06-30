const express = require('express');
const { exec } = require('child_process');
const { promisify } = require('util');
const axios = require('axios');
require('dotenv').config();

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 4047;

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${JSON.stringify(req.body)}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: '✅ Alive', service: 'deployment-mcp', port: PORT });
});

// Deploy to Vercel
app.post('/vercel', async (req, res) => {
  try {
    const { projectPath = process.cwd(), production = false } = req.body;
    
    let command = 'npx vercel';
    if (production) {
      command += ' --prod';
    }
    
    const { stdout, stderr } = await execAsync(command, { 
      cwd: projectPath,
      env: { ...process.env, VERCEL_TOKEN: process.env.VERCEL_TOKEN }
    });
    
    res.json({ 
      success: true, 
      output: stdout,
      error: stderr,
      production,
      projectPath
    });
  } catch (error) {
    console.error('Vercel deployment error:', error);
    res.status(500).json({ 
      error: error.message,
      output: error.stdout,
      stderr: error.stderr
    });
  }
});

// Deploy to Netlify
app.post('/netlify', async (req, res) => {
  try {
    const { 
      projectPath = process.cwd(), 
      buildDir = 'dist',
      production = false 
    } = req.body;
    
    let command = `npx netlify deploy --dir=${buildDir}`;
    if (production) {
      command += ' --prod';
    }
    
    const { stdout, stderr } = await execAsync(command, { 
      cwd: projectPath,
      env: { ...process.env, NETLIFY_AUTH_TOKEN: process.env.NETLIFY_AUTH_TOKEN }
    });
    
    res.json({ 
      success: true, 
      output: stdout,
      error: stderr,
      production,
      buildDir,
      projectPath
    });
  } catch (error) {
    console.error('Netlify deployment error:', error);
    res.status(500).json({ 
      error: error.message,
      output: error.stdout,
      stderr: error.stderr
    });
  }
});

// Trigger GitHub Actions workflow
app.post('/github-actions', async (req, res) => {
  try {
    const { owner, repo, workflow_id, ref = 'main', inputs = {} } = req.body;
    
    if (!owner || !repo || !workflow_id) {
      return res.status(400).json({ 
        error: 'owner, repo, and workflow_id are required' 
      });
    }

    const response = await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow_id}/dispatches`,
      { ref, inputs },
      {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    
    res.json({ 
      success: true, 
      message: 'Workflow triggered successfully',
      owner,
      repo,
      workflow_id,
      ref,
      inputs
    });
  } catch (error) {
    console.error('GitHub Actions error:', error);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Build project
app.post('/build', async (req, res) => {
  try {
    const { 
      projectPath = process.cwd(), 
      buildCommand = 'npm run build',
      timeout = 600000 
    } = req.body;
    
    const { stdout, stderr } = await execAsync(buildCommand, { 
      cwd: projectPath,
      timeout
    });
    
    res.json({ 
      success: true, 
      output: stdout,
      error: stderr,
      buildCommand,
      projectPath
    });
  } catch (error) {
    console.error('Build error:', error);
    res.status(500).json({ 
      error: error.message,
      output: error.stdout,
      stderr: error.stderr
    });
  }
});

// Deploy via SSH
app.post('/ssh-deploy', async (req, res) => {
  try {
    const { 
      host, 
      user, 
      deployPath,
      buildDir = 'dist',
      projectPath = process.cwd()
    } = req.body;
    
    if (!host || !user || !deployPath) {
      return res.status(400).json({ 
        error: 'host, user, and deployPath are required' 
      });
    }

    // First build the project
    await execAsync('npm run build', { cwd: projectPath });
    
    // Then deploy via rsync
    const command = `rsync -avz --delete ${buildDir}/ ${user}@${host}:${deployPath}`;
    const { stdout, stderr } = await execAsync(command, { cwd: projectPath });
    
    res.json({ 
      success: true, 
      output: stdout,
      error: stderr,
      host,
      user,
      deployPath,
      projectPath
    });
  } catch (error) {
    console.error('SSH deployment error:', error);
    res.status(500).json({ 
      error: error.message,
      output: error.stdout,
      stderr: error.stderr
    });
  }
});

// Deploy to Firebase
app.post('/firebase', async (req, res) => {
  try {
    const { 
      projectPath = process.cwd(), 
      project,
      only 
    } = req.body;
    
    let command = 'npx firebase deploy';
    if (project) {
      command += ` --project=${project}`;
    }
    if (only) {
      command += ` --only=${only}`;
    }
    
    const { stdout, stderr } = await execAsync(command, { 
      cwd: projectPath,
      env: { ...process.env, FIREBASE_TOKEN: process.env.FIREBASE_TOKEN }
    });
    
    res.json({ 
      success: true, 
      output: stdout,
      error: stderr,
      project,
      only,
      projectPath
    });
  } catch (error) {
    console.error('Firebase deployment error:', error);
    res.status(500).json({ 
      error: error.message,
      output: error.stdout,
      stderr: error.stderr
    });
  }
});

// Get deployment status
app.post('/status', async (req, res) => {
  try {
    const { platform, project, deployment_id } = req.body;
    
    let status = {};
    
    switch (platform) {
      case 'vercel':
        if (deployment_id) {
          const response = await axios.get(
            `https://api.vercel.com/v6/deployments/${deployment_id}`,
            {
              headers: {
                'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`
              }
            }
          );
          status = response.data;
        }
        break;
      case 'netlify':
        if (deployment_id) {
          const response = await axios.get(
            `https://api.netlify.com/api/v1/deploys/${deployment_id}`,
            {
              headers: {
                'Authorization': `Bearer ${process.env.NETLIFY_AUTH_TOKEN}`
              }
            }
          );
          status = response.data;
        }
        break;
      default:
        return res.status(400).json({ error: 'Unsupported platform' });
    }
    
    res.json({ 
      success: true, 
      platform,
      status
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Deployment MCP running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

/*
Sample usage:

# Deploy to Vercel
curl -X POST http://localhost:4047/vercel \
  -H "Content-Type: application/json" \
  -d '{"projectPath": "/path/to/project", "production": true}'

# Deploy to Netlify
curl -X POST http://localhost:4047/netlify \
  -H "Content-Type: application/json" \
  -d '{"projectPath": "/path/to/project", "buildDir": "dist", "production": true}'

# Trigger GitHub Actions
curl -X POST http://localhost:4047/github-actions \
  -H "Content-Type: application/json" \
  -d '{"owner": "username", "repo": "repository", "workflow_id": "deploy.yml"}'

# Build project
curl -X POST http://localhost:4047/build \
  -H "Content-Type: application/json" \
  -d '{"projectPath": "/path/to/project", "buildCommand": "npm run build"}'
*/