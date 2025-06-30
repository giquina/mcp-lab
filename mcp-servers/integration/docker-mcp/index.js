const express = require('express');
const { exec } = require('child_process');
const { promisify } = require('util');
require('dotenv').config();

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 4052;

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${JSON.stringify(req.body)}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: '✅ Alive', service: 'docker-mcp', port: PORT });
});

// Run container
app.post('/run', async (req, res) => {
  try {
    const { 
      image, 
      name, 
      ports = {}, 
      environment = {}, 
      volumes = {},
      detach = true,
      remove = false 
    } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'image is required' });
    }

    let command = 'docker run';
    
    if (detach) command += ' -d';
    if (remove) command += ' --rm';
    if (name) command += ` --name ${name}`;
    
    // Add port mappings
    Object.entries(ports).forEach(([host, container]) => {
      command += ` -p ${host}:${container}`;
    });
    
    // Add environment variables
    Object.entries(environment).forEach(([key, value]) => {
      command += ` -e ${key}="${value}"`;
    });
    
    // Add volume mounts
    Object.entries(volumes).forEach(([host, container]) => {
      command += ` -v ${host}:${container}`;
    });
    
    command += ` ${image}`;
    
    const { stdout, stderr } = await execAsync(command);
    
    res.json({ 
      success: true, 
      containerId: stdout.trim(),
      command,
      image,
      name
    });
  } catch (error) {
    console.error('Docker run error:', error);
    res.status(500).json({ error: error.message });
  }
});

// List containers
app.get('/containers', async (req, res) => {
  try {
    const { all = false } = req.query;
    
    let command = 'docker ps --format "table {{.ID}}\\t{{.Image}}\\t{{.Command}}\\t{{.CreatedAt}}\\t{{.Status}}\\t{{.Ports}}\\t{{.Names}}"';
    if (all) command += ' -a';
    
    const { stdout } = await execAsync(command);
    
    res.json({ 
      success: true, 
      output: stdout,
      all
    });
  } catch (error) {
    console.error('List containers error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stop container
app.post('/stop', async (req, res) => {
  try {
    const { container } = req.body;
    
    if (!container) {
      return res.status(400).json({ error: 'container name or ID is required' });
    }
    
    const { stdout, stderr } = await execAsync(`docker stop ${container}`);
    
    res.json({ 
      success: true, 
      message: 'Container stopped',
      container,
      output: stdout
    });
  } catch (error) {
    console.error('Stop container error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start container
app.post('/start', async (req, res) => {
  try {
    const { container } = req.body;
    
    if (!container) {
      return res.status(400).json({ error: 'container name or ID is required' });
    }
    
    const { stdout, stderr } = await execAsync(`docker start ${container}`);
    
    res.json({ 
      success: true, 
      message: 'Container started',
      container,
      output: stdout
    });
  } catch (error) {
    console.error('Start container error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Remove container
app.post('/remove', async (req, res) => {
  try {
    const { container, force = false } = req.body;
    
    if (!container) {
      return res.status(400).json({ error: 'container name or ID is required' });
    }
    
    let command = `docker rm ${container}`;
    if (force) command += ' -f';
    
    const { stdout, stderr } = await execAsync(command);
    
    res.json({ 
      success: true, 
      message: 'Container removed',
      container,
      force
    });
  } catch (error) {
    console.error('Remove container error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Execute command in container
app.post('/exec', async (req, res) => {
  try {
    const { container, command: cmd, interactive = false } = req.body;
    
    if (!container || !cmd) {
      return res.status(400).json({ error: 'container and command are required' });
    }
    
    let command = `docker exec`;
    if (interactive) command += ' -it';
    command += ` ${container} ${cmd}`;
    
    const { stdout, stderr } = await execAsync(command);
    
    res.json({ 
      success: true, 
      output: stdout,
      error: stderr,
      container,
      command: cmd
    });
  } catch (error) {
    console.error('Exec error:', error);
    res.status(500).json({ error: error.message });
  }
});

// View container logs
app.post('/logs', async (req, res) => {
  try {
    const { container, tail = 100, follow = false } = req.body;
    
    if (!container) {
      return res.status(400).json({ error: 'container name or ID is required' });
    }
    
    let command = `docker logs ${container}`;
    if (tail) command += ` --tail ${tail}`;
    if (follow) command += ' -f';
    
    const { stdout, stderr } = await execAsync(command);
    
    res.json({ 
      success: true, 
      logs: stdout,
      error: stderr,
      container
    });
  } catch (error) {
    console.error('Logs error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Docker Compose operations
app.post('/compose/:action', async (req, res) => {
  try {
    const { action } = req.params;
    const { projectPath = process.cwd(), file = 'docker-compose.yml' } = req.body;
    
    const validActions = ['up', 'down', 'build', 'ps', 'logs', 'restart'];
    if (!validActions.includes(action)) {
      return res.status(400).json({ error: `Invalid action. Use: ${validActions.join(', ')}` });
    }
    
    let command = `docker-compose -f ${file} ${action}`;
    if (action === 'up') command += ' -d';
    
    const { stdout, stderr } = await execAsync(command, { cwd: projectPath });
    
    res.json({ 
      success: true, 
      output: stdout,
      error: stderr,
      action,
      file,
      projectPath
    });
  } catch (error) {
    console.error('Compose error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🐳 Docker MCP running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

/*
Sample usage:

# Run container
curl -X POST http://localhost:4052/run \
  -H "Content-Type: application/json" \
  -d '{
    "image": "nginx:latest",
    "name": "my-nginx",
    "ports": {"8080": "80"},
    "environment": {"ENV": "production"}
  }'

# List containers
curl -X GET http://localhost:4052/containers?all=true

# Execute command
curl -X POST http://localhost:4052/exec \
  -H "Content-Type: application/json" \
  -d '{"container": "my-nginx", "command": "ls -la"}'
*/