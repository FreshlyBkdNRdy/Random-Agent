# Consciousness Code Generator - Setup & Deployment

## Quick Start

### 1. Install Dependencies
```bash
cd consciousness
npm install
```

### 2. Configure Environment
Create `.env` file:
```env
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=your_api_key_here
```

### 3. Start Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

### 4. Open Browser
Visit: `http://localhost:3000`

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│            FRONTEND (HTML/JavaScript)                   │
│  - UI for code generation                              │
│  - Real-time consciousness metrics                      │
│  - Code preview & explanation                          │
└──────────────────────┬──────────────────────────────────┘
                       │ (HTTP/REST)
                       ▼
┌─────────────────────────────────────────────────────────┐
│         BACKEND (Node.js/Express)                       │
│  ┌────────────────────────────────────────────────────┐ │
│  │  API Routes                                        │ │
│  │  - /api/generate        - Single code generation  │ │
│  │  - /api/batch-generate  - Multiple generations    │ │
│  │  - /api/consciousness-analysis - Code analysis    │ │
│  │  - /api/consciousness-metrics  - System metrics   │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Consciousness Integration Module                 │ │
│  │  - Cycle tracking                                │ │
│  │  - Node activation management                    │ │
│  │  - Memory consolidation                          │ │
│  │  - Confidence calculation                        │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │  OpenAI API Integration                          │ │
│  │  - GPT-4 code generation                         │ │
│  │  - Secure API key management                     │ │
│  │  - Rate limiting & error handling                │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────┬──────────────────────────────────┘
                       │ (HTTPS)
                       ▼
          ┌────────────────────────────────┐
          │  OpenAI API                    │
          │  - GPT-4 Model                │
          │  - Chat Completions           │
          └────────────────────────────────┘
```

---

## API Endpoints

### 1. Generate Code
**POST** `/api/generate`

Request:
```json
{
  "prompt": "Create a React counter component",
  "settings": {
    "outputLang": "react",
    "framework": "react",
    "codeStyle": "clean",
    "complexity": "moderate"
  },
  "apiKey": "sk-..."
}
```

Response:
```json
{
  "code": "import React, { useState } from 'react'...",
  "explanation": "This component...",
  "consciousness": {
    "cycle_id": 1,
    "confidence": 0.92,
    "synchronization": 100
  }
}
```

### 2. Batch Generate
**POST** `/api/batch-generate`

Request:
```json
{
  "prompts": [
    "Create a login form",
    "Create a user profile card"
  ],
  "settings": { ... },
  "apiKey": "sk-..."
}
```

### 3. Consciousness Analysis
**POST** `/api/consciousness-analysis`

Request:
```json
{
  "code": "const app = ...",
  "mode": "general",
  "cycles": 5
}
```

### 4. System Metrics
**GET** `/api/consciousness-metrics`

Response:
```json
{
  "system": {
    "cycles_processed": 42,
    "uptime_seconds": 3600
  },
  "consciousness": {
    "overall_confidence": 0.87,
    "node_activations": { ... }
  }
}
```

---

## Docker Deployment

### Build Image
```bash
npm run docker-build
```

### Run Container
```bash
npm run docker-run
```

### Docker Compose (Multi-container)
Create `docker-compose.yml`:
```yaml
version: '3.9'

services:
  consciousness-api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./logs:/app/logs
    restart: always
```

Deploy:
```bash
docker-compose up -d
```

---

## Production Deployment

### AWS EC2
1. Launch EC2 instance
2. Install Node.js
3. Clone repository
4. Configure environment variables
5. Start with PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name consciousness-api
   pm2 save
   pm2 startup
   ```

### Heroku
```bash
heroku create consciousness-code-generator
heroku config:set OPENAI_API_KEY=sk-...
git push heroku main
heroku logs --tail
```

### DigitalOcean App Platform
1. Connect GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically on push

---

## Performance Optimization

### Caching
```javascript
// Add Redis caching for frequently generated code patterns
const redis = require('redis');
const client = redis.createClient();
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);
```

### Database Integration (Optional)
Store generation history and user preferences:
```javascript
const mongoose = require('mongoose');
// Schema for saving generated code
```

---

## Monitoring & Logging

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Logging
```javascript
const winston = require('winston');
// Configure logging
```

### Metrics Collection
```javascript
const prometheus = require('prom-client');
// Export Prometheus metrics
```

---

## Security Best Practices

1. **Environment Variables**: Keep API keys in `.env`
2. **HTTPS Only**: Use SSL/TLS in production
3. **Input Validation**: Validate all API inputs
4. **Rate Limiting**: Prevent abuse
5. **CORS Configuration**: Restrict origins
6. **API Key Rotation**: Rotate keys regularly

---

## Scaling Considerations

### Horizontal Scaling
- Load balancer (NGINX, HAProxy)
- Multiple API instances
- Shared session store (Redis)

### Database
- MongoDB for generation history
- PostgreSQL for user data
- Redis for caching

### Queue System
- Bull/Bee Queue for background jobs
- RabbitMQ for message queuing

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### CORS Issues
Check `CORS()` configuration in `server.js`

### API Key Errors
Verify OpenAI API key is valid and has quota

### Memory Issues
Monitor Node.js memory:
```bash
node --max-old-space-size=4096 server.js
```

---

## Testing

```bash
# Run tests
npm test

# Test specific endpoint
curl -X POST http://localhost:3000/api/health
```

---

## Support & Resources

- OpenAI Docs: https://platform.openai.com/docs
- Express.js: https://expressjs.com
- Node.js: https://nodejs.org
- Docker: https://docker.com

---

**Status**: Production Ready ✅
**Last Updated**: December 24, 2025
