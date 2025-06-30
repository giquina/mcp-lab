# File MCP

**Port:** 4041  
**Purpose:** File system operations - read, write, list, delete, copy files

## Features

- 📖 Read files with encoding support
- ✍️ Write and append to files
- 📋 List directory contents (recursive option)
- 🗑️ Delete files
- 📁 Copy files with directory creation
- 🏥 Health monitoring endpoint

## API Endpoints

### Health Check
```bash
GET /health
```

### Read File
```bash
curl -X POST http://localhost:4041/read \
  -H "Content-Type: application/json" \
  -d '{"filePath": "/path/to/file.txt", "encoding": "utf8"}'
```

### Write File
```bash
curl -X POST http://localhost:4041/write \
  -H "Content-Type: application/json" \
  -d '{"filePath": "/path/to/file.txt", "content": "Hello World"}'
```

### Append to File
```bash
curl -X POST http://localhost:4041/append \
  -H "Content-Type: application/json" \
  -d '{"filePath": "/path/to/file.txt", "content": "\nNew line"}'
```

### List Directory
```bash
curl -X POST http://localhost:4041/list \
  -H "Content-Type: application/json" \
  -d '{"dirPath": "/path/to/directory", "recursive": true}'
```

### Delete File
```bash
curl -X POST http://localhost:4041/delete \
  -H "Content-Type: application/json" \
  -d '{"filePath": "/path/to/file.txt"}'
```

### Copy File
```bash
curl -X POST http://localhost:4041/copy \
  -H "Content-Type: application/json" \
  -d '{"sourcePath": "/path/to/source.txt", "destPath": "/path/to/dest.txt"}'
```

## Usage

1. Install dependencies: `npm install express dotenv`
2. Start server: `npm start`
3. Automatically creates directories when writing files