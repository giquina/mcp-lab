# Git MCP

**Port:** 4043  
**Purpose:** Git operations - add, commit, push, pull, branch management, and workflows

## Features

- 📊 Git status and diff operations
- ➕ Add files to staging area
- 💾 Commit changes with messages
- 🚀 Push and pull from remotes
- 🌿 Branch management (create, checkout, delete, list)
- 📜 View commit history
- ⚡ Quick commit workflow (add + commit + push)
- 🏥 Health monitoring endpoint

## API Endpoints

### Health Check
```bash
GET /health
```

### Git Status
```bash
curl -X POST http://localhost:4043/status \
  -H "Content-Type: application/json" \
  -d '{"repoPath": "/path/to/repo"}'
```

### Git Add
```bash
curl -X POST http://localhost:4043/add \
  -H "Content-Type: application/json" \
  -d '{"files": ".", "repoPath": "/path/to/repo"}'
```

### Git Commit
```bash
curl -X POST http://localhost:4043/commit \
  -H "Content-Type: application/json" \
  -d '{"message": "feat: add new feature", "repoPath": "/path/to/repo"}'
```

### Git Push
```bash
curl -X POST http://localhost:4043/push \
  -H "Content-Type: application/json" \
  -d '{"remote": "origin", "branch": "main", "repoPath": "/path/to/repo"}'
```

### Git Pull
```bash
curl -X POST http://localhost:4043/pull \
  -H "Content-Type: application/json" \
  -d '{"remote": "origin", "branch": "main", "repoPath": "/path/to/repo"}'
```

### Branch Operations
```bash
# List branches
curl -X POST http://localhost:4043/branch \
  -H "Content-Type: application/json" \
  -d '{"action": "list", "repoPath": "/path/to/repo"}'

# Create branch
curl -X POST http://localhost:4043/branch \
  -H "Content-Type: application/json" \
  -d '{"action": "create", "branchName": "feature-branch", "repoPath": "/path/to/repo"}'
```

### Git Log
```bash
curl -X POST http://localhost:4043/log \
  -H "Content-Type: application/json" \
  -d '{"limit": 5, "format": "oneline", "repoPath": "/path/to/repo"}'
```

### Git Diff
```bash
curl -X POST http://localhost:4043/diff \
  -H "Content-Type: application/json" \
  -d '{"staged": true, "repoPath": "/path/to/repo"}'
```

### Quick Commit (Add + Commit + Push)
```bash
curl -X POST http://localhost:4043/quick-commit \
  -H "Content-Type: application/json" \
  -d '{
    "message": "feat: add new feature",
    "files": ".",
    "push": true,
    "remote": "origin",
    "branch": "main",
    "repoPath": "/path/to/repo"
  }'
```

## Usage

1. Install dependencies: `npm install express dotenv`
2. Start server: `npm start`
3. Defaults to current working directory if no `repoPath` specified
4. Supports all standard Git operations through REST API