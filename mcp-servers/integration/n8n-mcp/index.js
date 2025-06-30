const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4051;
const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678';

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${JSON.stringify(req.body)}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: '✅ Alive', service: 'n8n-mcp', port: PORT });
});

// Trigger n8n webhook
app.post('/webhook/:webhookId', async (req, res) => {
  try {
    const { webhookId } = req.params;
    const { data = {}, method = 'POST' } = req.body;
    
    const webhookUrl = `${N8N_BASE_URL}/webhook/${webhookId}`;
    
    const response = await axios({
      method: method.toLowerCase(),
      url: webhookUrl,
      data,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    res.json({ 
      success: true, 
      webhookId,
      response: response.data,
      status: response.status
    });
  } catch (error) {
    console.error('Webhook trigger error:', error);
    res.status(500).json({ 
      error: error.message,
      response: error.response?.data
    });
  }
});

// Get workflow status
app.get('/workflow/:workflowId/status', async (req, res) => {
  try {
    const { workflowId } = req.params;
    
    const response = await axios.get(
      `${N8N_BASE_URL}/api/v1/workflows/${workflowId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.N8N_API_KEY}`
        }
      }
    );
    
    res.json({ 
      success: true, 
      workflow: response.data
    });
  } catch (error) {
    console.error('Workflow status error:', error);
    res.status(500).json({ 
      error: error.message,
      response: error.response?.data
    });
  }
});

// Execute workflow
app.post('/workflow/:workflowId/execute', async (req, res) => {
  try {
    const { workflowId } = req.params;
    const { data = {} } = req.body;
    
    const response = await axios.post(
      `${N8N_BASE_URL}/api/v1/workflows/${workflowId}/execute`,
      { data },
      {
        headers: {
          'Authorization': `Bearer ${process.env.N8N_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json({ 
      success: true, 
      execution: response.data,
      workflowId
    });
  } catch (error) {
    console.error('Workflow execution error:', error);
    res.status(500).json({ 
      error: error.message,
      response: error.response?.data
    });
  }
});

// Get execution status
app.get('/execution/:executionId', async (req, res) => {
  try {
    const { executionId } = req.params;
    
    const response = await axios.get(
      `${N8N_BASE_URL}/api/v1/executions/${executionId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.N8N_API_KEY}`
        }
      }
    );
    
    res.json({ 
      success: true, 
      execution: response.data
    });
  } catch (error) {
    console.error('Execution status error:', error);
    res.status(500).json({ 
      error: error.message,
      response: error.response?.data
    });
  }
});

// List workflows
app.get('/workflows', async (req, res) => {
  try {
    const response = await axios.get(
      `${N8N_BASE_URL}/api/v1/workflows`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.N8N_API_KEY}`
        }
      }
    );
    
    res.json({ 
      success: true, 
      workflows: response.data.data || response.data,
      count: response.data.data?.length || 0
    });
  } catch (error) {
    console.error('List workflows error:', error);
    res.status(500).json({ 
      error: error.message,
      response: error.response?.data
    });
  }
});

// Create workflow
app.post('/workflows', async (req, res) => {
  try {
    const { name, nodes, connections } = req.body;
    
    if (!name || !nodes) {
      return res.status(400).json({ error: 'name and nodes are required' });
    }
    
    const workflowData = {
      name,
      nodes,
      connections: connections || {},
      active: false,
      settings: {}
    };
    
    const response = await axios.post(
      `${N8N_BASE_URL}/api/v1/workflows`,
      workflowData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.N8N_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json({ 
      success: true, 
      workflow: response.data
    });
  } catch (error) {
    console.error('Create workflow error:', error);
    res.status(500).json({ 
      error: error.message,
      response: error.response?.data
    });
  }
});

// Activate/Deactivate workflow
app.patch('/workflow/:workflowId/toggle', async (req, res) => {
  try {
    const { workflowId } = req.params;
    const { active } = req.body;
    
    const response = await axios.patch(
      `${N8N_BASE_URL}/api/v1/workflows/${workflowId}`,
      { active: active !== undefined ? active : true },
      {
        headers: {
          'Authorization': `Bearer ${process.env.N8N_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json({ 
      success: true, 
      workflow: response.data,
      active: response.data.active
    });
  } catch (error) {
    console.error('Toggle workflow error:', error);
    res.status(500).json({ 
      error: error.message,
      response: error.response?.data
    });
  }
});

app.listen(PORT, () => {
  console.log(`🔗 n8n MCP running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`n8n Base URL: ${N8N_BASE_URL}`);
});

/*
Sample usage:

# Trigger webhook
curl -X POST http://localhost:4051/webhook/your-webhook-id \
  -H "Content-Type: application/json" \
  -d '{"data": {"name": "John", "action": "signup"}}'

# Execute workflow
curl -X POST http://localhost:4051/workflow/workflow-id/execute \
  -H "Content-Type: application/json" \
  -d '{"data": {"input": "value"}}'

# List workflows
curl -X GET http://localhost:4051/workflows
*/