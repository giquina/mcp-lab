const express = require('express');
const { Octokit } = require('@octokit/rest');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4044;

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${JSON.stringify(req.body)}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: '✅ Alive', service: 'github-mcp', port: PORT });
});

// Create repository
app.post('/create-repo', async (req, res) => {
  try {
    const { name, description, private: isPrivate = false, auto_init = true } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Repository name is required' });
    }

    const response = await octokit.repos.createForAuthenticatedUser({
      name,
      description,
      private: isPrivate,
      auto_init
    });

    res.json({ 
      success: true, 
      repository: response.data,
      clone_url: response.data.clone_url,
      ssh_url: response.data.ssh_url
    });
  } catch (error) {
    console.error('Create repo error:', error);
    res.status(500).json({ error: error.message });
  }
});

// List repositories
app.post('/list-repos', async (req, res) => {
  try {
    const { type = 'owner', sort = 'updated', per_page = 30 } = req.body;
    
    const response = await octokit.repos.listForAuthenticatedUser({
      type,
      sort,
      per_page
    });

    res.json({ 
      success: true, 
      repositories: response.data.map(repo => ({
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        private: repo.private,
        clone_url: repo.clone_url,
        updated_at: repo.updated_at
      }))
    });
  } catch (error) {
    console.error('List repos error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create issue
app.post('/create-issue', async (req, res) => {
  try {
    const { owner, repo, title, body, labels, assignees } = req.body;
    
    if (!owner || !repo || !title) {
      return res.status(400).json({ error: 'owner, repo, and title are required' });
    }

    const response = await octokit.issues.create({
      owner,
      repo,
      title,
      body,
      labels,
      assignees
    });

    res.json({ 
      success: true, 
      issue: {
        number: response.data.number,
        title: response.data.title,
        body: response.data.body,
        url: response.data.html_url,
        state: response.data.state
      }
    });
  } catch (error) {
    console.error('Create issue error:', error);
    res.status(500).json({ error: error.message });
  }
});

// List issues
app.post('/list-issues', async (req, res) => {
  try {
    const { owner, repo, state = 'open', per_page = 30 } = req.body;
    
    if (!owner || !repo) {
      return res.status(400).json({ error: 'owner and repo are required' });
    }

    const response = await octokit.issues.listForRepo({
      owner,
      repo,
      state,
      per_page
    });

    res.json({ 
      success: true, 
      issues: response.data.map(issue => ({
        number: issue.number,
        title: issue.title,
        body: issue.body,
        state: issue.state,
        url: issue.html_url,
        created_at: issue.created_at,
        updated_at: issue.updated_at
      }))
    });
  } catch (error) {
    console.error('List issues error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create pull request
app.post('/create-pr', async (req, res) => {
  try {
    const { owner, repo, title, head, base, body } = req.body;
    
    if (!owner || !repo || !title || !head || !base) {
      return res.status(400).json({ error: 'owner, repo, title, head, and base are required' });
    }

    const response = await octokit.pulls.create({
      owner,
      repo,
      title,
      head,
      base,
      body
    });

    res.json({ 
      success: true, 
      pull_request: {
        number: response.data.number,
        title: response.data.title,
        body: response.data.body,
        url: response.data.html_url,
        state: response.data.state,
        head: response.data.head.ref,
        base: response.data.base.ref
      }
    });
  } catch (error) {
    console.error('Create PR error:', error);
    res.status(500).json({ error: error.message });
  }
});

// List pull requests
app.post('/list-prs', async (req, res) => {
  try {
    const { owner, repo, state = 'open', per_page = 30 } = req.body;
    
    if (!owner || !repo) {
      return res.status(400).json({ error: 'owner and repo are required' });
    }

    const response = await octokit.pulls.list({
      owner,
      repo,
      state,
      per_page
    });

    res.json({ 
      success: true, 
      pull_requests: response.data.map(pr => ({
        number: pr.number,
        title: pr.title,
        body: pr.body,
        state: pr.state,
        url: pr.html_url,
        head: pr.head.ref,
        base: pr.base.ref,
        created_at: pr.created_at,
        updated_at: pr.updated_at
      }))
    });
  } catch (error) {
    console.error('List PRs error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get repository info
app.post('/repo-info', async (req, res) => {
  try {
    const { owner, repo } = req.body;
    
    if (!owner || !repo) {
      return res.status(400).json({ error: 'owner and repo are required' });
    }

    const response = await octokit.repos.get({
      owner,
      repo
    });

    res.json({ 
      success: true, 
      repository: {
        name: response.data.name,
        full_name: response.data.full_name,
        description: response.data.description,
        private: response.data.private,
        clone_url: response.data.clone_url,
        ssh_url: response.data.ssh_url,
        homepage: response.data.homepage,
        language: response.data.language,
        stars: response.data.stargazers_count,
        forks: response.data.forks_count,
        open_issues: response.data.open_issues_count,
        created_at: response.data.created_at,
        updated_at: response.data.updated_at
      }
    });
  } catch (error) {
    console.error('Repo info error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user info
app.get('/user-info', async (req, res) => {
  try {
    const response = await octokit.users.getAuthenticated();

    res.json({ 
      success: true, 
      user: {
        login: response.data.login,
        name: response.data.name,
        email: response.data.email,
        bio: response.data.bio,
        location: response.data.location,
        company: response.data.company,
        public_repos: response.data.public_repos,
        followers: response.data.followers,
        following: response.data.following,
        avatar_url: response.data.avatar_url,
        html_url: response.data.html_url
      }
    });
  } catch (error) {
    console.error('User info error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Search repositories
app.post('/search-repos', async (req, res) => {
  try {
    const { query, sort = 'updated', order = 'desc', per_page = 30 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'search query is required' });
    }

    const response = await octokit.search.repos({
      q: query,
      sort,
      order,
      per_page
    });

    res.json({ 
      success: true, 
      total_count: response.data.total_count,
      repositories: response.data.items.map(repo => ({
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        clone_url: repo.clone_url,
        stars: repo.stargazers_count,
        language: repo.language,
        updated_at: repo.updated_at
      }))
    });
  } catch (error) {
    console.error('Search repos error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🐙 GitHub MCP running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

/*
Sample usage:

# Create repository
curl -X POST http://localhost:4044/create-repo \
  -H "Content-Type: application/json" \
  -d '{"name": "my-new-repo", "description": "A test repository", "private": false}'

# Create issue
curl -X POST http://localhost:4044/create-issue \
  -H "Content-Type: application/json" \
  -d '{"owner": "username", "repo": "repository", "title": "Bug report", "body": "Found a bug"}'

# Create pull request
curl -X POST http://localhost:4044/create-pr \
  -H "Content-Type: application/json" \
  -d '{"owner": "username", "repo": "repository", "title": "New feature", "head": "feature-branch", "base": "main"}'
*/