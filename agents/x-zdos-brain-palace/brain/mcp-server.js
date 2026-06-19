/**
 * ZDOS Brain MCP Server
 * Model Context Protocol Server con 29+ tools per Memory Palace
 * Interfaccia standardizzata per interazione con il sistema neuromorfico
 */

import { WingManager } from './wing-manager.js';
import { AAKCompressor } from './aaak-compressor.js';
import { KnowledgeGraph } from './knowledge-graph.js';

class MCPServer {
  constructor() {
    this.wingManager = new WingManager();
    this.compressor = new AAKCompressor();
    this.knowledgeGraph = new KnowledgeGraph();
    this.tools = new Map();
    this.requestLog = [];
    this.capabilities = {
      memory: true,
      reasoning: true,
      learning: true,
      multiAgent: true
    };
    this.initializeTools();
  }

  initializeTools() {
    // ========== WING OPERATIONS (5 tools) ==========
    this.registerTool('wing.create', this.toolWingCreate.bind(this));
    this.registerTool('wing.get', this.toolWingGet.bind(this));
    this.registerTool('wing.list', this.toolWingList.bind(this));
    this.registerTool('wing.delete', this.toolWingDelete.bind(this));
    this.registerTool('wing.stats', this.toolWingStats.bind(this));

    // ========== ROOM OPERATIONS (4 tools) ==========
    this.registerTool('room.create', this.toolRoomCreate.bind(this));
    this.registerTool('room.get', this.toolRoomGet.bind(this));
    this.registerTool('room.list', this.toolRoomList.bind(this));
    this.registerTool('room.delete', this.toolRoomDelete.bind(this));

    // ========== CLOSET OPERATIONS (3 tools) ==========
    this.registerTool('closet.create', this.toolClosetCreate.bind(this));
    this.registerTool('closet.get', this.toolClosetGet.bind(this));
    this.registerTool('closet.compress', this.toolClosetCompress.bind(this));

    // ========== DRAWER OPERATIONS (3 tools) ==========
    this.registerTool('drawer.create', this.toolDrawerCreate.bind(this));
    this.registerTool('drawer.get', this.toolDrawerGet.bind(this));
    this.registerTool('drawer.update', this.toolDrawerUpdate.bind(this));

    // ========== KNOWLEDGE GRAPH (5 tools) ==========
    this.registerTool('kg.addTriple', this.toolKGAddTriple.bind(this));
    this.registerTool('kg.query', this.toolKGQuery.bind(this));
    this.registerTool('kg.infer', this.toolKGInfer.bind(this));
    this.registerTool('kg.timeline', this.toolKGTimeline.bind(this));
    this.registerTool('kg.stats', this.toolKGStats.bind(this));

    // ========== AGENT OPERATIONS (3 tools) ==========
    this.registerTool('agent.create', this.toolAgentCreate.bind(this));
    this.registerTool('agent.diary', this.toolAgentDiary.bind(this));
    this.registerTool('agent.communicate', this.toolAgentCommunicate.bind(this));

    // ========== SEARCH & NAVIGATION (3 tools) ==========
    this.registerTool('search.global', this.toolSearchGlobal.bind(this));
    this.registerTool('search.semantic', this.toolSearchSemantic.bind(this));
    this.registerTool('tunnel.navigate', this.toolTunnelNavigate.bind(this));

    // ========== SYSTEM OPERATIONS (3 tools) ==========
    this.registerTool('system.export', this.toolSystemExport.bind(this));
    this.registerTool('system.stats', this.toolSystemStats.bind(this));
    this.registerTool('system.health', this.toolSystemHealth.bind(this));
  }

  registerTool(name, handler) {
    this.tools.set(name, handler);
  }

  async callTool(toolName, params = {}) {
    const handler = this.tools.get(toolName);
    if (!handler) {
      throw new Error(`Tool not found: ${toolName}`);
    }

    const request = {
      tool: toolName,
      params,
      timestamp: Date.now()
    };

    this.requestLog.push(request);

    try {
      const result = await handler(params);
      return {
        success: true,
        tool: toolName,
        result,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        success: false,
        tool: toolName,
        error: error.message,
        timestamp: Date.now()
      };
    }
  }

  // ========== WING TOOLS ==========

  async toolWingCreate({ name, description = '', metadata = {} }) {
    const wing = this.wingManager.createWing(name, description, metadata);
    return { wingId: wing.id, name: wing.name };
  }

  async toolWingGet({ wingId }) {
    const wing = this.wingManager.getWing(wingId);
    if (!wing) throw new Error(`Wing not found: ${wingId}`);
    return wing;
  }

  async toolWingList() {
    return this.wingManager.listWings();
  }

  async toolWingDelete({ wingId }) {
    this.wingManager.wings.delete(wingId);
    return { deleted: wingId };
  }

  async toolWingStats({ wingId }) {
    const wing = this.wingManager.getWing(wingId);
    if (!wing) throw new Error(`Wing not found: ${wingId}`);
    return {
      wingId,
      rooms: wing.rooms.size,
      totalClosets: Array.from(wing.rooms.values()).reduce((sum, r) => sum + r.closets.size, 0),
      totalDrawers: Array.from(wing.rooms.values()).reduce((sum, r) => sum + Array.from(r.closets.values()).reduce((s, c) => s + c.drawers.size, 0), 0)
    };
  }

  // ========== ROOM TOOLS ==========

  async toolRoomCreate({ wingId, name, description = '' }) {
    const room = this.wingManager.createRoom(wingId, name, description);
    return { roomId: room.id, name: room.name };
  }

  async toolRoomGet({ wingId, roomId }) {
    const room = this.wingManager.getRoom(wingId, roomId);
    if (!room) throw new Error(`Room not found: ${roomId}`);
    return room;
  }

  async toolRoomList({ wingId }) {
    return this.wingManager.listRooms(wingId);
  }

  async toolRoomDelete({ wingId, roomId }) {
    const wing = this.wingManager.getWing(wingId);
    if (!wing) throw new Error(`Wing not found: ${wingId}`);
    wing.rooms.delete(roomId);
    return { deleted: roomId };
  }

  // ========== CLOSET TOOLS ==========

  async toolClosetCreate({ wingId, roomId, content, metadata = {} }) {
    const compressed = this.compressor.compress(content);
    const closet = this.wingManager.createCloset(wingId, roomId, compressed, metadata);
    return {
      closetId: closet.id,
      originalSize: content.length,
      compressedSize: compressed.length,
      ratio: (compressed.length / content.length).toFixed(2)
    };
  }

  async toolClosetGet({ wingId, roomId, closetId }) {
    const closet = this.wingManager.getCloset(wingId, roomId, closetId);
    if (!closet) throw new Error(`Closet not found: ${closetId}`);
    const decompressed = this.compressor.decompress(closet.content);
    return { closetId, content: decompressed, metadata: closet.metadata };
  }

  async toolClosetCompress({ content }) {
    const compressed = this.compressor.compress(content);
    const decompressed = this.compressor.decompress(compressed);
    return {
      originalSize: content.length,
      compressedSize: compressed.length,
      ratio: (compressed.length / content.length).toFixed(2),
      lossless: content === decompressed
    };
  }

  // ========== DRAWER TOOLS ==========

  async toolDrawerCreate({ wingId, roomId, closetId, content, tags = [] }) {
    const drawer = this.wingManager.createDrawer(wingId, roomId, closetId, content, tags);
    return { drawerId: drawer.id, size: content.length, tags };
  }

  async toolDrawerGet({ wingId, roomId, closetId, drawerId }) {
    const drawer = this.wingManager.getDrawer(wingId, roomId, closetId, drawerId);
    if (!drawer) throw new Error(`Drawer not found: ${drawerId}`);
    return drawer;
  }

  async toolDrawerUpdate({ wingId, roomId, closetId, drawerId, content, tags = [] }) {
    const drawer = this.wingManager.getDrawer(wingId, roomId, closetId, drawerId);
    if (!drawer) throw new Error(`Drawer not found: ${drawerId}`);
    drawer.content = content;
    drawer.tags = tags;
    drawer.updatedAt = Date.now();
    return { updated: drawerId, size: content.length };
  }

  // ========== KNOWLEDGE GRAPH TOOLS ==========

  async toolKGAddTriple({ entity1, relationship, entity2, confidence = 1.0, source = null }) {
    const tripleId = this.knowledgeGraph.addTriple(entity1, relationship, entity2, Date.now(), confidence, source);
    return { tripleId, entity1, relationship, entity2 };
  }

  async toolKGQuery({ entity, queryType = 'outgoing' }) {
    let results;
    if (queryType === 'outgoing') {
      results = this.knowledgeGraph.queryByEntity1(entity);
    } else if (queryType === 'incoming') {
      results = this.knowledgeGraph.queryByEntity2(entity);
    } else {
      throw new Error(`Unknown query type: ${queryType}`);
    }
    return { entity, queryType, results: results.length, data: results };
  }

  async toolKGInfer({ entity, relationship, depth = 2 }) {
    const results = this.knowledgeGraph.queryTransitive(entity, relationship, depth);
    return { entity, relationship, depth, inferred: results.length, data: results };
  }

  async toolKGTimeline({ entity }) {
    const timeline = this.knowledgeGraph.queryTimeline(entity);
    return { entity, events: timeline.length, timeline };
  }

  async toolKGStats() {
    return this.knowledgeGraph.getStats();
  }

  // ========== AGENT TOOLS ==========

  async toolAgentCreate({ agentId, name, description = '' }) {
    const wing = this.wingManager.createWing(`agent-${agentId}`, name, {
      type: 'agent',
      agentId,
      description
    });
    return { agentId, wingId: wing.id, status: 'created' };
  }

  async toolAgentDiary({ agentId, wingId, entry, tags = [] }) {
    this.wingManager.addAgentDiaryEntry(wingId, agentId, entry, tags);
    return { agentId, entrySize: entry.length, tags };
  }

  async toolAgentCommunicate({ fromAgent, toAgent, message }) {
    const tripleId = this.knowledgeGraph.addTriple(
      `agent:${fromAgent}`,
      'communicates_with',
      `agent:${toAgent}`,
      Date.now(),
      1.0,
      'agent-communication'
    );
    return { tripleId, from: fromAgent, to: toAgent, messageSize: message.length };
  }

  // ========== SEARCH TOOLS ==========

  async toolSearchGlobal({ query, limit = 10 }) {
    const results = this.wingManager.search(query);
    return {
      query,
      found: results.length,
      results: results.slice(0, limit)
    };
  }

  async toolSearchSemantic({ query, minSimilarity = 0.6 }) {
    // Semantic search using knowledge graph
    const results = this.knowledgeGraph.queryPattern(query, null, null);
    return {
      query,
      semantic: true,
      found: results.length,
      results
    };
  }

  async toolTunnelNavigate({ fromWingId, toWingId, path = [] }) {
    const tunnels = this.wingManager.getTunnels(fromWingId);
    const targetTunnel = tunnels.find(t => t.targetWingId === toWingId);
    return {
      from: fromWingId,
      to: toWingId,
      tunnel: targetTunnel ? targetTunnel.id : null,
      path: [...path, toWingId]
    };
  }

  // ========== SYSTEM TOOLS ==========

  async toolSystemExport() {
    return {
      wings: this.wingManager.exportPalace(),
      knowledgeGraph: this.knowledgeGraph.export(),
      timestamp: Date.now()
    };
  }

  async toolSystemStats() {
    return {
      wingManager: this.wingManager.getMemoryStats(),
      knowledgeGraph: this.knowledgeGraph.getStats(),
      requestsProcessed: this.requestLog.length,
      capabilities: this.capabilities,
      timestamp: Date.now()
    };
  }

  async toolSystemHealth() {
    const stats = await this.toolSystemStats();
    return {
      status: 'healthy',
      components: {
        wingManager: 'operational',
        knowledgeGraph: 'operational',
        compressor: 'operational'
      },
      stats,
      timestamp: Date.now()
    };
  }

  // ========== UTILITY METHODS ==========

  listTools() {
    return Array.from(this.tools.keys()).map(name => ({
      name,
      category: name.split('.')[0]
    }));
  }

  getToolsByCategory(category) {
    return Array.from(this.tools.keys()).filter(name => name.startsWith(category));
  }

  getRequestLog(limit = 100) {
    return this.requestLog.slice(-limit);
  }
}

export { MCPServer };
