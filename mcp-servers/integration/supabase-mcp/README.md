# Supabase MCP

**Port:** 4050  
**Purpose:** Supabase database operations, authentication, storage, and real-time subscriptions

## Features

- 🗄️ Database CRUD operations (insert, select, update, delete)
- 🔐 Authentication (signup, signin, user management)
- 📁 File storage and signed URL generation
- ⚡ RPC function execution
- 🔄 Real-time subscription configuration
- 🏥 Health monitoring endpoint

## Environment Variables

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (for admin operations)

## API Endpoints

### Health Check
```bash
GET /health
```

### Insert Data
```bash
curl -X POST http://localhost:4050/insert \
  -H "Content-Type: application/json" \
  -d '{
    "table": "users",
    "data": {
      "name": "John Doe",
      "email": "john@example.com",
      "age": 30
    }
  }'
```

### Select Data
```bash
curl -X POST http://localhost:4050/select \
  -H "Content-Type: application/json" \
  -d '{
    "table": "users",
    "columns": "id, name, email",
    "filters": {"active": true},
    "orderBy": "created_at",
    "ascending": false,
    "limit": 10
  }'
```

### Update Data
```bash
curl -X POST http://localhost:4050/update \
  -H "Content-Type: application/json" \
  -d '{
    "table": "users",
    "data": {"last_login": "2024-01-01T10:00:00Z"},
    "filters": {"id": 1}
  }'
```

### Delete Data
```bash
curl -X POST http://localhost:4050/delete \
  -H "Content-Type: application/json" \
  -d '{
    "table": "users",
    "filters": {"id": 1}
  }'
```

### User Signup
```bash
curl -X POST http://localhost:4050/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "metadata": {"full_name": "John Doe"}
  }'
```

### User Signin
```bash
curl -X POST http://localhost:4050/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'
```

### Upload File
```bash
curl -X POST http://localhost:4050/storage/upload \
  -H "Content-Type: application/json" \
  -d '{
    "bucket": "avatars",
    "fileName": "user-avatar.jpg",
    "file": "base64_encoded_file_content",
    "contentType": "image/jpeg"
  }'
```

### Get File URL
```bash
curl -X POST http://localhost:4050/storage/url \
  -H "Content-Type: application/json" \
  -d '{
    "bucket": "avatars",
    "fileName": "user-avatar.jpg",
    "expiresIn": 3600
  }'
```

### Execute RPC Function
```bash
curl -X POST http://localhost:4050/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "functionName": "get_user_stats",
    "parameters": {"user_id": 123}
  }'
```

### Real-time Setup
```bash
curl -X POST http://localhost:4050/realtime/setup \
  -H "Content-Type: application/json" \
  -d '{
    "table": "messages",
    "event": "INSERT",
    "filters": {"room_id": "eq.1"}
  }'
```

## Filter Operators

When using filters, you can specify operators:

```json
{
  "filters": {
    "age": {"operator": "gte", "value": 18},
    "name": {"operator": "ilike", "value": "%john%"},
    "active": true
  }
}
```

Available operators: `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `in`, `is`, `not`

## Usage

1. Set up your Supabase project at https://supabase.com
2. Add environment variables to `.env` file
3. Install dependencies: `npm install @supabase/supabase-js express dotenv`
4. Start server: `npm start`
5. Configure RLS policies in Supabase for security