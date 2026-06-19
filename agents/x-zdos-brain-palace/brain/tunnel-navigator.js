/**
 * ZDOS Tunnel Navigator
 * Cross-reference reasoning engine per navigazione tra wings e concetti
 * Supporta pathfinding, semantic bridging, e multi-hop reasoning
 */

class Tunnel {
  constructor(fromWingId, toWingId, tunnelType = 'semantic') {
    this.id = `tunnel-${fromWingId}-${toWingId}-${Date.now()}`;
    this.fromWingId = fromWingId;
    this.toWingId = toWingId;
    this.type = tunnelType; // semantic, temporal, causal, hierarchical
    this.created = Date.now();
    this.strength = 1.0; // 0-1, increases with usage
    this.usageCount = 0;
    this.metadata = {
      bridgingConcepts: [],
      reasoning: null,
      confidence: 0.5
    };
  }

  incrementUsage() {
    this.usageCount++;
    this.strength = Math.min(1.0, this.strength + 0.01);
  }

  addBridgingConcept(concept) {
    if (!this.metadata.bridgingConcepts.includes(concept)) {
      this.metadata.bridgingConcepts.push(concept);
    }
  }
}

class TunnelNavigator {
  constructor(knowledgeGraph) {
    this.knowledgeGraph = knowledgeGraph;
    this.tunnels = new Map();
    this.tunnelIndex = new Map(); // fromWingId -> [tunnels]
    this.pathCache = new Map();
    this.stats = {
      tunnelsCreated: 0,
      pathsTraversed: 0,
      inferencesGenerated: 0
    };
  }

  // ========== TUNNEL CREATION ==========

  createTunnel(fromWingId, toWingId, tunnelType = 'semantic', bridgingConcepts = []) {
    const tunnel = new Tunnel(fromWingId, toWingId, tunnelType);
    bridgingConcepts.forEach(concept => tunnel.addBridgingConcept(concept));

    this.tunnels.set(tunnel.id, tunnel);
    this.stats.tunnelsCreated++;

    if (!this.tunnelIndex.has(fromWingId)) {
      this.tunnelIndex.set(fromWingId, []);
    }
    this.tunnelIndex.get(fromWingId).push(tunnel.id);

    return tunnel.id;
  }

  getTunnel(tunnelId) {
    return this.tunnels.get(tunnelId);
  }

  getTunnelsFrom(wingId) {
    const tunnelIds = this.tunnelIndex.get(wingId) || [];
    return tunnelIds.map(id => this.tunnels.get(id));
  }

  // ========== PATHFINDING ==========

  findPath(startWingId, endWingId, maxDepth = 5) {
    const cacheKey = `${startWingId}-${endWingId}`;
    if (this.pathCache.has(cacheKey)) {
      return this.pathCache.get(cacheKey);
    }

    const path = this._bfsPath(startWingId, endWingId, maxDepth);
    this.pathCache.set(cacheKey, path);
    this.stats.pathsTraversed++;

    return path;
  }

  _bfsPath(start, end, maxDepth) {
    if (start === end) return [start];

    const queue = [{ wingId: start, path: [start], depth: 0 }];
    const visited = new Set([start]);

    while (queue.length > 0) {
      const { wingId, path, depth } = queue.shift();

      if (depth >= maxDepth) continue;

      const tunnels = this.getTunnelsFrom(wingId);
      for (const tunnel of tunnels) {
        const nextWingId = tunnel.toWingId;

        if (nextWingId === end) {
          return [...path, nextWingId];
        }

        if (!visited.has(nextWingId)) {
          visited.add(nextWingId);
          queue.push({
            wingId: nextWingId,
            path: [...path, nextWingId],
            depth: depth + 1
          });
        }
      }
    }

    return null; // No path found
  }

  // ========== SEMANTIC BRIDGING ==========

  bridgeSemanticGap(concept1, concept2) {
    const results = this.knowledgeGraph.queryPattern(concept1, null, null);
    const bridges = [];

    for (const triple of results) {
      const concept2Results = this.knowledgeGraph.queryPattern(null, null, concept2);
      for (const triple2 of concept2Results) {
        if (triple.entity2 === triple2.entity1) {
          bridges.push({
            concept1,
            bridge: triple.entity2,
            concept2,
            path: [concept1, triple.entity2, concept2],
            strength: triple.confidence * triple2.confidence
          });
        }
      }
    }

    return bridges.sort((a, b) => b.strength - a.strength);
  }

  // ========== MULTI-HOP REASONING ==========

  multiHopReasoning(startConcept, targetRelationship, hops = 3) {
    const results = [];
    const queue = [
      { concept: startConcept, path: [startConcept], hopsLeft: hops }
    ];
    const visited = new Set([startConcept]);

    while (queue.length > 0) {
      const { concept, path, hopsLeft } = queue.shift();

      if (hopsLeft === 0) continue;

      const triples = this.knowledgeGraph.queryByEntity1(concept);
      for (const triple of triples) {
        if (triple.relationship === targetRelationship) {
          results.push({
            startConcept,
            targetConcept: triple.entity2,
            path: [...path, triple.entity2],
            hops: hops - hopsLeft + 1,
            confidence: triple.confidence
          });
        }

        if (!visited.has(triple.entity2)) {
          visited.add(triple.entity2);
          queue.push({
            concept: triple.entity2,
            path: [...path, triple.entity2],
            hopsLeft: hopsLeft - 1
          });
        }
      }
    }

    this.stats.inferencesGenerated += results.length;
    return results.sort((a, b) => b.confidence - a.confidence);
  }

  // ========== CAUSAL REASONING ==========

  findCausalChains(eventConcept, maxDepth = 4) {
    const chains = [];
    const queue = [{ concept: eventConcept, chain: [eventConcept], depth: 0 }];

    while (queue.length > 0) {
      const { concept, chain, depth } = queue.shift();

      if (depth >= maxDepth) continue;

      // Find causes
      const causes = this.knowledgeGraph.queryByEntity2(concept);
      for (const triple of causes) {
        if (triple.relationship === 'causes' || triple.relationship === 'leads_to') {
          const newChain = [triple.entity1, ...chain];
          chains.push({
            chain: newChain,
            depth: depth + 1,
            confidence: triple.confidence
          });

          queue.push({
            concept: triple.entity1,
            chain: newChain,
            depth: depth + 1
          });
        }
      }

      // Find effects
      const effects = this.knowledgeGraph.queryByEntity1(concept);
      for (const triple of effects) {
        if (triple.relationship === 'causes' || triple.relationship === 'leads_to') {
          const newChain = [...chain, triple.entity2];
          chains.push({
            chain: newChain,
            depth: depth + 1,
            confidence: triple.confidence
          });

          queue.push({
            concept: triple.entity2,
            chain: newChain,
            depth: depth + 1
          });
        }
      }
    }

    return chains.sort((a, b) => b.confidence - a.confidence);
  }

  // ========== ANALOGY REASONING ==========

  findAnalogies(sourceConcept, targetDomain) {
    const analogies = [];
    const sourceTriples = this.knowledgeGraph.queryByEntity1(sourceConcept);

    for (const sourceTriple of sourceTriples) {
      const targetTriples = this.knowledgeGraph.queryPattern(null, sourceTriple.relationship, null);

      for (const targetTriple of targetTriples) {
        if (targetTriple.entity1.includes(targetDomain)) {
          analogies.push({
            source: {
              entity1: sourceConcept,
              relationship: sourceTriple.relationship,
              entity2: sourceTriple.entity2
            },
            target: {
              entity1: targetTriple.entity1,
              relationship: targetTriple.relationship,
              entity2: targetTriple.entity2
            },
            similarity: sourceTriple.confidence * targetTriple.confidence
          });
        }
      }
    }

    return analogies.sort((a, b) => b.similarity - a.similarity);
  }

  // ========== TUNNEL TRAVERSAL ==========

  traverseTunnel(tunnelId, data = {}) {
    const tunnel = this.getTunnel(tunnelId);
    if (!tunnel) throw new Error(`Tunnel not found: ${tunnelId}`);

    tunnel.incrementUsage();

    return {
      tunnelId,
      from: tunnel.fromWingId,
      to: tunnel.toWingId,
      type: tunnel.type,
      bridgingConcepts: tunnel.metadata.bridgingConcepts,
      strength: tunnel.strength,
      data
    };
  }

  // ========== NAVIGATION QUERIES ==========

  navigateToRelated(wingId, relationshipType = null) {
    const tunnels = this.getTunnelsFrom(wingId);
    const related = [];

    for (const tunnel of tunnels) {
      if (!relationshipType || tunnel.type === relationshipType) {
        related.push({
          wingId: tunnel.toWingId,
          tunnelId: tunnel.id,
          type: tunnel.type,
          strength: tunnel.strength,
          concepts: tunnel.metadata.bridgingConcepts
        });
      }
    }

    return related.sort((a, b) => b.strength - a.strength);
  }

  // ========== STATS & EXPORT ==========

  getStats() {
    return {
      ...this.stats,
      totalTunnels: this.tunnels.size,
      avgTunnelStrength: Array.from(this.tunnels.values()).reduce((sum, t) => sum + t.strength, 0) / this.tunnels.size || 0,
      cachedPaths: this.pathCache.size,
      timestamp: Date.now()
    };
  }

  export() {
    const tunnels = [];
    for (const tunnel of this.tunnels.values()) {
      tunnels.push({
        id: tunnel.id,
        from: tunnel.fromWingId,
        to: tunnel.toWingId,
        type: tunnel.type,
        strength: tunnel.strength,
        usageCount: tunnel.usageCount,
        concepts: tunnel.metadata.bridgingConcepts
      });
    }

    return {
      tunnels,
      stats: this.getStats()
    };
  }
}

export { TunnelNavigator, Tunnel };
