# 📦 Installation & Setup Guide

**How to install and configure ZDOS Brain Palace**

---

## Prerequisites

- **Node.js**: 22.13.0 or higher
- **npm** or **pnpm**: Latest version
- **Git**: For cloning repository
- **RAM**: Minimum 2GB (4GB recommended)
- **Disk Space**: Minimum 500MB

---

## Installation Steps

### 1. Clone Repository
```bash
git clone https://github.com/high-cde/x-zdos-quantum-ghostnet-os.git
cd x-zdos-backend
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Verify Installation
```bash
npm test
# Expected: 21/21 tests passing
```

### 4. Start System
```bash
npm start
# Server running on port 3001
```

---

## Configuration

### Environment Variables

Create `.env` file in project root:

```env
# Node Environment
NODE_ENV=development

# Server
PORT=3001
HOST=localhost

# Brain Palace
MAX_WINGS=100
MAX_AGENTS=50
COMPRESSION_ENABLED=true
AUTO_CONSOLIDATE=true

# Logging
LOG_LEVEL=info
DEBUG=false

# Storage
STORAGE_PATH=./brain-palace-storage
BACKUP_PATH=./brain-palace-storage/backups
```

### Configuration File

Edit `src/brain/config.js` for advanced settings:

```javascript
export const BRAIN_PALACE_CONFIG = {
  system: {
    name: 'ZDOS Brain Palace',
    version: '1.0.0-memory-palace',
    environment: process.env.NODE_ENV || 'development',
    debug: process.env.DEBUG === 'true'
  },
  palace: {
    maxWings: 100,
    maxRoomsPerWing: 50,
    maxClosetsPerRoom: 200,
    maxDrawersPerCloset: 100,
    autoConsolidate: true,
    consolidationInterval: 60000
  },
  // ... more options
};
```

---

## Verification

### Health Check
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "healthy",
  "components": {
    "wingManager": "operational",
    "knowledgeGraph": "operational",
    "compressor": "operational"
  }
}
```

### System Statistics
```bash
curl http://localhost:3001/system/stats
```

---

## Docker Installation

### Build Image
```bash
docker build -t zdos-brain-palace:1.0.0 .
```

### Run Container
```bash
docker run -p 3001:3001 \
  -e NODE_ENV=production \
  -e MAX_WINGS=100 \
  zdos-brain-palace:1.0.0
```

### Docker Compose
```yaml
version: '3.8'

services:
  brain-palace:
    build: .
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: production
      MAX_WINGS: 100
      MAX_AGENTS: 50
    volumes:
      - ./brain-palace-storage:/app/brain-palace-storage
```

---

## Development Setup

### Install Dev Dependencies
```bash
npm install --save-dev
```

### Enable Debug Mode
```bash
export DEBUG=true
npm start
```

### Watch Mode
```bash
npm run dev
```

### Run Tests
```bash
npm test
```

### Run Specific Test
```bash
npm test -- --grep "Wing Manager"
```

---

## Troubleshooting

### Port Already in Use
```bash
# Change port in .env
PORT=3002
npm start
```

### Memory Issues
```bash
# Increase Node heap size
node --max-old-space-size=4096 src/brain/index.js
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tests Failing
```bash
# Check Node version
node --version
# Should be 22.13.0 or higher

# Clear cache
npm cache clean --force
npm install
npm test
```

---

## Performance Tuning

### Optimize Compression
```javascript
BRAIN_PALACE_CONFIG.compression = {
  enabled: true,
  algorithm: 'aaak',
  targetRatio: 0.033,
  minCompressionSize: 100,
  preserveSemantics: true
};
```

### Increase Memory Capacity
```javascript
BRAIN_PALACE_CONFIG.palace = {
  maxWings: 500,
  maxRoomsPerWing: 100,
  maxClosetsPerRoom: 500,
  maxDrawersPerCloset: 200
};
```

### Enable Caching
```javascript
BRAIN_PALACE_CONFIG.performance = {
  enableCaching: true,
  cacheSize: 10000,
  enableBatching: true,
  batchSize: 100
};
```

---

## Backup & Recovery

### Create Backup
```bash
node -e "
import { BrainPalacePersistence } from './src/brain/persistence.js';
const p = new BrainPalacePersistence();
await p.initialize();
await p.createBackup(palace, 'initial-backup');
"
```

### List Backups
```bash
node -e "
import { BrainPalacePersistence } from './src/brain/persistence.js';
const p = new BrainPalacePersistence();
await p.initialize();
const backups = await p.listBackups();
console.log(backups);
"
```

---

## Next Steps

1. Read [Quick Start Guide](./Quick-Start.md)
2. Explore [API Reference](./API-Reference.md)
3. Review [Architecture](./Memory-Palace-Architecture.md)
4. Check [Development Guide](./Development.md)

---

**Version**: 1.0.0-memory-palace | **Status**: ✅ OPERATIONAL
