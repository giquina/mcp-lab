# n8n MCP

**Port:** 4051  
**Purpose:** n8n workflow automation integration - trigger webhooks, execute workflows, and manage automation

## Features

- 🔗 Webhook triggering
- ▶️ Workflow execution
- 📊 Execution status monitoring
- 📋 Workflow management (list, create, activate)
- 🏥 Health monitoring endpoint

## Environment Variables

- `N8N_BASE_URL` - n8n instance URL (default: http://localhost:5678)
- `N8N_API_KEY` - n8n API key for authenticated operations

## API Endpoints

### Health Check
```bash
GET /health
```

### Trigger Webhook
```bash
curl -X POST http://localhost:4051/webhook/your-webhook-id \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "name": "John Doe",
      "action": "user_signup",
      "timestamp": "2024-01-01T10:00:00Z"
    },
    "method": "POST"
  }'
```

### Execute Workflow
```bash
curl -X POST http://localhost:4051/workflow/workflow-id/execute \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "input_data": "value",
      "parameters": {"param1": "value1"}
    }
  }'
```

### Get Workflow Status
```bash
curl -X GET http://localhost:4051/workflow/workflow-id/status
```

### Get Execution Status
```bash
curl -X GET http://localhost:4051/execution/execution-id
```

### List Workflows
```bash
curl -X GET http://localhost:4051/workflows
```

### Create Workflow
```bash
curl -X POST http://localhost:4051/workflows \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My New Workflow",
    "nodes": [
      {
        "name": "Start",
        "type": "n8n-nodes-base.start",
        "position": [240, 300],
        "parameters": {}
      }
    ],
    "connections": {}
  }'
```

### Activate/Deactivate Workflow
```bash
curl -X PATCH http://localhost:4051/workflow/workflow-id/toggle \
  -H "Content-Type: application/json" \
  -d '{"active": true}'
```

## Common Use Cases

### Automation Triggers
- **User Events**: Signup, login, purchase completion
- **Data Processing**: File uploads, form submissions
- **Scheduled Tasks**: Daily reports, cleanup operations
- **Integration Events**: API updates, webhook notifications

### Workflow Types
- **Data Sync**: Sync data between different services
- **Notifications**: Send emails, SMS, or push notifications
- **Data Processing**: Transform and validate incoming data
- **API Orchestration**: Chain multiple API calls together

## n8n Setup

1. Install n8n: `npm install -g n8n`
2. Start n8n: `n8n start`
3. Access UI: http://localhost:5678
4. Create API key in n8n settings
5. Set up webhooks and workflows in the UI

## Webhook URLs

n8n webhooks are accessible at:
- Test: `http://localhost:5678/webhook-test/webhook-id`
- Production: `http://localhost:5678/webhook/webhook-id`

## Usage

1. Set up n8n instance and get API key
2. Configure environment variables
3. Install dependencies: `npm install express axios dotenv`
4. Start server: `npm start`
5. Use MCP to trigger and manage n8n workflows programmatically