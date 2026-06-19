/**
 * ZDOS Agent Diary System
 * Multi-agent memory management con journaling, reflection, e learning
 */

class DiaryEntry {
  constructor(agentId, content, entryType = 'observation') {
    this.id = `${agentId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.agentId = agentId;
    this.content = content;
    this.type = entryType; // observation, reflection, learning, communication
    this.timestamp = Date.now();
    this.tags = [];
    this.relations = [];
    this.sentiment = null;
    this.importance = 0.5;
    this.metadata = {};
  }

  addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }

  linkEntry(entryId, relationshipType = 'related') {
    this.relations.push({ entryId, type: relationshipType });
  }

  setSentiment(sentiment) {
    this.sentiment = sentiment; // positive, neutral, negative
  }

  setImportance(score) {
    this.importance = Math.max(0, Math.min(1, score));
  }
}

class AgentDiary {
  constructor(agentId, name = 'Agent') {
    this.agentId = agentId;
    this.name = name;
    this.entries = new Map();
    this.timeline = [];
    this.indexes = {
      byType: new Map(),
      byTag: new Map(),
      byImportance: new Map()
    };
    this.stats = {
      totalEntries: 0,
      observations: 0,
      reflections: 0,
      learnings: 0,
      communications: 0
    };
    this.memory = {
      shortTerm: [], // Last 10 entries
      workingMemory: {}, // Current focus
      longTermPatterns: [] // Extracted patterns
    };
  }

  // ========== ENTRY OPERATIONS ==========

  addEntry(content, entryType = 'observation', tags = []) {
    const entry = new DiaryEntry(this.agentId, content, entryType);
    tags.forEach(tag => entry.addTag(tag));

    this.entries.set(entry.id, entry);
    this.timeline.push(entry.id);
    this.stats.totalEntries++;
    this.stats[`${entryType}s`]++;

    // Update indexes
    if (!this.indexes.byType.has(entryType)) {
      this.indexes.byType.set(entryType, []);
    }
    this.indexes.byType.get(entryType).push(entry.id);

    for (const tag of tags) {
      if (!this.indexes.byTag.has(tag)) {
        this.indexes.byTag.set(tag, []);
      }
      this.indexes.byTag.get(tag).push(entry.id);
    }

    // Update short-term memory
    this.memory.shortTerm.push(entry.id);
    if (this.memory.shortTerm.length > 10) {
      this.memory.shortTerm.shift();
    }

    return entry.id;
  }

  getEntry(entryId) {
    return this.entries.get(entryId);
  }

  // ========== REFLECTION ==========

  reflect(entryId, reflection) {
    const entry = this.entries.get(entryId);
    if (!entry) throw new Error(`Entry not found: ${entryId}`);

    const reflectionEntry = new DiaryEntry(
      this.agentId,
      reflection,
      'reflection'
    );
    reflectionEntry.linkEntry(entryId, 'reflects_on');
    entry.relations.push({ entryId: reflectionEntry.id, type: 'reflected_by' });

    this.entries.set(reflectionEntry.id, reflectionEntry);
    this.timeline.push(reflectionEntry.id);
    this.stats.totalEntries++;
    this.stats.reflections++;

    return reflectionEntry.id;
  }

  // ========== LEARNING ==========

  recordLearning(pattern, confidence = 0.8, source = null) {
    const learningEntry = new DiaryEntry(
      this.agentId,
      `Pattern: ${pattern}`,
      'learning'
    );
    learningEntry.importance = confidence;
    learningEntry.metadata.source = source;
    learningEntry.metadata.pattern = pattern;

    this.entries.set(learningEntry.id, learningEntry);
    this.timeline.push(learningEntry.id);
    this.stats.totalEntries++;
    this.stats.learnings++;

    // Store in long-term patterns
    this.memory.longTermPatterns.push({
      pattern,
      confidence,
      firstSeen: Date.now(),
      occurrences: 1
    });

    return learningEntry.id;
  }

  // ========== COMMUNICATION ==========

  recordCommunication(targetAgent, message, direction = 'outgoing') {
    const commEntry = new DiaryEntry(
      this.agentId,
      `${direction.toUpperCase()}: ${message}`,
      'communication'
    );
    commEntry.metadata.targetAgent = targetAgent;
    commEntry.metadata.direction = direction;

    this.entries.set(commEntry.id, commEntry);
    this.timeline.push(commEntry.id);
    this.stats.totalEntries++;
    this.stats.communications++;

    return commEntry.id;
  }

  // ========== QUERY OPERATIONS ==========

  getEntriesByType(entryType) {
    const entryIds = this.indexes.byType.get(entryType) || [];
    return entryIds.map(id => this.entries.get(id));
  }

  getEntriesByTag(tag) {
    const entryIds = this.indexes.byTag.get(tag) || [];
    return entryIds.map(id => this.entries.get(id));
  }

  getEntriesByTimeRange(startTime, endTime) {
    const results = [];
    for (const entry of this.entries.values()) {
      if (entry.timestamp >= startTime && entry.timestamp <= endTime) {
        results.push(entry);
      }
    }
    return results.sort((a, b) => a.timestamp - b.timestamp);
  }

  getRecentEntries(limit = 10) {
    return this.timeline
      .slice(-limit)
      .reverse()
      .map(id => this.entries.get(id));
  }

  getMostImportantEntries(limit = 5) {
    const sorted = Array.from(this.entries.values())
      .sort((a, b) => b.importance - a.importance);
    return sorted.slice(0, limit);
  }

  // ========== MEMORY CONSOLIDATION ==========

  consolidateMemory() {
    const consolidation = {
      timestamp: Date.now(),
      shortTermSummary: this.memory.shortTerm.length,
      patterns: this.memory.longTermPatterns.length,
      topThemes: this.extractTopThemes(),
      agentState: this.analyzeAgentState()
    };

    return consolidation;
  }

  extractTopThemes() {
    const themes = {};

    for (const entry of this.entries.values()) {
      for (const tag of entry.tags) {
        themes[tag] = (themes[tag] || 0) + 1;
      }
    }

    return Object.entries(themes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([theme, count]) => ({ theme, count }));
  }

  analyzeAgentState() {
    const recentEntries = this.getRecentEntries(20);
    const sentiments = recentEntries
      .filter(e => e.sentiment)
      .map(e => e.sentiment);

    const sentimentCount = {
      positive: sentiments.filter(s => s === 'positive').length,
      neutral: sentiments.filter(s => s === 'neutral').length,
      negative: sentiments.filter(s => s === 'negative').length
    };

    return {
      recentActivity: recentEntries.length,
      dominantSentiment: Object.entries(sentimentCount).sort(([, a], [, b]) => b - a)[0]?.[0] || 'unknown',
      averageImportance: recentEntries.reduce((sum, e) => sum + e.importance, 0) / recentEntries.length || 0
    };
  }

  // ========== EXPORT & STATS ==========

  getStats() {
    return {
      agentId: this.agentId,
      name: this.name,
      ...this.stats,
      tags: this.indexes.byTag.size,
      timestamp: Date.now()
    };
  }

  export() {
    const entries = [];
    for (const entry of this.entries.values()) {
      entries.push({
        id: entry.id,
        content: entry.content,
        type: entry.type,
        timestamp: entry.timestamp,
        tags: entry.tags,
        importance: entry.importance,
        sentiment: entry.sentiment,
        relations: entry.relations
      });
    }

    return {
      agentId: this.agentId,
      name: this.name,
      entries,
      stats: this.getStats(),
      memory: {
        patterns: this.memory.longTermPatterns,
        themes: this.extractTopThemes(),
        state: this.analyzeAgentState()
      }
    };
  }
}

class MultiAgentDiaryManager {
  constructor() {
    this.diaries = new Map();
    this.communicationLog = [];
    this.sharedMemory = new Map();
    this.agentNetwork = new Map();
  }

  createAgentDiary(agentId, name = 'Agent') {
    const diary = new AgentDiary(agentId, name);
    this.diaries.set(agentId, diary);
    this.agentNetwork.set(agentId, {
      connections: [],
      lastActive: Date.now()
    });
    return diary;
  }

  getAgentDiary(agentId) {
    return this.diaries.get(agentId);
  }

  // ========== AGENT COMMUNICATION ==========

  recordAgentCommunication(fromAgent, toAgent, message) {
    const fromDiary = this.diaries.get(fromAgent);
    const toDiary = this.diaries.get(toAgent);

    if (!fromDiary || !toDiary) {
      throw new Error('One or both agents not found');
    }

    const commId = `${fromAgent}-${toAgent}-${Date.now()}`;

    fromDiary.recordCommunication(toAgent, message, 'outgoing');
    toDiary.recordCommunication(fromAgent, message, 'incoming');

    this.communicationLog.push({
      id: commId,
      from: fromAgent,
      to: toAgent,
      message,
      timestamp: Date.now()
    });

    // Update agent network
    const fromNetwork = this.agentNetwork.get(fromAgent);
    if (!fromNetwork.connections.includes(toAgent)) {
      fromNetwork.connections.push(toAgent);
    }

    return commId;
  }

  // ========== SHARED MEMORY ==========

  shareMemory(agentId, key, value, visibility = 'private') {
    const sharedKey = `${agentId}:${key}`;
    this.sharedMemory.set(sharedKey, {
      value,
      visibility,
      owner: agentId,
      timestamp: Date.now()
    });
  }

  getSharedMemory(agentId, key) {
    const sharedKey = `${agentId}:${key}`;
    return this.sharedMemory.get(sharedKey);
  }

  // ========== COLLECTIVE ANALYSIS ==========

  getCollectiveStats() {
    const stats = {
      totalAgents: this.diaries.size,
      totalEntries: 0,
      totalCommunications: this.communicationLog.length,
      agentStats: {}
    };

    for (const [agentId, diary] of this.diaries.entries()) {
      const diaryStats = diary.getStats();
      stats.totalEntries += diaryStats.totalEntries;
      stats.agentStats[agentId] = diaryStats;
    }

    return stats;
  }

  getAgentNetwork() {
    const network = {};
    for (const [agentId, data] of this.agentNetwork.entries()) {
      network[agentId] = {
        connections: data.connections.length,
        peers: data.connections,
        lastActive: data.lastActive
      };
    }
    return network;
  }

  exportAll() {
    const export_data = {
      timestamp: Date.now(),
      agents: {},
      communications: this.communicationLog,
      network: this.getAgentNetwork(),
      stats: this.getCollectiveStats()
    };

    for (const [agentId, diary] of this.diaries.entries()) {
      export_data.agents[agentId] = diary.export();
    }

    return export_data;
  }
}

export { AgentDiary, DiaryEntry, MultiAgentDiaryManager };
