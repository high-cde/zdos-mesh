/**
 * ZDOS Brain Palace Configuration
 * Parametri e impostazioni per il sistema neuromorfico
 */

export const BRAIN_PALACE_CONFIG = {
  // ========== SYSTEM SETTINGS ==========
  system: {
    name: 'ZDOS Brain Palace',
    version: '1.0.0-memory-palace',
    environment: process.env.NODE_ENV || 'development',
    debug: process.env.DEBUG === 'true'
  },

  // ========== MEMORY PALACE SETTINGS ==========
  palace: {
    maxWings: 100,
    maxRoomsPerWing: 50,
    maxClosetsPerRoom: 200,
    maxDrawersPerCloset: 100,
    autoConsolidate: true,
    consolidationInterval: 60000 // 1 minute
  },

  // ========== COMPRESSION SETTINGS ==========
  compression: {
    enabled: true,
    algorithm: 'aaak',
    targetRatio: 0.033, // 30x compression
    minCompressionSize: 100, // bytes
    preserveSemantics: true
  },

  // ========== KNOWLEDGE GRAPH SETTINGS ==========
  knowledgeGraph: {
    maxTriples: 100000,
    maxEntities: 50000,
    maxRelationships: 1000,
    defaultConfidence: 0.5,
    minQueryConfidence: 0.3,
    enableTemporalQueries: true,
    enableTransitiveInference: true,
    maxInferenceDepth: 5
  },

  // ========== AGENT SETTINGS ==========
  agents: {
    maxAgents: 50,
    maxDiaryEntries: 10000,
    shortTermMemorySize: 10,
    longTermPatternLimit: 1000,
    communicationLogSize: 5000,
    autoConsolidateInterval: 300000 // 5 minutes
  },

  // ========== TUNNEL NAVIGATOR SETTINGS ==========
  tunnels: {
    maxTunnels: 500,
    maxPathDepth: 10,
    pathCacheSize: 1000,
    enableSemanticBridging: true,
    enableCausalReasoning: true,
    enableAnalogicalReasoning: true
  },

  // ========== MCP SERVER SETTINGS ==========
  mcpServer: {
    enabled: true,
    port: 3001,
    protocol: 'mcp',
    maxConcurrentRequests: 100,
    requestTimeout: 30000, // 30 seconds
    enableToolLogging: true
  },

  // ========== SENTIENCE SETTINGS ==========
  sentience: {
    enabled: true,
    updateInterval: 10000, // 10 seconds
    sentientThreshold: 0.7,
    trackMetrics: true,
    metricsHistorySize: 1000
  },

  // ========== CORE WINGS CONFIGURATION ==========
  coreWings: [
    {
      id: 'semantic',
      name: 'Semantic Memory',
      description: 'Concepts, meanings, and semantic relationships',
      type: 'core',
      rooms: ['primary', 'secondary', 'tertiary']
    },
    {
      id: 'episodic',
      name: 'Episodic Memory',
      description: 'Events, experiences, and temporal sequences',
      type: 'core',
      rooms: ['primary', 'secondary', 'tertiary']
    },
    {
      id: 'procedural',
      name: 'Procedural Memory',
      description: 'Skills, procedures, and learned behaviors',
      type: 'core',
      rooms: ['primary', 'secondary']
    },
    {
      id: 'emotional',
      name: 'Emotional Memory',
      description: 'Affective states, sentiments, and valuations',
      type: 'core',
      rooms: ['primary', 'secondary']
    },
    {
      id: 'reasoning',
      name: 'Reasoning Engine',
      description: 'Inference, logic, and problem-solving',
      type: 'core',
      rooms: ['primary', 'secondary']
    },
    {
      id: 'learning',
      name: 'Learning Center',
      description: 'Pattern extraction, generalization, and adaptation',
      type: 'core',
      rooms: ['primary', 'secondary']
    }
  ],

  // ========== SYSTEM AGENTS CONFIGURATION ==========
  systemAgents: [
    {
      id: 'reasoner',
      name: 'Reasoner',
      role: 'inference',
      description: 'Performs logical inference and reasoning'
    },
    {
      id: 'learner',
      name: 'Learner',
      role: 'learning',
      description: 'Extracts patterns and learns from experience'
    },
    {
      id: 'communicator',
      name: 'Communicator',
      role: 'communication',
      description: 'Manages inter-agent communication'
    },
    {
      id: 'observer',
      name: 'Observer',
      role: 'perception',
      description: 'Observes and perceives external input'
    }
  ],

  // ========== PERFORMANCE SETTINGS ==========
  performance: {
    enableCaching: true,
    cacheSize: 10000,
    enableBatching: true,
    batchSize: 100,
    enableParallelProcessing: true,
    maxParallelTasks: 4
  },

  // ========== LOGGING SETTINGS ==========
  logging: {
    enabled: true,
    level: process.env.LOG_LEVEL || 'info',
    format: 'json',
    maxLogSize: 10000,
    logRotation: true
  },

  // ========== MONITORING SETTINGS ==========
  monitoring: {
    enabled: true,
    metricsInterval: 5000, // 5 seconds
    healthCheckInterval: 10000, // 10 seconds
    alertThreshold: 0.8
  }
};

// ========== ENVIRONMENT-SPECIFIC OVERRIDES ==========

if (process.env.NODE_ENV === 'production') {
  BRAIN_PALACE_CONFIG.system.debug = false;
  BRAIN_PALACE_CONFIG.logging.level = 'warn';
  BRAIN_PALACE_CONFIG.palace.maxWings = 500;
  BRAIN_PALACE_CONFIG.knowledgeGraph.maxTriples = 1000000;
  BRAIN_PALACE_CONFIG.agents.maxAgents = 200;
}

if (process.env.NODE_ENV === 'test') {
  BRAIN_PALACE_CONFIG.system.debug = true;
  BRAIN_PALACE_CONFIG.logging.level = 'debug';
  BRAIN_PALACE_CONFIG.palace.consolidationInterval = 1000;
  BRAIN_PALACE_CONFIG.agents.autoConsolidateInterval = 1000;
  BRAIN_PALACE_CONFIG.sentience.updateInterval = 1000;
}

// ========== HELPER FUNCTIONS ==========

export function getConfig(key) {
  const keys = key.split('.');
  let value = BRAIN_PALACE_CONFIG;
  
  for (const k of keys) {
    value = value[k];
    if (value === undefined) return null;
  }
  
  return value;
}

export function setConfig(key, value) {
  const keys = key.split('.');
  const lastKey = keys.pop();
  let obj = BRAIN_PALACE_CONFIG;
  
  for (const k of keys) {
    if (!obj[k]) obj[k] = {};
    obj = obj[k];
  }
  
  obj[lastKey] = value;
}

export function getFullConfig() {
  return JSON.parse(JSON.stringify(BRAIN_PALACE_CONFIG));
}

export default BRAIN_PALACE_CONFIG;
