/**
 * ZDOS Brain Wing Manager
 * Gestisce la struttura gerarchica: Wings → Rooms → Closets → Drawers
 * Con AAAK compression e Knowledge Graph integration
 */

import { MemoryPalace, Wing, Room } from './memory-palace.js';
import { AAKCompressor } from './aaak-compressor.js';

class WingManager {
  constructor() {
    this.palace = new MemoryPalace();
    this.compressor = new AAKCompressor();
    this.palace.initializeWings();
    this.stats = {
      totalOperations: 0,
      totalDrawersCreated: 0,
      totalClosetsCreated: 0,
      compressionRatio: 0
    };
  }

  // ========== WING OPERATIONS ==========

  createWing(wingName, wingType) {
    const wing = this.palace.addWing(wingName, wingType);
    return {
      success: true,
      wing: {
        name: wing.name,
        type: wing.type,
        created: wing.metadata.created
      }
    };
  }

  getWing(wingName) {
    const wing = this.palace.wings.get(wingName);
    if (!wing) return { success: false, error: 'Wing not found' };
    
    return {
      success: true,
      wing: {
        name: wing.name,
        type: wing.type,
        rooms: wing.rooms.size,
        halls: wing.halls.size,
        stats: wing.getStats()
      }
    };
  }

  // ========== ROOM OPERATIONS ==========

  createRoom(wingName, roomName, topic) {
    const wing = this.palace.wings.get(wingName);
    if (!wing) return { success: false, error: 'Wing not found' };

    const room = wing.addRoom(roomName, topic);
    this.stats.totalOperations++;

    return {
      success: true,
      room: {
        name: room.name,
        topic: room.topic,
        created: room.metadata.created
      }
    };
  }

  getRoom(wingName, roomName) {
    const wing = this.palace.wings.get(wingName);
    if (!wing) return { success: false, error: 'Wing not found' };

    const room = wing.getRoom(roomName);
    if (!room) return { success: false, error: 'Room not found' };

    return {
      success: true,
      room: {
        name: room.name,
        topic: room.topic,
        closets: room.closets.size,
        drawers: room.drawers.size,
        size: room.getSize()
      }
    };
  }

  // ========== CLOSET OPERATIONS (COMPRESSED) ==========

  createCloset(wingName, roomName, closetId, content) {
    const wing = this.palace.wings.get(wingName);
    if (!wing) return { success: false, error: 'Wing not found' };

    const room = wing.getRoom(roomName);
    if (!room) return { success: false, error: 'Room not found' };

    // Compress content using AAAK
    const compressed = this.compressor.compress(content);
    
    const closet = room.addCloset(closetId, compressed.compressed);
    this.stats.totalClosetsCreated++;
    this.stats.totalOperations++;

    return {
      success: true,
      closet: {
        id: closet.id,
        created: closet.created,
        compression: {
          originalSize: compressed.original.length,
          compressedSize: compressed.compressed.length,
          ratio: compressed.ratio,
          savedBytes: compressed.savedBytes
        }
      }
    };
  }

  getCloset(wingName, roomName, closetId) {
    const wing = this.palace.wings.get(wingName);
    if (!wing) return { success: false, error: 'Wing not found' };

    const room = wing.getRoom(roomName);
    if (!room) return { success: false, error: 'Room not found' };

    const closet = room.closets.get(closetId);
    if (!closet) return { success: false, error: 'Closet not found' };

    return {
      success: true,
      closet: {
        id: closet.id,
        drawers: closet.drawers.length,
        created: closet.created
      }
    };
  }

  // ========== DRAWER OPERATIONS (VERBATIM) ==========

  createDrawer(wingName, roomName, drawerId, verbatimContent, closetId = null) {
    const wing = this.palace.wings.get(wingName);
    if (!wing) return { success: false, error: 'Wing not found' };

    const room = wing.getRoom(roomName);
    if (!room) return { success: false, error: 'Room not found' };

    const drawer = room.addDrawer(drawerId, verbatimContent, closetId);
    this.stats.totalDrawersCreated++;
    this.stats.totalOperations++;

    return {
      success: true,
      drawer: {
        id: drawer.id,
        created: drawer.created,
        size: drawer.size,
        closetId: drawer.closetId
      }
    };
  }

  getDrawer(wingName, roomName, drawerId) {
    const wing = this.palace.wings.get(wingName);
    if (!wing) return { success: false, error: 'Wing not found' };

    const room = wing.getRoom(roomName);
    if (!room) return { success: false, error: 'Room not found' };

    const drawer = room.drawers.get(drawerId);
    if (!drawer) return { success: false, error: 'Drawer not found' };

    return {
      success: true,
      drawer: {
        id: drawer.id,
        content: drawer.content,
        size: drawer.size,
        created: drawer.created,
        closetId: drawer.closetId
      }
    };
  }

  // ========== HALL OPERATIONS (INTRA-WING CONNECTIONS) ==========

  createHall(wingName, hallName, connectedRooms) {
    const wing = this.palace.wings.get(wingName);
    if (!wing) return { success: false, error: 'Wing not found' };

    wing.addHall(hallName, connectedRooms);
    this.stats.totalOperations++;

    return {
      success: true,
      hall: {
        name: hallName,
        rooms: connectedRooms.length
      }
    };
  }

  // ========== TUNNEL OPERATIONS (CROSS-WING REFERENCES) ==========

  createTunnel(tunnelName, sourceWing, targetWing, metadata = {}) {
    const tunnel = this.palace.addTunnel(tunnelName, sourceWing, targetWing, metadata);
    this.stats.totalOperations++;

    return {
      success: true,
      tunnel: {
        name: tunnel.name,
        from: tunnel.from,
        to: tunnel.to,
        created: tunnel.created
      }
    };
  }

  getTunnels(sourceWing = null) {
    const tunnels = [];
    for (const tunnel of this.palace.tunnels.values()) {
      if (!sourceWing || tunnel.from === sourceWing) {
        tunnels.push({
          name: tunnel.name,
          from: tunnel.from,
          to: tunnel.to
        });
      }
    }
    return { success: true, tunnels };
  }

  // ========== KNOWLEDGE GRAPH OPERATIONS ==========

  addTriple(entity1, relationship, entity2, confidence = 1.0) {
    const tripleId = this.palace.addTriple(entity1, relationship, entity2, Date.now(), confidence);
    this.stats.totalOperations++;

    return {
      success: true,
      triple: {
        id: tripleId,
        entity1,
        relationship,
        entity2,
        confidence,
        timestamp: Date.now()
      }
    };
  }

  queryTriples(query) {
    const results = [];
    for (const [tripleId, triple] of this.palace.knowledgeGraph.entries()) {
      if (tripleId.includes(query) || triple.entity1.includes(query) || 
          triple.entity2.includes(query)) {
        results.push({
          id: tripleId,
          ...triple
        });
      }
    }
    return { success: true, results };
  }

  // ========== AGENT OPERATIONS ==========

  createAgentWing(agentName) {
    const wing = this.palace.createAgentWing(agentName);
    this.stats.totalOperations++;

    return {
      success: true,
      agent: {
        name: agentName,
        wing: wing.name,
        created: Date.now()
      }
    };
  }

  addAgentDiaryEntry(agentName, entry) {
    this.palace.addToDiary(agentName, entry);
    this.stats.totalOperations++;

    return {
      success: true,
      entry: {
        timestamp: Date.now(),
        entry
      }
    };
  }

  getAgentDiary(agentName) {
    const diary = this.palace.getAgentDiary(agentName);
    return {
      success: true,
      diary,
      entries: diary.length
    };
  }

  // ========== SEARCH OPERATIONS ==========

  search(query, scope = 'all') {
    const results = this.palace.search(query, scope);
    this.stats.totalOperations++;

    return {
      success: true,
      query,
      results,
      count: results.length
    };
  }

  // ========== STATISTICS & EXPORT ==========

  getStats() {
    const palaceStats = this.palace.getStats();
    const compressorStats = this.compressor.getStats();

    return {
      palace: palaceStats,
      compressor: compressorStats,
      manager: this.stats,
      timestamp: Date.now()
    };
  }

  exportPalace() {
    return {
      success: true,
      palace: this.palace.export(),
      stats: this.getStats()
    };
  }

  // ========== UTILITY OPERATIONS ==========

  listWings() {
    const wings = [];
    for (const wing of this.palace.wings.values()) {
      wings.push({
        name: wing.name,
        type: wing.type,
        rooms: wing.rooms.size,
        stats: wing.getStats()
      });
    }
    return { success: true, wings };
  }

  listRooms(wingName) {
    const wing = this.palace.wings.get(wingName);
    if (!wing) return { success: false, error: 'Wing not found' };

    const rooms = [];
    for (const room of wing.rooms.values()) {
      rooms.push({
        name: room.name,
        topic: room.topic,
        closets: room.closets.size,
        drawers: room.drawers.size,
        size: room.getSize()
      });
    }
    return { success: true, rooms };
  }

  getMemoryStats() {
    return {
      wings: this.palace.wings.size,
      totalRooms: Array.from(this.palace.wings.values()).reduce((sum, w) => sum + w.rooms.size, 0),
      totalDrawers: this.stats.totalDrawersCreated,
      totalClosets: this.stats.totalClosetsCreated,
      totalSize: Array.from(this.palace.wings.values()).reduce((sum, w) => sum + Array.from(w.rooms.values()).reduce((rs, r) => rs + r.getSize(), 0), 0),
      tunnels: this.palace.tunnels.size,
      triples: this.palace.knowledgeGraph.size,
      agents: this.palace.agents.size,
      operations: this.stats.totalOperations
    };
  }
}

export { WingManager };
