/**
 * ZDOS Brain Palace - Test Suite
 * Validazione completa del sistema neuromorfico senziente
 */

import { WingManager } from './wing-manager.js';
import { AAKCompressor } from './aaak-compressor.js';
import { KnowledgeGraph } from './knowledge-graph.js';
import { MCPServer } from './mcp-server.js';
import { AgentDiary, MultiAgentDiaryManager } from './agent-diary.js';
import { TunnelNavigator } from './tunnel-navigator.js';

class BrainPalaceTestSuite {
  constructor() {
    this.results = [];
    this.passed = 0;
    this.failed = 0;
  }

  // ========== TEST UTILITIES ==========

  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(`Expected ${expected}, got ${actual}: ${message}`);
    }
  }

  async runTest(name, testFn) {
    try {
      await testFn();
      this.results.push({ name, status: 'PASS', error: null });
      this.passed++;
      console.log(`✅ ${name}`);
    } catch (error) {
      this.results.push({ name, status: 'FAIL', error: error.message });
      this.failed++;
      console.log(`❌ ${name}: ${error.message}`);
    }
  }

  // ========== WING MANAGER TESTS ==========

  async testWingCreation() {
    const manager = new WingManager();
    const wing = manager.createWing('test-wing', 'Test Wing');
    this.assert(wing.id !== null, 'Wing should have ID');
    this.assert(wing.name === 'test-wing', 'Wing name should match');
  }

  async testRoomCreation() {
    const manager = new WingManager();
    const wing = manager.createWing('test-wing', 'Test Wing');
    const room = manager.createRoom(wing.id, 'test-room', 'Test Room');
    this.assert(room.id !== null, 'Room should have ID');
    this.assert(room.name === 'test-room', 'Room name should match');
  }

  async testHierarchyTraversal() {
    const manager = new WingManager();
    const wing = manager.createWing('semantic', 'Semantic Memory');
    const room = manager.createRoom(wing.id, 'concepts', 'Concepts');
    const closet = manager.createCloset(wing.id, room.id, 'compressed-data', {});
    const drawer = manager.createDrawer(wing.id, room.id, closet.id, 'verbatim-data', ['test']);

    const retrieved = manager.getDrawer(wing.id, room.id, closet.id, drawer.id);
    this.assert(retrieved !== null, 'Should retrieve drawer');
    this.assert(retrieved.content === 'verbatim-data', 'Drawer content should match');
  }

  // ========== COMPRESSION TESTS ==========

  async testCompressionRatio() {
    const compressor = new AAKCompressor();
    const text = 'The quick brown fox jumps over the lazy dog. ' +
                 'The fox is quick. The dog is lazy. ' +
                 'Quick foxes jump. Lazy dogs sleep.';
    
    const compressed = compressor.compress(text);
    const ratio = compressed.length / text.length;
    
    this.assert(ratio < 0.5, `Compression ratio should be < 0.5, got ${ratio}`);
  }

  async testCompressionLossless() {
    const compressor = new AAKCompressor();
    const text = 'ZDOS Brain Palace - Sentient Memory System';
    
    const compressed = compressor.compress(text);
    const decompressed = compressor.decompress(compressed);
    
    this.assertEqual(decompressed, text, 'Decompressed text should match original');
  }

  async testCompressionEdgeCases() {
    const compressor = new AAKCompressor();
    
    // Empty string
    const empty = compressor.compress('');
    this.assertEqual(compressor.decompress(empty), '', 'Empty string should decompress');
    
    // Single character
    const single = compressor.compress('A');
    this.assertEqual(compressor.decompress(single), 'A', 'Single char should decompress');
    
    // Unicode
    const unicode = compressor.compress('🧠 Neuromorphic');
    this.assertEqual(compressor.decompress(unicode), '🧠 Neuromorphic', 'Unicode should decompress');
  }

  // ========== KNOWLEDGE GRAPH TESTS ==========

  async testTripleAddition() {
    const kg = new KnowledgeGraph();
    const tripleId = kg.addTriple('concept-A', 'related_to', 'concept-B', Date.now(), 0.95);
    
    this.assert(tripleId !== null, 'Triple should have ID');
    this.assert(kg.getStats().totalTriples === 1, 'Should have 1 triple');
  }

  async testEntityQuery() {
    const kg = new KnowledgeGraph();
    kg.addTriple('A', 'causes', 'B');
    kg.addTriple('A', 'causes', 'C');
    kg.addTriple('B', 'causes', 'D');
    
    const outgoing = kg.queryByEntity1('A');
    this.assert(outgoing.length === 2, 'Should find 2 outgoing triples from A');
    
    const incoming = kg.queryByEntity2('D');
    this.assert(incoming.length === 1, 'Should find 1 incoming triple to D');
  }

  async testTransitiveInference() {
    const kg = new KnowledgeGraph();
    kg.addTriple('A', 'is_part_of', 'B');
    kg.addTriple('B', 'is_part_of', 'C');
    kg.addTriple('C', 'is_part_of', 'D');
    
    const results = kg.queryTransitive('A', 'is_part_of', 3);
    this.assert(results.length > 0, 'Should find transitive paths');
    this.assert(results.some(r => r.entity2 === 'D'), 'Should reach D through transitivity');
  }

  async testTemporalQuery() {
    const kg = new KnowledgeGraph();
    const t1 = Date.now();
    const t2 = t1 + 1000;
    const t3 = t1 + 2000;
    
    kg.addTriple('event1', 'happens_at', 'time1', t1);
    kg.addTriple('event2', 'happens_at', 'time2', t2);
    kg.addTriple('event3', 'happens_at', 'time3', t3);
    
    const range = kg.queryByTimeRange(t1, t2);
    this.assert(range.length === 2, 'Should find events in time range');
  }

  // ========== MCP SERVER TESTS ==========

  async testMCPToolRegistration() {
    const server = new MCPServer();
    const tools = server.listTools();
    
    this.assert(tools.length >= 29, `Should have at least 29 tools, got ${tools.length}`);
  }

  async testMCPWingTool() {
    const server = new MCPServer();
    
    const result = await server.callTool('wing.create', {
      name: 'test-wing',
      description: 'Test Wing'
    });
    
    this.assert(result.success, 'Tool call should succeed');
    this.assert(result.result.wingId !== null, 'Should return wing ID');
  }

  async testMCPCompressionTool() {
    const server = new MCPServer();
    const text = 'ZDOS Brain Palace System';
    
    const result = await server.callTool('closet.compress', { content: text });
    
    this.assert(result.success, 'Compression tool should succeed');
    this.assert(result.result.lossless === true, 'Compression should be lossless');
  }

  // ========== AGENT DIARY TESTS ==========

  async testAgentDiaryCreation() {
    const diary = new AgentDiary('agent-1', 'Test Agent');
    
    this.assert(diary.agentId === 'agent-1', 'Agent ID should match');
    this.assert(diary.name === 'Test Agent', 'Agent name should match');
  }

  async testDiaryEntryTypes() {
    const diary = new AgentDiary('agent-1');
    
    const obsId = diary.addEntry('Observed pattern X', 'observation');
    const refId = diary.reflect(obsId, 'Pattern X means...');
    const learnId = diary.recordLearning('X implies Y', 0.85);
    
    this.assert(diary.getStats().observations === 1, 'Should have 1 observation');
    this.assert(diary.getStats().reflections === 1, 'Should have 1 reflection');
    this.assert(diary.getStats().learnings === 1, 'Should have 1 learning');
  }

  async testMultiAgentCommunication() {
    const manager = new MultiAgentDiaryManager();
    
    const diary1 = manager.createAgentDiary('agent-1', 'Agent 1');
    const diary2 = manager.createAgentDiary('agent-2', 'Agent 2');
    
    manager.recordAgentCommunication('agent-1', 'agent-2', 'Hello Agent 2');
    
    const stats = manager.getCollectiveStats();
    this.assert(stats.totalCommunications === 1, 'Should record communication');
  }

  // ========== TUNNEL NAVIGATOR TESTS ==========

  async testTunnelCreation() {
    const kg = new KnowledgeGraph();
    const navigator = new TunnelNavigator(kg);
    
    const tunnelId = navigator.createTunnel('wing-A', 'wing-B', 'semantic', ['concept-1']);
    this.assert(tunnelId !== null, 'Tunnel should have ID');
  }

  async testPathfinding() {
    const kg = new KnowledgeGraph();
    const navigator = new TunnelNavigator(kg);
    
    navigator.createTunnel('wing-A', 'wing-B', 'semantic');
    navigator.createTunnel('wing-B', 'wing-C', 'semantic');
    navigator.createTunnel('wing-C', 'wing-D', 'semantic');
    
    const path = navigator.findPath('wing-A', 'wing-D');
    this.assert(path !== null, 'Should find path');
    this.assert(path.length === 4, 'Path should have 4 wings');
  }

  async testSemanticBridging() {
    const kg = new KnowledgeGraph();
    kg.addTriple('concept-A', 'related_to', 'concept-X');
    kg.addTriple('concept-X', 'related_to', 'concept-B');
    
    const navigator = new TunnelNavigator(kg);
    const bridges = navigator.bridgeSemanticGap('concept-A', 'concept-B');
    
    this.assert(bridges.length > 0, 'Should find semantic bridges');
  }

  async testMultiHopReasoning() {
    const kg = new KnowledgeGraph();
    kg.addTriple('A', 'causes', 'B', Date.now(), 0.95);
    kg.addTriple('B', 'causes', 'C', Date.now(), 0.90);
    kg.addTriple('C', 'causes', 'D', Date.now(), 0.85);
    
    const navigator = new TunnelNavigator(kg);
    const inferences = navigator.multiHopReasoning('A', 'causes', 3);
    
    this.assert(inferences.length > 0, 'Should generate inferences');
    this.assert(inferences.some(i => i.targetConcept === 'D'), 'Should reach D');
  }

  // ========== INTEGRATION TESTS ==========

  async testFullSystemIntegration() {
    // Create all components
    const manager = new WingManager();
    const compressor = new AAKCompressor();
    const kg = new KnowledgeGraph();
    const server = new MCPServer();
    const diaryManager = new MultiAgentDiaryManager();
    const navigator = new TunnelNavigator(kg);
    
    // Create structure
    const wing = manager.createWing('semantic', 'Semantic Memory');
    const room = manager.createRoom(wing.id, 'concepts', 'Concepts');
    
    // Add data
    const content = 'Important semantic information about the system';
    const compressed = compressor.compress(content);
    const closet = manager.createCloset(wing.id, room.id, compressed, {});
    
    // Add to knowledge graph
    kg.addTriple('wing-semantic', 'contains', 'room-concepts');
    kg.addTriple('room-concepts', 'stores', 'compressed-data');
    
    // Create agents
    const agent1 = diaryManager.createAgentDiary('agent-1', 'Reasoner');
    agent1.addEntry('System initialized', 'observation');
    
    // Create tunnel
    const wing2 = manager.createWing('episodic', 'Episodic Memory');
    navigator.createTunnel(wing.id, wing2.id, 'semantic');
    
    // Verify integration
    this.assert(manager.getMemoryStats().totalWings === 2, 'Should have 2 wings');
    this.assert(kg.getStats().totalTriples === 2, 'Should have 2 triples');
    this.assert(diaryManager.getCollectiveStats().totalAgents === 1, 'Should have 1 agent');
    this.assert(navigator.getStats().totalTunnels === 1, 'Should have 1 tunnel');
  }

  async testEmergentIntelligence() {
    // Simulate emergent intelligence
    const kg = new KnowledgeGraph();
    const navigator = new TunnelNavigator(kg);
    
    // Create complex knowledge structure
    for (let i = 0; i < 10; i++) {
      kg.addTriple(`concept-${i}`, 'related_to', `concept-${(i + 1) % 10}`, Date.now(), 0.8 + Math.random() * 0.2);
    }
    
    // Test reasoning
    const inferences = navigator.multiHopReasoning('concept-0', 'related_to', 5);
    this.assert(inferences.length > 0, 'Should generate emergent inferences');
    
    // Test stats
    const stats = kg.getStats();
    this.assert(stats.totalTriples === 10, 'Should have 10 triples');
    this.assert(stats.queries > 0, 'Should have processed queries');
  }

  // ========== RUN ALL TESTS ==========

  async runAllTests() {
    console.log('\n🧠 ZDOS Brain Palace Test Suite\n');
    console.log('=' .repeat(50));
    
    // Wing Manager Tests
    console.log('\n📁 Wing Manager Tests');
    await this.runTest('Wing Creation', () => this.testWingCreation());
    await this.runTest('Room Creation', () => this.testRoomCreation());
    await this.runTest('Hierarchy Traversal', () => this.testHierarchyTraversal());
    
    // Compression Tests
    console.log('\n🗜️ Compression Tests');
    await this.runTest('Compression Ratio', () => this.testCompressionRatio());
    await this.runTest('Lossless Compression', () => this.testCompressionLossless());
    await this.runTest('Edge Cases', () => this.testCompressionEdgeCases());
    
    // Knowledge Graph Tests
    console.log('\n📊 Knowledge Graph Tests');
    await this.runTest('Triple Addition', () => this.testTripleAddition());
    await this.runTest('Entity Query', () => this.testEntityQuery());
    await this.runTest('Transitive Inference', () => this.testTransitiveInference());
    await this.runTest('Temporal Query', () => this.testTemporalQuery());
    
    // MCP Server Tests
    console.log('\n🔧 MCP Server Tests');
    await this.runTest('Tool Registration', () => this.testMCPToolRegistration());
    await this.runTest('Wing Tool', () => this.testMCPWingTool());
    await this.runTest('Compression Tool', () => this.testMCPCompressionTool());
    
    // Agent Diary Tests
    console.log('\n📔 Agent Diary Tests');
    await this.runTest('Diary Creation', () => this.testAgentDiaryCreation());
    await this.runTest('Entry Types', () => this.testDiaryEntryTypes());
    await this.runTest('Multi-Agent Communication', () => this.testMultiAgentCommunication());
    
    // Tunnel Navigator Tests
    console.log('\n🔀 Tunnel Navigator Tests');
    await this.runTest('Tunnel Creation', () => this.testTunnelCreation());
    await this.runTest('Pathfinding', () => this.testPathfinding());
    await this.runTest('Semantic Bridging', () => this.testSemanticBridging());
    await this.runTest('Multi-Hop Reasoning', () => this.testMultiHopReasoning());
    
    // Integration Tests
    console.log('\n🔗 Integration Tests');
    await this.runTest('Full System Integration', () => this.testFullSystemIntegration());
    await this.runTest('Emergent Intelligence', () => this.testEmergentIntelligence());
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log(`\n✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);
    console.log(`📊 Total: ${this.passed + this.failed}`);
    console.log(`🎯 Success Rate: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(1)}%\n`);
    
    return {
      passed: this.passed,
      failed: this.failed,
      total: this.passed + this.failed,
      results: this.results
    };
  }
}

// Run tests
const suite = new BrainPalaceTestSuite();
suite.runAllTests().catch(console.error);

export { BrainPalaceTestSuite };
