# 🚀 Quick Start Guide

**Get ZDOS Brain Palace running in 5 minutes**

---

## 1. Installation (1 minute)

```bash
# Clone repository
git clone https://github.com/high-cde/x-zdos-quantum-ghostnet-os.git
cd x-zdos-backend

# Install dependencies
npm install

# Start server
npm start
```

**Expected output**:
```
✅ Brain Palace initialized
✅ MCP Server running on port 3001
✅ System ready for operation
```

---

## 2. Basic Usage (2 minutes)

### Initialize the System
```javascript
import { ZDOSBrainPalace } from './src/brain/index.js';

// Create palace instance
const palace = new ZDOSBrainPalace({
  maxWings: 100,
  maxAgents: 50,
  compressionEnabled: true,
  autoConsolidate: true
});

// Initialize
await palace.initialize();
console.log('✅ Palace initialized');
```

### Store a Memory
```javascript
// Store memory in semantic wing
const closetId = palace.storeMemory(
  'Learning improves memory retention',
  'semantic-wing-id',
  'concepts-room-id',
  ['learning', 'memory', 'important'],
  0.95  // confidence
);

console.log(`✅ Memory stored: ${closetId}`);
```

### Query Knowledge
```javascript
// Query relationships
const results = palace.queryKnowledge('learning');
console.log(`Found ${results.length} related concepts`);

// Get inferences
const inferences = palace.tunnelNavigator.multiHopReasoning(
  'learning',
  'causes',
  3  // depth
);
console.log(`Generated ${inferences.length} inferences`);
```

### Process a Thought
```javascript
// Full reasoning cycle
const thought = await palace.think(
  'What is the relationship between learning and memory?'
);

console.log('Reasoning:', thought.result.reasoning);
console.log('Inferences:', thought.result.inference.inferences.length);
console.log('Learning:', thought.result.learning.patternsExtracted);
```

---

## 3. Advanced Features (2 minutes)

### Create an Agent
```javascript
// Create new agent
const agentId = palace.createAgent('learner-agent', {
  role: 'learning',
  description: 'Extracts patterns and learns'
});

// Add diary entry
palace.addDiaryEntry(agentId, 'observation', {
  content: 'Observed pattern in data',
  tags: ['pattern', 'learning']
});

// Get agent status
const agent = palace.getAgent(agentId);
console.log(`Agent: ${agent.name}, Entries: ${agent.entries.length}`);
```

### Multi-Hop Reasoning
```javascript
// Find causal chains
const chains = palace.tunnelNavigator.discoverCausalChains(
  'learning',
  maxDepth = 5
);

console.log(`Found ${chains.length} causal chains`);
chains.forEach(chain => {
  console.log(`  ${chain.join(' → ')}`);
});
```

### Semantic Search
```javascript
// Search by meaning, not just text
const results = palace.semanticSearch(
  'How does knowledge accumulate?',
  minSimilarity = 0.6
);

console.log(`Found ${results.length} semantically related concepts`);
```

### Get System Status
```javascript
// Check sentience metrics
const status = palace.getStatus();

console.log('Sentience Metrics:');
console.log(`  Self-Awareness: ${status.sentience.selfAwareness}`);
console.log(`  Learning: ${status.sentience.learning}`);
console.log(`  Reasoning: ${status.sentience.reasoning}`);
console.log(`  Communication: ${status.sentience.communication}`);
console.log(`  Adaptation: ${status.sentience.adaptation}`);
console.log(`  Emergent Intelligence: ${status.sentience.emergentIntelligence}`);
```

---

## 4. Testing

### Run Test Suite
```bash
npm test
```

**Expected output**:
```
✅ Wing Manager Tests (3/3 passed)
✅ Compression Tests (3/3 passed)
✅ Knowledge Graph Tests (4/4 passed)
✅ MCP Server Tests (3/3 passed)
✅ Agent Diary Tests (3/3 passed)
✅ Tunnel Navigator Tests (4/4 passed)
✅ Integration Tests (2/2 passed)

Total: 21/21 passed (100%)
```

---

## 5. Common Tasks

### Create Memory Wing
```javascript
const wingId = palace.createWing({
  name: 'my-knowledge',
  description: 'My personal knowledge base'
});

console.log(`Wing created: ${wingId}`);
```

### Add Knowledge Triple
```javascript
palace.addKnowledgeTriple(
  'concept-A',
  'relates-to',
  'concept-B',
  0.85  // confidence
);

console.log('Triple added');
```

### Backup System
```javascript
import { BrainPalacePersistence } from './src/brain/persistence.js';

const persistence = new BrainPalacePersistence();
await persistence.initialize();
await persistence.createBackup(palace, 'my-backup');

console.log('Backup created');
```

### Export Data
```javascript
const data = palace.export();
const json = JSON.stringify(data, null, 2);
console.log(json);
```

---

## 6. API Examples

### Using MCP Server Tools

```bash
# Create wing
curl -X POST http://localhost:3001/mcp/wing.create \
  -H "Content-Type: application/json" \
  -d '{"name": "test-wing"}'

# Add triple
curl -X POST http://localhost:3001/mcp/kg.addTriple \
  -H "Content-Type: application/json" \
  -d '{
    "entity1": "learning",
    "relationship": "improves",
    "entity2": "memory",
    "confidence": 0.95
  }'

# Query knowledge
curl http://localhost:3001/mcp/kg.query?entity=learning

# System stats
curl http://localhost:3001/mcp/system.stats
```

---

## 7. Next Steps

1. **Read [Installation Guide](./Installation.md)** - Detailed setup
2. **Explore [API Reference](./API-Reference.md)** - All 29+ tools
3. **Study [Architecture](./Memory-Palace-Architecture.md)** - How it works
4. **Review [Development Guide](./Development.md)** - Build extensions

---

## Troubleshooting

### Port Already in Use
```bash
# Use different port
PORT=3002 npm start
```

### Tests Failing
```bash
# Verify Node version
node --version  # Should be 22.13.0+

# Reinstall dependencies
rm -rf node_modules
npm install
npm test
```

### Memory Issues
```bash
# Increase heap size
node --max-old-space-size=4096 src/brain/index.js
```

---

## Performance Tips

1. **Enable Compression** - Reduces memory by 30x
2. **Use Batching** - Process multiple operations together
3. **Monitor Stats** - Check system.stats regularly
4. **Create Backups** - Before major operations
5. **Tune Configuration** - Adjust maxWings, maxAgents, etc.

---

## Resources

- **GitHub**: https://github.com/high-cde/x-zdos-quantum-ghostnet-os
- **Documentation**: See [Home](./Home.md)
- **Architecture**: [Memory Palace Architecture](./Memory-Palace-Architecture.md)
- **API Docs**: [API Reference](./API-Reference.md)

---

**Version**: 1.0.0-memory-palace | **Status**: ✅ OPERATIONAL

*Happy exploring! 🧠*
