# Docker MCP

**Port:** 4052  
**Purpose:** Docker container management - run, stop, start, remove containers and Docker Compose operations

## Features

- 🏃 Run containers with custom configuration
- 📋 List running and stopped containers
- ⏹️ Stop, start, and remove containers
- 💻 Execute commands inside containers
- 📜 View container logs
- 🐙 Docker Compose operations
- 🏥 Health monitoring endpoint

## API Endpoints

### Health Check
```bash
GET /health
```

### Run Container
```bash
curl -X POST http://localhost:4052/run \
  -H "Content-Type: application/json" \
  -d '{
    "image": "nginx:latest",
    "name": "my-nginx",
    "ports": {"8080": "80", "8443": "443"},
    "environment": {"ENV": "production", "DEBUG": "false"},
    "volumes": {"/host/path": "/container/path"},
    "detach": true,
    "remove": false
  }'
```

### List Containers
```bash
# List running containers
curl -X GET http://localhost:4052/containers

# List all containers (including stopped)
curl -X GET http://localhost:4052/containers?all=true
```

### Stop Container
```bash
curl -X POST http://localhost:4052/stop \
  -H "Content-Type: application/json" \
  -d '{"container": "my-nginx"}'
```

### Start Container
```bash
curl -X POST http://localhost:4052/start \
  -H "Content-Type: application/json" \
  -d '{"container": "my-nginx"}'
```

### Remove Container
```bash
curl -X POST http://localhost:4052/remove \
  -H "Content-Type: application/json" \
  -d '{"container": "my-nginx", "force": true}'
```

### Execute Command in Container
```bash
curl -X POST http://localhost:4052/exec \
  -H "Content-Type: application/json" \
  -d '{
    "container": "my-nginx",
    "command": "ls -la /etc/nginx",
    "interactive": false
  }'
```

### View Container Logs
```bash
curl -X POST http://localhost:4052/logs \
  -H "Content-Type: application/json" \
  -d '{
    "container": "my-nginx",
    "tail": 100,
    "follow": false
  }'
```

### Docker Compose Operations
```bash
# Start services
curl -X POST http://localhost:4052/compose/up \
  -H "Content-Type: application/json" \
  -d '{
    "projectPath": "/path/to/project",
    "file": "docker-compose.yml"
  }'

# Stop services
curl -X POST http://localhost:4052/compose/down \
  -H "Content-Type: application/json" \
  -d '{"projectPath": "/path/to/project"}'

# View compose services
curl -X POST http://localhost:4052/compose/ps \
  -H "Content-Type: application/json" \
  -d '{"projectPath": "/path/to/project"}'
```

## Supported Compose Actions

- `up` - Start services in detached mode
- `down` - Stop and remove services
- `build` - Build services
- `ps` - List services
- `logs` - View service logs
- `restart` - Restart services

## Container Configuration

### Port Mapping
```json
{
  "ports": {
    "host_port": "container_port",
    "8080": "80",
    "8443": "443"
  }
}
```

### Environment Variables
```json
{
  "environment": {
    "NODE_ENV": "production",
    "DATABASE_URL": "postgresql://..."
  }
}
```

### Volume Mounts
```json
{
  "volumes": {
    "/host/path": "/container/path",
    "/var/log": "/app/logs"
  }
}
```

## Usage

1. Ensure Docker is installed and running
2. Install dependencies: `npm install express dotenv`
3. Start server: `npm start`
4. Use API endpoints to manage containers programmatically

## Common Use Cases

- **Development Environment**: Spin up databases, Redis, etc.
- **Testing**: Run isolated test environments
- **Microservices**: Manage service containers
- **CI/CD**: Deploy and manage application containers