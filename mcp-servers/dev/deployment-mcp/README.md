# Deployment MCP

**Port:** 4047  
**Purpose:** Automated deployment to Vercel, Netlify, Firebase, GitHub Actions, and SSH targets

## Features

- 🚀 Vercel deployment (preview and production)
- 🌐 Netlify deployment with build directory
- 🔥 Firebase hosting and functions
- 🤖 GitHub Actions workflow triggers
- 🔧 Project building with custom commands
- 🖥️ SSH deployment via rsync
- 📊 Deployment status checking
- 🏥 Health monitoring endpoint

## Environment Variables

- `VERCEL_TOKEN` - Vercel authentication token
- `NETLIFY_AUTH_TOKEN` - Netlify authentication token
- `GITHUB_TOKEN` - GitHub personal access token
- `FIREBASE_TOKEN` - Firebase CI token

## API Endpoints

### Health Check
```bash
GET /health
```

### Deploy to Vercel
```bash
curl -X POST http://localhost:4047/vercel \
  -H "Content-Type: application/json" \
  -d '{
    "projectPath": "/path/to/project",
    "production": true
  }'
```

### Deploy to Netlify
```bash
curl -X POST http://localhost:4047/netlify \
  -H "Content-Type: application/json" \
  -d '{
    "projectPath": "/path/to/project",
    "buildDir": "dist",
    "production": true
  }'
```

### Deploy to Firebase
```bash
curl -X POST http://localhost:4047/firebase \
  -H "Content-Type: application/json" \
  -d '{
    "projectPath": "/path/to/project",
    "project": "my-firebase-project",
    "only": "hosting"
  }'
```

### Trigger GitHub Actions
```bash
curl -X POST http://localhost:4047/github-actions \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "username",
    "repo": "repository",
    "workflow_id": "deploy.yml",
    "ref": "main",
    "inputs": {"environment": "production"}
  }'
```

### Build Project
```bash
curl -X POST http://localhost:4047/build \
  -H "Content-Type: application/json" \
  -d '{
    "projectPath": "/path/to/project",
    "buildCommand": "npm run build",
    "timeout": 600000
  }'
```

### SSH Deployment
```bash
curl -X POST http://localhost:4047/ssh-deploy \
  -H "Content-Type: application/json" \
  -d '{
    "host": "server.example.com",
    "user": "deploy",
    "deployPath": "/var/www/html",
    "buildDir": "dist",
    "projectPath": "/path/to/project"
  }'
```

### Check Deployment Status
```bash
curl -X POST http://localhost:4047/status \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "vercel",
    "deployment_id": "deployment_id_here"
  }'
```

## Supported Platforms

- **Vercel** - Static sites and serverless functions
- **Netlify** - Static sites with forms and functions
- **Firebase** - Hosting, functions, and firestore
- **GitHub Actions** - Custom CI/CD workflows
- **SSH/rsync** - Traditional server deployment

## Token Setup

### Vercel
1. Visit https://vercel.com/account/tokens
2. Create new token
3. Set as `VERCEL_TOKEN`

### Netlify
1. Visit https://app.netlify.com/user/applications
2. Create personal access token
3. Set as `NETLIFY_AUTH_TOKEN`

### Firebase
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login:ci`
3. Use token as `FIREBASE_TOKEN`

## Usage

1. Set required tokens in `.env` file
2. Install dependencies: `npm install express axios dotenv`
3. Start server: `npm start`
4. Supports both preview and production deployments