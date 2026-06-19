/**
 * ZDOS Brain Memory Palace
 * Hierarchical memory architecture inspired by MemPalace
 * Wings → Rooms → Closets (AAAK) → Drawers (Verbatim)
 * + Knowledge Graph + Tunnels + MCP Server
 */

class Wing {
  constructor(name, type) {
    this.name = name;
    this.type = type; // 'agi', 'brain', 'blockchain', 'tor', 'identity', 'communication'
    this.rooms = new Map();
    this.halls = new Map(); // Intra-wing connections
    this.metadata = {
      created: Date.now(),
      lastAccessed: Date.now(),
      accessCount: 0,
      size: 0
    };
  }

  addRoom(roomName, topic) {
    if (!this.rooms.has(roomName)) {
      this.rooms.set(roomName, new Room(roomName, topic));
    }
    return this.rooms.get(roomName);
  }

  getRoom(roomName) {
    return this.rooms.get(roomName);
  }

  addHall(hallName, connectedRooms) {
    this.halls.set(hallName, {
      name: hallName,
      rooms: connectedRooms,
      created: Date.now()
    });
  }

  getStats() {
    let totalDrawers = 0;
    let totalSize = 0;
    for (const room of this.rooms.values()) {
      totalDrawers += room.closets.size;
      totalSize += room.getSize();
    }
    return {
      wing: this.name,
      type: this.type,
      rooms: this.rooms.size,
      drawers: totalDrawers,
      size: totalSize,
      halls: this.halls.size
    };
  }
}

class Room {
  constructor(name, topic) {
    this.name = name;
    this.topic = topic;
    this.closets = new Map(); // Compressed content
    this.drawers = new Map(); // Verbatim content
    this.metadata = {
      created: Date.now(),
      lastModified: Date.now(),
      accessCount: 0
    };
  }

  addCloset(closetId, compressedContent) {
    const closet = {
      id: closetId,
      content: compressedContent, // AAAK compressed
      created: Date.now(),
      drawers: []
    };
    this.closets.set(closetId, closet);
    return closet;
  }

  addDrawer(drawerId, verbatimContent, closetId) {
    const drawer = {
      id: drawerId,
      content: verbatimContent, // Full verbatim text
      created: Date.now(),
      closetId: closetId,
      size: verbatimContent.length
    };
    this.drawers.set(drawerId, drawer);
    
    // Link drawer to closet
    if (closetId && this.closets.has(closetId)) {
      this.closets.get(closetId).drawers.push(drawerId);
    }
    
    return drawer;
  }

  getSize() {
    let size = 0;
    for (const drawer of this.drawers.values()) {
      size += drawer.size;
    }
    return size;
  }
}

class MemoryPalace {
  constructor() {
    this.wings = new Map();
    this.tunnels = new Map(); // Cross-wing references
    this.knowledgeGraph = new Map(); // Temporal entity-relationship
    this.agents = new Map(); // Agent-specific wings
    this.metadata = {
      created: Date.now(),
      totalAccess: 0,
      totalSize: 0
    };
  }

  // Initialize standard wings
  initializeWings() {
    this.addWing('agi', 'agi');
    this.addWing('brain', 'brain');
    this.addWing('blockchain', 'blockchain');
    this.addWing('tor', 'tor');
    this.addWing('identity', 'identity');
    this.addWing('communication', 'communication');
  }

  addWing(wingName, wingType) {
    if (!this.wings.has(wingName)) {
      this.wings.set(wingName, new Wing(wingName, wingType));
    }
    return this.wings.get(wingName);
  }

  // Add cross-wing tunnel (reference)
  addTunnel(tunnelName, sourceWing, targetWing, metadata = {}) {
    const tunnel = {
      name: tunnelName,
      from: sourceWing,
      to: targetWing,
      created: Date.now(),
      metadata
    };
    this.tunnels.set(tunnelName, tunnel);
    return tunnel;
  }

  // Knowledge Graph: Temporal entity-relationship triples
  addTriple(entity1, relationship, entity2, timestamp = Date.now(), confidence = 1.0) {
    const tripleId = `${entity1}:${relationship}:${entity2}`;
    this.knowledgeGraph.set(tripleId, {
      entity1,
      relationship,
      entity2,
      timestamp,
      confidence,
      validity: { start: timestamp, end: null }
    });
    return tripleId;
  }

  // Create agent-specific wing
  createAgentWing(agentName) {
    const agentWing = this.addWing(`agent_${agentName}`, 'agent');
    this.agents.set(agentName, {
      name: agentName,
      wing: agentWing,
      diary: [],
      created: Date.now()
    });
    return agentWing;
  }

  // Get agent diary
  getAgentDiary(agentName) {
    return this.agents.get(agentName)?.diary || [];
  }

  // Add to agent diary
  addToDiary(agentName, entry) {
    if (this.agents.has(agentName)) {
      this.agents.get(agentName).diary.push({
        timestamp: Date.now(),
        entry
      });
    }
  }

  // Search across palace
  search(query, scope = 'all') {
    const results = [];
    
    if (scope === 'all' || scope === 'drawers') {
      for (const wing of this.wings.values()) {
        for (const room of wing.rooms.values()) {
          for (const drawer of room.drawers.values()) {
            if (drawer.content.includes(query)) {
              results.push({
                type: 'drawer',
                wing: wing.name,
                room: room.name,
                drawer: drawer.id,
                content: drawer.content.substring(0, 200)
              });
            }
          }
        }
      }
    }

    if (scope === 'all' || scope === 'graph') {
      for (const [tripleId, triple] of this.knowledgeGraph.entries()) {
        if (tripleId.includes(query) || triple.entity1.includes(query) || 
            triple.entity2.includes(query) || triple.relationship.includes(query)) {
          results.push({
            type: 'triple',
            triple: tripleId,
            data: triple
          });
        }
      }
    }

    return results;
  }

  // Get palace statistics
  getStats() {
    const stats = {
      wings: {},
      totalRooms: 0,
      totalDrawers: 0,
      totalSize: 0,
      tunnels: this.tunnels.size,
      triples: this.knowledgeGraph.size,
      agents: this.agents.size
    };

    for (const wing of this.wings.values()) {
      const wingStats = wing.getStats();
      stats.wings[wing.name] = wingStats;
      stats.totalRooms += wing.rooms.size;
      stats.totalDrawers += wingStats.drawers;
      stats.totalSize += wingStats.size;
    }

    return stats;
  }

  // Export palace structure
  export() {
    const exported = {
      metadata: this.metadata,
      wings: {},
      tunnels: Array.from(this.tunnels.values()),
      knowledgeGraph: Array.from(this.knowledgeGraph.entries()),
      agents: Array.from(this.agents.entries())
    };

    for (const [wingName, wing] of this.wings.entries()) {
      exported.wings[wingName] = {
        type: wing.type,
        rooms: Array.from(wing.rooms.entries()).map(([roomName, room]) => ({
          name: roomName,
          topic: room.topic,
          closets: room.closets.size,
          drawers: room.drawers.size,
          size: room.getSize()
        })),
        halls: Array.from(wing.halls.values())
      };
    }

    return exported;
  }
}

export { MemoryPalace, Wing, Room };
