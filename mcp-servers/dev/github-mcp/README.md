# GitHub MCP

**Port:** 4044  
**Purpose:** GitHub API integration for repository, issue, and pull request management

## Features

- 🏗️ Create and manage repositories
- 📋 Create and list issues
- 🔀 Create and manage pull requests
- 🔍 Search repositories
- 👤 Get user and repository information
- 🏥 Health monitoring endpoint

## Environment Variables

- `GITHUB_TOKEN` - Your GitHub personal access token (required)

## API Endpoints

### Health Check
```bash
GET /health
```

### Create Repository
```bash
curl -X POST http://localhost:4044/create-repo \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-new-repo",
    "description": "A test repository",
    "private": false,
    "auto_init": true
  }'
```

### List Repositories
```bash
curl -X POST http://localhost:4044/list-repos \
  -H "Content-Type: application/json" \
  -d '{"type": "owner", "sort": "updated", "per_page": 30}'
```

### Create Issue
```bash
curl -X POST http://localhost:4044/create-issue \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "username",
    "repo": "repository",
    "title": "Bug report",
    "body": "Description of the bug",
    "labels": ["bug", "high-priority"]
  }'
```

### List Issues
```bash
curl -X POST http://localhost:4044/list-issues \
  -H "Content-Type: application/json" \
  -d '{"owner": "username", "repo": "repository", "state": "open"}'
```

### Create Pull Request
```bash
curl -X POST http://localhost:4044/create-pr \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "username",
    "repo": "repository",
    "title": "New feature",
    "head": "feature-branch",
    "base": "main",
    "body": "Description of changes"
  }'
```

### List Pull Requests
```bash
curl -X POST http://localhost:4044/list-prs \
  -H "Content-Type: application/json" \
  -d '{"owner": "username", "repo": "repository", "state": "open"}'
```

### Get Repository Info
```bash
curl -X POST http://localhost:4044/repo-info \
  -H "Content-Type: application/json" \
  -d '{"owner": "username", "repo": "repository"}'
```

### Get User Info
```bash
curl -X GET http://localhost:4044/user-info
```

### Search Repositories
```bash
curl -X POST http://localhost:4044/search-repos \
  -H "Content-Type: application/json" \
  -d '{"query": "javascript machine learning", "sort": "stars"}'
```

## GitHub Token Setup

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with these scopes:
   - `repo` (Full control of private repositories)
   - `user` (Read user profile data)
   - `write:org` (Write org and team membership)
3. Set the token in your `.env` file

## Usage

1. Set your `GITHUB_TOKEN` in the `.env` file
2. Install dependencies: `npm install @octokit/rest express dotenv`
3. Start server: `npm start`
4. All operations use your authenticated GitHub account