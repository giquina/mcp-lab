const express = require('express');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4041;

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${JSON.stringify(req.body)}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: '✅ Alive', service: 'file-mcp', port: PORT });
});

// Read file endpoint
app.post('/read', async (req, res) => {
  try {
    const { filePath, encoding = 'utf8' } = req.body;
    
    if (!filePath) {
      return res.status(400).json({ error: 'filePath is required' });
    }

    const content = await fs.readFile(filePath, encoding);
    const stats = await fs.stat(filePath);

    res.json({ 
      success: true, 
      content,
      filePath,
      size: stats.size,
      modified: stats.mtime
    });
  } catch (error) {
    console.error('Read error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Write file endpoint
app.post('/write', async (req, res) => {
  try {
    const { filePath, content, encoding = 'utf8' } = req.body;
    
    if (!filePath || content === undefined) {
      return res.status(400).json({ error: 'filePath and content are required' });
    }

    // Ensure directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, encoding);

    res.json({ 
      success: true, 
      message: 'File written successfully',
      filePath,
      size: Buffer.byteLength(content, encoding)
    });
  } catch (error) {
    console.error('Write error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Append to file endpoint
app.post('/append', async (req, res) => {
  try {
    const { filePath, content, encoding = 'utf8' } = req.body;
    
    if (!filePath || content === undefined) {
      return res.status(400).json({ error: 'filePath and content are required' });
    }

    await fs.appendFile(filePath, content, encoding);

    res.json({ 
      success: true, 
      message: 'Content appended successfully',
      filePath
    });
  } catch (error) {
    console.error('Append error:', error);
    res.status(500).json({ error: error.message });
  }
});

// List directory endpoint
app.post('/list', async (req, res) => {
  try {
    const { dirPath, recursive = false } = req.body;
    
    if (!dirPath) {
      return res.status(400).json({ error: 'dirPath is required' });
    }

    const files = [];
    
    if (recursive) {
      const walkDir = async (dir) => {
        const items = await fs.readdir(dir, { withFileTypes: true });
        for (const item of items) {
          const fullPath = path.join(dir, item.name);
          if (item.isDirectory()) {
            await walkDir(fullPath);
          } else {
            const stats = await fs.stat(fullPath);
            files.push({
              name: item.name,
              path: fullPath,
              size: stats.size,
              modified: stats.mtime,
              isDirectory: false
            });
          }
        }
      };
      await walkDir(dirPath);
    } else {
      const items = await fs.readdir(dirPath, { withFileTypes: true });
      for (const item of items) {
        const fullPath = path.join(dirPath, item.name);
        const stats = await fs.stat(fullPath);
        files.push({
          name: item.name,
          path: fullPath,
          size: stats.size,
          modified: stats.mtime,
          isDirectory: item.isDirectory()
        });
      }
    }

    res.json({ 
      success: true, 
      files,
      dirPath,
      count: files.length
    });
  } catch (error) {
    console.error('List error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete file endpoint
app.post('/delete', async (req, res) => {
  try {
    const { filePath } = req.body;
    
    if (!filePath) {
      return res.status(400).json({ error: 'filePath is required' });
    }

    await fs.unlink(filePath);

    res.json({ 
      success: true, 
      message: 'File deleted successfully',
      filePath
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Copy file endpoint
app.post('/copy', async (req, res) => {
  try {
    const { sourcePath, destPath } = req.body;
    
    if (!sourcePath || !destPath) {
      return res.status(400).json({ error: 'sourcePath and destPath are required' });
    }

    // Ensure destination directory exists
    await fs.mkdir(path.dirname(destPath), { recursive: true });
    await fs.copyFile(sourcePath, destPath);

    res.json({ 
      success: true, 
      message: 'File copied successfully',
      sourcePath,
      destPath
    });
  } catch (error) {
    console.error('Copy error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`📁 File MCP running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

/*
Sample usage:

# Read file
curl -X POST http://localhost:4041/read \
  -H "Content-Type: application/json" \
  -d '{"filePath": "/path/to/file.txt"}'

# Write file
curl -X POST http://localhost:4041/write \
  -H "Content-Type: application/json" \
  -d '{"filePath": "/path/to/file.txt", "content": "Hello World"}'

# List directory
curl -X POST http://localhost:4041/list \
  -H "Content-Type: application/json" \
  -d '{"dirPath": "/path/to/directory", "recursive": false}'
*/