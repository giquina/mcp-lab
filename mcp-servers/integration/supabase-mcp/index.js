const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4050;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${JSON.stringify(req.body)}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: '✅ Alive', service: 'supabase-mcp', port: PORT });
});

// Insert data
app.post('/insert', async (req, res) => {
  try {
    const { table, data } = req.body;
    
    if (!table || !data) {
      return res.status(400).json({ error: 'table and data are required' });
    }

    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select();

    if (error) throw error;

    res.json({ 
      success: true, 
      data: result,
      table,
      inserted: Array.isArray(data) ? data.length : 1
    });
  } catch (error) {
    console.error('Insert error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Select data
app.post('/select', async (req, res) => {
  try {
    const { 
      table, 
      columns = '*', 
      filters = {},
      limit,
      orderBy,
      ascending = true 
    } = req.body;
    
    if (!table) {
      return res.status(400).json({ error: 'table is required' });
    }

    let query = supabase.from(table).select(columns);

    // Apply filters
    Object.entries(filters).forEach(([column, value]) => {
      if (typeof value === 'object' && value.operator) {
        query = query.filter(column, value.operator, value.value);
      } else {
        query = query.eq(column, value);
      }
    });

    // Apply ordering
    if (orderBy) {
      query = query.order(orderBy, { ascending });
    }

    // Apply limit
    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({ 
      success: true, 
      data,
      table,
      count: data.length
    });
  } catch (error) {
    console.error('Select error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update data
app.post('/update', async (req, res) => {
  try {
    const { table, data, filters = {} } = req.body;
    
    if (!table || !data || Object.keys(filters).length === 0) {
      return res.status(400).json({ error: 'table, data, and filters are required' });
    }

    let query = supabase.from(table).update(data);

    // Apply filters
    Object.entries(filters).forEach(([column, value]) => {
      query = query.eq(column, value);
    });

    const { data: result, error } = await query.select();

    if (error) throw error;

    res.json({ 
      success: true, 
      data: result,
      table,
      updated: result.length
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete data
app.post('/delete', async (req, res) => {
  try {
    const { table, filters = {} } = req.body;
    
    if (!table || Object.keys(filters).length === 0) {
      return res.status(400).json({ error: 'table and filters are required' });
    }

    let query = supabase.from(table).delete();

    // Apply filters
    Object.entries(filters).forEach(([column, value]) => {
      query = query.eq(column, value);
    });

    const { data, error } = await query.select();

    if (error) throw error;

    res.json({ 
      success: true, 
      data,
      table,
      deleted: data.length
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Authentication - Sign up
app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password, metadata = {} } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });

    if (error) throw error;

    res.json({ 
      success: true, 
      user: data.user,
      session: data.session
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Authentication - Sign in
app.post('/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    res.json({ 
      success: true, 
      user: data.user,
      session: data.session
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload file to storage
app.post('/storage/upload', async (req, res) => {
  try {
    const { bucket, fileName, file, contentType } = req.body;
    
    if (!bucket || !fileName || !file) {
      return res.status(400).json({ error: 'bucket, fileName, and file are required' });
    }

    // Convert base64 to buffer if needed
    const fileBuffer = Buffer.isBuffer(file) ? file : Buffer.from(file, 'base64');

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, fileBuffer, {
        contentType: contentType || 'application/octet-stream'
      });

    if (error) throw error;

    res.json({ 
      success: true, 
      data,
      bucket,
      fileName,
      path: data.path
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get file URL from storage
app.post('/storage/url', async (req, res) => {
  try {
    const { bucket, fileName, expiresIn = 3600 } = req.body;
    
    if (!bucket || !fileName) {
      return res.status(400).json({ error: 'bucket and fileName are required' });
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(fileName, expiresIn);

    if (error) throw error;

    res.json({ 
      success: true, 
      url: data.signedUrl,
      bucket,
      fileName,
      expiresIn
    });
  } catch (error) {
    console.error('URL generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Execute RPC function
app.post('/rpc', async (req, res) => {
  try {
    const { functionName, parameters = {} } = req.body;
    
    if (!functionName) {
      return res.status(400).json({ error: 'functionName is required' });
    }

    const { data, error } = await supabase.rpc(functionName, parameters);

    if (error) throw error;

    res.json({ 
      success: true, 
      data,
      functionName,
      parameters
    });
  } catch (error) {
    console.error('RPC error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Real-time subscription setup helper
app.post('/realtime/setup', async (req, res) => {
  try {
    const { table, event = '*', filters = {} } = req.body;
    
    if (!table) {
      return res.status(400).json({ error: 'table is required' });
    }

    // This endpoint returns subscription configuration
    // Actual subscription should be handled client-side
    res.json({ 
      success: true, 
      message: 'Use this configuration for client-side subscription',
      config: {
        table,
        event,
        filters,
        channel: `realtime:${table}`,
        example: `
const subscription = supabase
  .channel('${table}')
  .on('postgres_changes', { 
    event: '${event}', 
    schema: 'public', 
    table: '${table}' 
  }, (payload) => {
    console.log('Change received!', payload)
  })
  .subscribe()
        `
      }
    });
  } catch (error) {
    console.error('Realtime setup error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🗄️ Supabase MCP running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

/*
Sample usage:

# Insert data
curl -X POST http://localhost:4050/insert \
  -H "Content-Type: application/json" \
  -d '{"table": "users", "data": {"name": "John Doe", "email": "john@example.com"}}'

# Select data
curl -X POST http://localhost:4050/select \
  -H "Content-Type: application/json" \
  -d '{"table": "users", "filters": {"active": true}, "limit": 10}'

# Update data
curl -X POST http://localhost:4050/update \
  -H "Content-Type: application/json" \
  -d '{"table": "users", "data": {"last_login": "2024-01-01"}, "filters": {"id": 1}}'

# Authenticate user
curl -X POST http://localhost:4050/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
*/