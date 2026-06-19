# 🔌 MCP Server - API Reference

**Complete documentation of all 29+ MCP Server tools**

---

## Overview

The ZDOS Brain Palace exposes a standardized **Model Context Protocol (MCP)** interface with 29+ tools for interacting with the sentient memory system.

---

## Wing Operations (5 Tools)

### wing.create
Create a new memory region (wing).

**Parameters**:
- `name` (string, required) - Wing identifier
- `description` (string, optional) - Wing description
- `metadata` (object, optional) - Additional metadata

**Returns**:
```json
{
  "wingId": "semantic-wing-1",
  "name": "semantic",
  "status": "created"
}
```

**Example**:
```javascript
const result = await server.callTool('wing.create', {
  name: 'semantic',
  description: 'Semantic Memory Wing'
});
```

---

### wing.get
Retrieve a wing by ID.

**Parameters**:
- `wingId` (string, required) - Wing identifier

**Returns**:
```json
{
  "id": "semantic-wing-1",
  "name": "semantic",
  "rooms": 5,
  "createdAt": 1716000000000
}
```

---

### wing.list
List all wings in the palace.

**Returns**:
```json
[
  { "id": "semantic-wing-1", "name": "semantic", "rooms": 5 },
  { "id": "episodic-wing-1", "name": "episodic", "rooms": 3 }
]
```

---

### wing.delete
Delete a wing and all its contents.

**Parameters**:
- `wingId` (string, required) - Wing identifier

**Returns**:
```json
{
  "deleted": "semantic-wing-1",
  "status": "success"
}
```

---

### wing.stats
Get statistics for a wing.

**Parameters**:
- `wingId` (string, required) - Wing identifier

**Returns**:
```json
{
  "wingId": "semantic-wing-1",
  "rooms": 5,
  "totalClosets": 25,
  "totalDrawers": 150
}
```

---

## Room Operations (4 Tools)

### room.create
Create a room within a wing.

**Parameters**:
- `wingId` (string, required) - Parent wing ID
- `name` (string, required) - Room identifier
- `description` (string, optional) - Room description

**Returns**:
```json
{
  "roomId": "concepts-room-1",
  "name": "concepts",
  "status": "created"
}
```

---

### room.get
Retrieve a room.

**Parameters**:
- `wingId` (string, required) - Parent wing ID
- `roomId` (string, required) - Room identifier

---

### room.list
List all rooms in a wing.

**Parameters**:
- `wingId` (string, required) - Parent wing ID

---

### room.delete
Delete a room.

**Parameters**:
- `wingId` (string, required) - Parent wing ID
- `roomId` (string, required) - Room identifier

---

## Closet Operations (3 Tools)

### closet.create
Create a compressed storage closet.

**Parameters**:
- `wingId` (string, required) - Parent wing ID
- `roomId` (string, required) - Parent room ID
- `content` (string, required) - Content to compress
- `metadata` (object, optional) - Metadata

**Returns**:
```json
{
  "closetId": "closet-1",
  "originalSize": 1024,
  "compressedSize": 34,
  "ratio": "0.03"
}
```

---

### closet.get
Retrieve and decompress a closet.

**Parameters**:
- `wingId` (string, required)
- `roomId` (string, required)
- `closetId` (string, required)

---

### closet.compress
Test compression on content.

**Parameters**:
- `content` (string, required) - Content to compress

**Returns**:
```json
{
  "originalSize": 1024,
  "compressedSize": 34,
  "ratio": "0.03",
  "lossless": true
}
```

---

## Drawer Operations (3 Tools)

### drawer.create
Create verbatim storage drawer.

**Parameters**:
- `wingId` (string, required)
- `roomId` (string, required)
- `closetId` (string, required)
- `content` (string, required)
- `tags` (array, optional)

---

### drawer.get
Retrieve drawer content.

**Parameters**:
- `wingId` (string, required)
- `roomId` (string, required)
- `closetId` (string, required)
- `drawerId` (string, required)

---

### drawer.update
Update drawer content.

**Parameters**:
- `wingId` (string, required)
- `roomId` (string, required)
- `closetId` (string, required)
- `drawerId` (string, required)
- `content` (string, required)
- `tags` (array, optional)

---

## Knowledge Graph Operations (5 Tools)

### kg.addTriple
Add a temporal entity-relationship triple.

**Parameters**:
- `entity1` (string, required) - First entity
- `relationship` (string, required) - Relationship type
- `entity2` (string, required) - Second entity
- `confidence` (number, optional, default: 1.0) - Confidence score (0-1)
- `source` (string, optional) - Source of the triple

**Returns**:
```json
{
  "tripleId": "triple-123",
  "entity1": "concept-A",
  "relationship": "causes",
  "entity2": "concept-B"
}
```

---

### kg.query
Query relationships for an entity.

**Parameters**:
- `entity` (string, required) - Entity to query
- `queryType` (string, optional) - "outgoing" or "incoming"

**Returns**:
```json
{
  "entity": "concept-A",
  "queryType": "outgoing",
  "results": 5,
  "data": [...]
}
```

---

### kg.infer
Generate transitive inferences.

**Parameters**:
- `entity` (string, required) - Starting entity
- `relationship` (string, required) - Relationship to follow
- `depth` (number, optional, default: 2) - Inference depth

**Returns**:
```json
{
  "entity": "concept-A",
  "relationship": "causes",
  "depth": 2,
  "inferred": 3,
  "data": [...]
}
```

---

### kg.timeline
Get temporal sequence of events.

**Parameters**:
- `entity` (string, required) - Entity to get timeline for

**Returns**:
```json
{
  "entity": "event-X",
  "events": 5,
  "timeline": [...]
}
```

---

### kg.stats
Get knowledge graph statistics.

**Returns**:
```json
{
  "totalTriples": 8432,
  "totalEntities": 2156,
  "totalRelationships": 47,
  "averageConfidence": 0.82,
  "queriesProcessed": 15234
}
```

---

## Agent Operations (3 Tools)

### agent.create
Create a new agent.

**Parameters**:
- `agentId` (string, required) - Agent identifier
- `name` (string, required) - Agent name
- `description` (string, optional) - Agent description

**Returns**:
```json
{
  "agentId": "agent-1",
  "wingId": "agent-wing-1",
  "status": "created"
}
```

---

### agent.diary
Add entry to agent diary.

**Parameters**:
- `agentId` (string, required) - Agent identifier
- `wingId` (string, required) - Agent's wing ID
- `entry` (string, required) - Diary entry content
- `tags` (array, optional) - Entry tags

**Returns**:
```json
{
  "agentId": "agent-1",
  "entrySize": 256,
  "tags": ["learning", "important"]
}
```

---

### agent.communicate
Record inter-agent communication.

**Parameters**:
- `fromAgent` (string, required) - Sender agent ID
- `toAgent` (string, required) - Receiver agent ID
- `message` (string, required) - Message content

**Returns**:
```json
{
  "tripleId": "triple-456",
  "from": "agent-1",
  "to": "agent-2",
  "messageSize": 128
}
```

---

## Search & Navigation (3 Tools)

### search.global
Full-text search across the palace.

**Parameters**:
- `query` (string, required) - Search query
- `limit` (number, optional, default: 10) - Result limit

**Returns**:
```json
{
  "query": "learning",
  "found": 42,
  "results": [...]
}
```

---

### search.semantic
Semantic search using knowledge graph.

**Parameters**:
- `query` (string, required) - Semantic query
- `minSimilarity` (number, optional, default: 0.6) - Minimum similarity

**Returns**:
```json
{
  "query": "learning",
  "semantic": true,
  "found": 28,
  "results": [...]
}
```

---

### tunnel.navigate
Navigate between wings through tunnels.

**Parameters**:
- `fromWingId` (string, required) - Starting wing
- `toWingId` (string, required) - Destination wing
- `path` (array, optional) - Current path

**Returns**:
```json
{
  "from": "semantic-wing",
  "to": "episodic-wing",
  "tunnel": "tunnel-123",
  "path": ["semantic-wing", "episodic-wing"]
}
```

---

## System Operations (3 Tools)

### system.export
Export entire palace state.

**Returns**:
```json
{
  "wings": {...},
  "knowledgeGraph": {...},
  "agents": {...},
  "timestamp": 1716000000000
}
```

---

### system.stats
Get comprehensive system statistics.

**Returns**:
```json
{
  "wingManager": {...},
  "knowledgeGraph": {...},
  "requestsProcessed": 15234,
  "capabilities": {...},
  "timestamp": 1716000000000
}
```

---

### system.health
Perform health check.

**Returns**:
```json
{
  "status": "healthy",
  "components": {
    "wingManager": "operational",
    "knowledgeGraph": "operational",
    "compressor": "operational"
  },
  "stats": {...},
  "timestamp": 1716000000000
}
```

---

## Error Handling

All tools return errors in the following format:

```json
{
  "success": false,
  "tool": "wing.create",
  "error": "Wing not found: semantic-wing-1",
  "timestamp": 1716000000000
}
```

---

## Rate Limiting

- Default: 100 concurrent requests
- Timeout: 30 seconds per request
- Batch size: 100 operations

---

## Best Practices

1. **Always check success flag** before accessing results
2. **Use confidence scores** for probabilistic reasoning
3. **Batch operations** when possible
4. **Monitor system stats** regularly
5. **Use semantic search** for complex queries
6. **Create backups** before major operations

---

**Version**: 1.0.0-memory-palace | **Status**: ✅ OPERATIONAL
