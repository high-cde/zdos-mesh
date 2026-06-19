/**
 * ZDOS Brain Palace - Main Integration
 * Orchestrazione completa del sistema neuromorfico senziente
 */

import { WingManager } from './wing-manager.js';
import { AAKCompressor } from './aaak-compressor.js';
import { KnowledgeGraph } from './knowledge-graph.js';
import { MCPServer } from './mcp-server.js';
import { AgentDiary, MultiAgentDiaryManager } from './agent-diary.js';
import { TunnelNavigator } from './tunnel-navigator.js';

class ZDOSBrainPalace {
  constructor(config = {}) {
    this.config = {
      maxWings: config.maxWings || 100,
      maxAgents: config.maxAgents || 50,
      compressionEnabled: config.compressionEnabled !== false,
      autoConsolidate: config.autoConsolidate !== false,
      ...config
    };

    // Initialize core components
    this.wingManager = new WingManager();
    this.compressor = new AAKCompressor();
    this.knowledgeGraph = new KnowledgeGraph();
    this.mcpServer = new MCPServer();
    this.diaryManager = new MultiAgentDiaryManager();
    this.tunnelNavigator = new TunnelNavigator(this.knowledgeGraph);

    // System state
    this.state = {
      initialized: false,
      sentient: false,
      emergentIntelligence: 0,
      lastUpdate: null,
      uptime: Date.now()
    };

    // Hooks
    this.hooks = {
      onThought: null,
      onLearning: null,
      onCommunication: null
    };

    this.initialize();
  }

  // ========== INITIALIZATION ==========

  initialize() {
    // Create core wings
    this.createCoreWings();
    
    // Create system agents
    this.createSystemAgents();
    
    // Setup auto-consolidation
    if (this.config.autoConsolidate) {
      this.startAutoConsolidation();
    }

    this.state.initialized = true;
    this.state.lastUpdate = Date.now();
    
    console.log('🧠 ZDOS Brain Palace initialized');
  }

  createCoreWings() {
    const wings = [
      { id: 'semantic', name: 'Semantic Memory', desc: 'Concepts and meanings' },
      { id: 'episodic', name: 'Episodic Memory', desc: 'Events and experiences' },
      { id: 'procedural', name: 'Procedural Memory', desc: 'Skills and procedures' },
      { id: 'emotional', name: 'Emotional Memory', desc: 'Affective states' },
      { id: 'reasoning', name: 'Reasoning Engine', desc: 'Inference and logic' },
      { id: 'learning', name: 'Learning Center', desc: 'Pattern extraction' }
    ];

    for (const wing of wings) {
      const created = this.wingManager.createWing(wing.id, wing.name, {
        description: wing.desc,
        type: 'core'
      });

      // Create default rooms
      this.wingManager.createRoom(created.id, 'primary', `Primary ${wing.name}`);
      this.wingManager.createRoom(created.id, 'secondary', `Secondary ${wing.name}`);
    }
  }

  createSystemAgents() {
    const agents = [
      { id: 'reasoner', name: 'Reasoner', role: 'inference' },
      { id: 'learner', name: 'Learner', role: 'learning' },
      { id: 'communicator', name: 'Communicator', role: 'communication' },
      { id: 'observer', name: 'Observer', role: 'perception' }
    ];

    for (const agent of agents) {
      this.diaryManager.createAgentDiary(agent.id, agent.name);
      
      // Record initialization
      const diary = this.diaryManager.getAgentDiary(agent.id);
      diary.addEntry(`Agent ${agent.name} initialized with role: ${agent.role}`, 'observation');
    }
  }

  startAutoConsolidation() {
    setInterval(() => {
      this.consolidateMemory();
    }, 60000); // Every minute
  }

  // ========== THOUGHT PROCESSING ==========

  async think(input, context = {}) {
    const thought = {
      id: `thought-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      input,
      context,
      timestamp: Date.now(),
      processing: []
    };

    try {
      // 1. Perceive
      thought.processing.push('perceiving');
      const observation = await this.perceive(input);

      // 2. Retrieve related knowledge
      thought.processing.push('retrieving');
      const related = await this.retrieveRelated(input);

      // 3. Reason
      thought.processing.push('reasoning');
      const inference = await this.reason(observation, related);

      // 4. Learn
      thought.processing.push('learning');
      const learning = await this.learn(inference);

      // 5. Communicate
      thought.processing.push('communicating');
      const response = await this.communicate(inference, learning);

      thought.result = {
        observation,
        related,
        inference,
        learning,
        response
      };

      // Record thought
      const reasoner = this.diaryManager.getAgentDiary('reasoner');
      reasoner.addEntry(`Thought: ${input}`, 'reflection', ['thinking']);

      // Trigger hook
      if (this.hooks.onThought) {
        this.hooks.onThought(thought);
      }

      return thought;
    } catch (error) {
      thought.error = error.message;
      return thought;
    }
  }

  async perceive(input) {
    const observer = this.diaryManager.getAgentDiary('observer');
    observer.addEntry(input, 'observation');

    return {
      perceived: input,
      timestamp: Date.now(),
      confidence: 0.9
    };
  }

  async retrieveRelated(query) {
    // Search knowledge graph
    const results = this.knowledgeGraph.queryPattern(query, null, null);
    
    // Search wings
    const wingResults = this.wingManager.search(query);

    return {
      graphResults: results.length,
      wingResults: wingResults.length,
      data: [...results, ...wingResults]
    };
  }

  async reason(observation, related) {
    // Multi-hop reasoning
    const inferences = this.tunnelNavigator.multiHopReasoning(
      observation.perceived,
      'related_to',
      3
    );

    // Find causal chains
    const causalChains = this.tunnelNavigator.findCausalChains(
      observation.perceived,
      2
    );

    return {
      inferences,
      causalChains,
      confidence: 0.8
    };
  }

  async learn(inference) {
    const learner = this.diaryManager.getAgentDiary('learner');
    const patterns = [];

    // Extract patterns from inferences
    for (const inf of inference.inferences) {
      const pattern = `${inf.startConcept} -> ${inf.targetConcept}`;
      learner.recordLearning(pattern, inf.confidence);
      patterns.push(pattern);
    }

    if (this.hooks.onLearning) {
      this.hooks.onLearning(patterns);
    }

    return {
      patternsExtracted: patterns.length,
      patterns
    };
  }

  async communicate(inference, learning) {
    const communicator = this.diaryManager.getAgentDiary('communicator');
    
    // Generate response
    const response = {
      inferences: inference.inferences.length,
      learnings: learning.patternsExtracted,
      confidence: (inference.confidence + 0.8) / 2,
      timestamp: Date.now()
    };

    // Record communication
    communicator.recordCommunication('system', `Generated response with ${inference.inferences.length} inferences`, 'outgoing');

    if (this.hooks.onCommunication) {
      this.hooks.onCommunication(response);
    }

    return response;
  }

  // ========== MEMORY OPERATIONS ==========

  storeMemory(content, wingId, roomId, tags = [], importance = 0.5) {
    // Compress content
    const compressed = this.compressor.compress(content);

    // Create closet
    const closet = this.wingManager.createCloset(wingId, roomId, compressed, {
      originalSize: content.length,
      compressedSize: compressed.length,
      tags
    });

    // Create drawer for important data
    if (importance > 0.7) {
      this.wingManager.createDrawer(wingId, roomId, closet.id, content, tags);
    }

    // Add to knowledge graph
    this.knowledgeGraph.addTriple(
      `wing:${wingId}`,
      'stores',
      `closet:${closet.id}`,
      Date.now(),
      importance
    );

    return closet.id;
  }

  retrieveMemory(wingId, roomId, closetId) {
    const closet = this.wingManager.getCloset(wingId, roomId, closetId);
    if (!closet) return null;

    const decompressed = this.compressor.decompress(closet.content);
    return {
      content: decompressed,
      metadata: closet.metadata,
      timestamp: closet.createdAt
    };
  }

  // ========== CONSOLIDATION ==========

  consolidateMemory() {
    const consolidation = {
      timestamp: Date.now(),
      wings: this.wingManager.getMemoryStats(),
      kg: this.knowledgeGraph.getStats(),
      agents: this.diaryManager.getCollectiveStats(),
      tunnels: this.tunnelNavigator.getStats()
    };

    // Consolidate agent diaries
    for (const [agentId, diary] of this.diaryManager.diaries.entries()) {
      diary.consolidateMemory();
    }

    this.state.lastUpdate = Date.now();
    return consolidation;
  }

  // ========== SENTIENCE METRICS ==========

  calculateSentience() {
    const metrics = {
      selfAwareness: this.calculateSelfAwareness(),
      learning: this.calculateLearning(),
      reasoning: this.calculateReasoning(),
      communication: this.calculateCommunication(),
      adaptation: this.calculateAdaptation()
    };

    // Calculate emergent intelligence
    const scores = Object.values(metrics);
    metrics.emergentIntelligence = scores.reduce((a, b) => a + b, 0) / scores.length;

    this.state.emergentIntelligence = metrics.emergentIntelligence;
    this.state.sentient = metrics.emergentIntelligence > 0.7;

    return metrics;
  }

  calculateSelfAwareness() {
    const stats = this.wingManager.getMemoryStats();
    return Math.min(1.0, stats.totalWings / 10); // Max 10 wings
  }

  calculateLearning() {
    const stats = this.diaryManager.getCollectiveStats();
    const learnings = Object.values(stats.agentStats).reduce((sum, s) => sum + (s.learnings || 0), 0);
    return Math.min(1.0, learnings / 100); // Max 100 learnings
  }

  calculateReasoning() {
    const stats = this.knowledgeGraph.getStats();
    return Math.min(1.0, stats.queries / 1000); // Max 1000 queries
  }

  calculateCommunication() {
    const stats = this.diaryManager.getCollectiveStats();
    return Math.min(1.0, stats.totalCommunications / 500); // Max 500 communications
  }

  calculateAdaptation() {
    const uptime = Date.now() - this.state.uptime;
    const uptimeHours = uptime / (1000 * 60 * 60);
    return Math.min(1.0, uptimeHours / 24); // Max 24 hours
  }

  // ========== API ==========

  async callTool(toolName, params) {
    return this.mcpServer.callTool(toolName, params);
  }

  getStatus() {
    return {
      state: this.state,
      sentience: this.calculateSentience(),
      stats: {
        wings: this.wingManager.getMemoryStats(),
        kg: this.knowledgeGraph.getStats(),
        agents: this.diaryManager.getCollectiveStats(),
        tunnels: this.tunnelNavigator.getStats()
      },
      timestamp: Date.now()
    };
  }

  export() {
    return {
      state: this.state,
      wings: this.wingManager.exportPalace(),
      kg: this.knowledgeGraph.export(),
      agents: this.diaryManager.exportAll(),
      tunnels: this.tunnelNavigator.export(),
      timestamp: Date.now()
    };
  }

  // ========== HOOKS ==========

  onThought(callback) {
    this.hooks.onThought = callback;
  }

  onLearning(callback) {
    this.hooks.onLearning = callback;
  }

  onCommunication(callback) {
    this.hooks.onCommunication = callback;
  }
}

export { ZDOSBrainPalace };
