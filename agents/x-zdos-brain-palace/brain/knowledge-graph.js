/**
 * ZDOS Brain Knowledge Graph
 * Temporal entity-relationship graph con validità temporale
 * Supporta query complesse e ragionamento inferenziale
 */

class TemporalTriple {
  constructor(entity1, relationship, entity2, timestamp, confidence = 1.0) {
    this.entity1 = entity1;
    this.relationship = relationship;
    this.entity2 = entity2;
    this.timestamp = timestamp;
    this.confidence = confidence;
    this.validity = {
      start: timestamp,
      end: null
    };
    this.metadata = {
      source: null,
      context: null,
      tags: []
    };
  }

  isValid(atTime = Date.now()) {
    return atTime >= this.validity.start && (this.validity.end === null || atTime <= this.validity.end);
  }

  expire(endTime = Date.now()) {
    this.validity.end = endTime;
  }

  addTag(tag) {
    if (!this.metadata.tags.includes(tag)) {
      this.metadata.tags.push(tag);
    }
  }
}

class KnowledgeGraph {
  constructor() {
    this.triples = new Map();
    this.entities = new Map();
    this.relationships = new Map();
    this.indexes = {
      byEntity1: new Map(),
      byEntity2: new Map(),
      byRelationship: new Map(),
      byTimestamp: new Map(),
      byTag: new Map()
    };
    this.stats = {
      totalTriples: 0,
      totalEntities: 0,
      totalRelationships: 0,
      queries: 0
    };
  }

  // ========== TRIPLE OPERATIONS ==========

  addTriple(entity1, relationship, entity2, timestamp = Date.now(), confidence = 1.0, source = null) {
    const tripleId = `${entity1}:${relationship}:${entity2}:${timestamp}`;
    const triple = new TemporalTriple(entity1, relationship, entity2, timestamp, confidence);
    triple.metadata.source = source;

    this.triples.set(tripleId, triple);
    this.stats.totalTriples++;

    // Update entity indexes
    if (!this.entities.has(entity1)) {
      this.entities.set(entity1, { outgoing: [], incoming: [] });
      this.stats.totalEntities++;
    }
    if (!this.entities.has(entity2)) {
      this.entities.set(entity2, { outgoing: [], incoming: [] });
      this.stats.totalEntities++;
    }

    this.entities.get(entity1).outgoing.push(tripleId);
    this.entities.get(entity2).incoming.push(tripleId);

    // Update relationship index
    if (!this.relationships.has(relationship)) {
      this.relationships.set(relationship, []);
      this.stats.totalRelationships++;
    }
    this.relationships.get(relationship).push(tripleId);

    // Update reverse indexes
    if (!this.indexes.byEntity1.has(entity1)) {
      this.indexes.byEntity1.set(entity1, []);
    }
    this.indexes.byEntity1.get(entity1).push(tripleId);

    if (!this.indexes.byEntity2.has(entity2)) {
      this.indexes.byEntity2.set(entity2, []);
    }
    this.indexes.byEntity2.get(entity2).push(tripleId);

    if (!this.indexes.byRelationship.has(relationship)) {
      this.indexes.byRelationship.set(relationship, []);
    }
    this.indexes.byRelationship.get(relationship).push(tripleId);

    if (!this.indexes.byTimestamp.has(timestamp)) {
      this.indexes.byTimestamp.set(timestamp, []);
    }
    this.indexes.byTimestamp.get(timestamp).push(tripleId);

    return tripleId;
  }

  getTriple(tripleId) {
    return this.triples.get(tripleId);
  }

  removeTriple(tripleId) {
    const triple = this.triples.get(tripleId);
    if (!triple) return false;

    this.triples.delete(tripleId);
    this.stats.totalTriples--;
    return true;
  }

  // ========== QUERY OPERATIONS ==========

  queryByEntity1(entity, validOnly = true, atTime = Date.now()) {
    const tripleIds = this.indexes.byEntity1.get(entity) || [];
    const results = [];

    for (const tripleId of tripleIds) {
      const triple = this.triples.get(tripleId);
      if (!validOnly || triple.isValid(atTime)) {
        results.push(triple);
      }
    }

    this.stats.queries++;
    return results;
  }

  queryByEntity2(entity, validOnly = true, atTime = Date.now()) {
    const tripleIds = this.indexes.byEntity2.get(entity) || [];
    const results = [];

    for (const tripleId of tripleIds) {
      const triple = this.triples.get(tripleId);
      if (!validOnly || triple.isValid(atTime)) {
        results.push(triple);
      }
    }

    this.stats.queries++;
    return results;
  }

  queryByRelationship(relationship, validOnly = true, atTime = Date.now()) {
    const tripleIds = this.indexes.byRelationship.get(relationship) || [];
    const results = [];

    for (const tripleId of tripleIds) {
      const triple = this.triples.get(tripleId);
      if (!validOnly || triple.isValid(atTime)) {
        results.push(triple);
      }
    }

    this.stats.queries++;
    return results;
  }

  queryByTag(tag, validOnly = true, atTime = Date.now()) {
    const results = [];

    for (const triple of this.triples.values()) {
      if (triple.metadata.tags.includes(tag)) {
        if (!validOnly || triple.isValid(atTime)) {
          results.push(triple);
        }
      }
    }

    this.stats.queries++;
    return results;
  }

  // ========== PATTERN MATCHING ==========

  queryPattern(entity1Pattern, relationshipPattern, entity2Pattern, validOnly = true, atTime = Date.now()) {
    const results = [];

    for (const triple of this.triples.values()) {
      const e1Match = !entity1Pattern || triple.entity1.includes(entity1Pattern);
      const relMatch = !relationshipPattern || triple.relationship.includes(relationshipPattern);
      const e2Match = !entity2Pattern || triple.entity2.includes(entity2Pattern);

      if (e1Match && relMatch && e2Match) {
        if (!validOnly || triple.isValid(atTime)) {
          results.push(triple);
        }
      }
    }

    this.stats.queries++;
    return results;
  }

  // ========== INFERENCE ==========

  // Transitivity: if A→B and B→C, then A→C
  queryTransitive(entity1, relationship, depth = 2) {
    const results = [];
    const visited = new Set();
    const queue = [{ entity: entity1, depth, path: [entity1] }];

    while (queue.length > 0) {
      const { entity, depth: currentDepth, path } = queue.shift();

      if (currentDepth === 0 || visited.has(entity)) continue;
      visited.add(entity);

      const outgoing = this.queryByEntity1(entity);
      for (const triple of outgoing) {
        if (triple.relationship === relationship) {
          results.push({
            ...triple,
            path: [...path, triple.entity2]
          });

          queue.push({
            entity: triple.entity2,
            depth: currentDepth - 1,
            path: [...path, triple.entity2]
          });
        }
      }
    }

    this.stats.queries++;
    return results;
  }

  // Symmetry: if A↔B, then B↔A
  querySymmetric(entity, relationship) {
    const results = [];
    const outgoing = this.queryByEntity1(entity);

    for (const triple of outgoing) {
      if (triple.relationship === relationship) {
        const reverse = this.queryPattern(triple.entity2, relationship, entity);
        if (reverse.length > 0) {
          results.push({
            entity1: entity,
            entity2: triple.entity2,
            relationship,
            symmetric: true
          });
        }
      }
    }

    this.stats.queries++;
    return results;
  }

  // ========== TEMPORAL QUERIES ==========

  queryByTimeRange(startTime, endTime) {
    const results = [];

    for (const triple of this.triples.values()) {
      if (triple.timestamp >= startTime && triple.timestamp <= endTime) {
        results.push(triple);
      }
    }

    this.stats.queries++;
    return results;
  }

  queryTimeline(entity) {
    const outgoing = this.queryByEntity1(entity);
    const sorted = outgoing.sort((a, b) => a.timestamp - b.timestamp);

    this.stats.queries++;
    return sorted;
  }

  // ========== CONFIDENCE & RANKING ==========

  queryByConfidence(minConfidence = 0.5, validOnly = true, atTime = Date.now()) {
    const results = [];

    for (const triple of this.triples.values()) {
      if (triple.confidence >= minConfidence) {
        if (!validOnly || triple.isValid(atTime)) {
          results.push(triple);
        }
      }
    }

    const sorted = results.sort((a, b) => b.confidence - a.confidence);
    this.stats.queries++;
    return sorted;
  }

  // ========== GRAPH ANALYTICS ==========

  getEntityDegree(entity) {
    const entityData = this.entities.get(entity);
    if (!entityData) return { entity, inDegree: 0, outDegree: 0 };

    return {
      entity,
      outDegree: entityData.outgoing.length,
      inDegree: entityData.incoming.length,
      totalDegree: entityData.outgoing.length + entityData.incoming.length
    };
  }

  getTopEntities(limit = 10) {
    const entities = [];

    for (const [entity, data] of this.entities.entries()) {
      entities.push({
        entity,
        degree: data.outgoing.length + data.incoming.length,
        outgoing: data.outgoing.length,
        incoming: data.incoming.length
      });
    }

    return entities.sort((a, b) => b.degree - a.degree).slice(0, limit);
  }

  getRelationshipFrequency() {
    const frequency = {};

    for (const [rel, triples] of this.relationships.entries()) {
      frequency[rel] = triples.length;
    }

    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .reduce((obj, [rel, count]) => {
        obj[rel] = count;
        return obj;
      }, {});
  }

  // ========== EXPORT & STATS ==========

  getStats() {
    return {
      ...this.stats,
      entities: this.entities.size,
      relationships: this.relationships.size,
      timestamp: Date.now()
    };
  }

  export() {
    const triples = [];
    for (const triple of this.triples.values()) {
      triples.push({
        entity1: triple.entity1,
        relationship: triple.relationship,
        entity2: triple.entity2,
        timestamp: triple.timestamp,
        confidence: triple.confidence,
        validity: triple.validity,
        metadata: triple.metadata
      });
    }

    return {
      triples,
      entities: Array.from(this.entities.keys()),
      relationships: Array.from(this.relationships.keys()),
      stats: this.getStats()
    };
  }
}

export { KnowledgeGraph, TemporalTriple };
