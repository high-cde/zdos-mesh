/**
 * ZDOS Brain Palace Persistence
 * Salvataggio, caricamento e backup del sistema neuromorfico
 */

import fs from 'fs/promises';
import path from 'path';
import zlib from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

class BrainPalacePersistence {
  constructor(storagePath = './brain-palace-storage') {
    this.storagePath = storagePath;
    this.backupPath = path.join(storagePath, 'backups');
    this.checksums = new Map();
  }

  // ========== INITIALIZATION ==========

  async initialize() {
    try {
      await fs.mkdir(this.storagePath, { recursive: true });
      await fs.mkdir(this.backupPath, { recursive: true });
      console.log(`✅ Brain Palace storage initialized at ${this.storagePath}`);
    } catch (error) {
      console.error(`❌ Failed to initialize storage: ${error.message}`);
      throw error;
    }
  }

  // ========== SAVE OPERATIONS ==========

  async savePalace(palace, filename = 'palace-state.json.gz') {
    try {
      const data = palace.export();
      const json = JSON.stringify(data, null, 2);
      const compressed = await gzip(json);

      const filepath = path.join(this.storagePath, filename);
      await fs.writeFile(filepath, compressed);

      // Calculate checksum
      const checksum = this.calculateChecksum(compressed);
      this.checksums.set(filename, checksum);

      console.log(`✅ Palace saved: ${filename} (${compressed.length} bytes)`);
      return filepath;
    } catch (error) {
      console.error(`❌ Failed to save palace: ${error.message}`);
      throw error;
    }
  }

  async saveWings(wingManager, filename = 'wings.json.gz') {
    try {
      const data = wingManager.exportPalace();
      const json = JSON.stringify(data, null, 2);
      const compressed = await gzip(json);

      const filepath = path.join(this.storagePath, filename);
      await fs.writeFile(filepath, compressed);

      console.log(`✅ Wings saved: ${filename}`);
      return filepath;
    } catch (error) {
      console.error(`❌ Failed to save wings: ${error.message}`);
      throw error;
    }
  }

  async saveKnowledgeGraph(kg, filename = 'knowledge-graph.json.gz') {
    try {
      const data = kg.export();
      const json = JSON.stringify(data, null, 2);
      const compressed = await gzip(json);

      const filepath = path.join(this.storagePath, filename);
      await fs.writeFile(filepath, compressed);

      console.log(`✅ Knowledge Graph saved: ${filename}`);
      return filepath;
    } catch (error) {
      console.error(`❌ Failed to save knowledge graph: ${error.message}`);
      throw error;
    }
  }

  async saveAgents(diaryManager, filename = 'agents.json.gz') {
    try {
      const data = diaryManager.exportAll();
      const json = JSON.stringify(data, null, 2);
      const compressed = await gzip(json);

      const filepath = path.join(this.storagePath, filename);
      await fs.writeFile(filepath, compressed);

      console.log(`✅ Agents saved: ${filename}`);
      return filepath;
    } catch (error) {
      console.error(`❌ Failed to save agents: ${error.message}`);
      throw error;
    }
  }

  async saveTunnels(tunnelNavigator, filename = 'tunnels.json.gz') {
    try {
      const data = tunnelNavigator.export();
      const json = JSON.stringify(data, null, 2);
      const compressed = await gzip(json);

      const filepath = path.join(this.storagePath, filename);
      await fs.writeFile(filepath, compressed);

      console.log(`✅ Tunnels saved: ${filename}`);
      return filepath;
    } catch (error) {
      console.error(`❌ Failed to save tunnels: ${error.message}`);
      throw error;
    }
  }

  // ========== LOAD OPERATIONS ==========

  async loadPalace(filename = 'palace-state.json.gz') {
    try {
      const filepath = path.join(this.storagePath, filename);
      const compressed = await fs.readFile(filepath);
      const json = await gunzip(compressed);
      const data = JSON.parse(json.toString());

      // Verify checksum
      const checksum = this.calculateChecksum(compressed);
      const storedChecksum = this.checksums.get(filename);
      if (storedChecksum && checksum !== storedChecksum) {
        console.warn(`⚠️ Checksum mismatch for ${filename}`);
      }

      console.log(`✅ Palace loaded: ${filename}`);
      return data;
    } catch (error) {
      console.error(`❌ Failed to load palace: ${error.message}`);
      throw error;
    }
  }

  async loadWings(filename = 'wings.json.gz') {
    try {
      const filepath = path.join(this.storagePath, filename);
      const compressed = await fs.readFile(filepath);
      const json = await gunzip(compressed);
      const data = JSON.parse(json.toString());

      console.log(`✅ Wings loaded: ${filename}`);
      return data;
    } catch (error) {
      console.error(`❌ Failed to load wings: ${error.message}`);
      throw error;
    }
  }

  async loadKnowledgeGraph(filename = 'knowledge-graph.json.gz') {
    try {
      const filepath = path.join(this.storagePath, filename);
      const compressed = await fs.readFile(filepath);
      const json = await gunzip(compressed);
      const data = JSON.parse(json.toString());

      console.log(`✅ Knowledge Graph loaded: ${filename}`);
      return data;
    } catch (error) {
      console.error(`❌ Failed to load knowledge graph: ${error.message}`);
      throw error;
    }
  }

  async loadAgents(filename = 'agents.json.gz') {
    try {
      const filepath = path.join(this.storagePath, filename);
      const compressed = await fs.readFile(filepath);
      const json = await gunzip(compressed);
      const data = JSON.parse(json.toString());

      console.log(`✅ Agents loaded: ${filename}`);
      return data;
    } catch (error) {
      console.error(`❌ Failed to load agents: ${error.message}`);
      throw error;
    }
  }

  async loadTunnels(filename = 'tunnels.json.gz') {
    try {
      const filepath = path.join(this.storagePath, filename);
      const compressed = await fs.readFile(filepath);
      const json = await gunzip(compressed);
      const data = JSON.parse(json.toString());

      console.log(`✅ Tunnels loaded: ${filename}`);
      return data;
    } catch (error) {
      console.error(`❌ Failed to load tunnels: ${error.message}`);
      throw error;
    }
  }

  // ========== BACKUP OPERATIONS ==========

  async createBackup(palace, label = '') {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupName = `backup-${timestamp}${label ? '-' + label : ''}`;
      const backupDir = path.join(this.backupPath, backupName);

      await fs.mkdir(backupDir, { recursive: true });

      // Save all components
      const data = palace.export();
      const json = JSON.stringify(data, null, 2);
      const compressed = await gzip(json);

      const filepath = path.join(backupDir, 'full-backup.json.gz');
      await fs.writeFile(filepath, compressed);

      // Save metadata
      const metadata = {
        timestamp: Date.now(),
        label,
        size: compressed.length,
        components: {
          wings: data.wings ? Object.keys(data.wings).length : 0,
          triples: data.knowledgeGraph ? data.knowledgeGraph.triples.length : 0,
          agents: data.agents ? Object.keys(data.agents).length : 0,
          tunnels: data.tunnels ? data.tunnels.length : 0
        }
      };

      await fs.writeFile(
        path.join(backupDir, 'metadata.json'),
        JSON.stringify(metadata, null, 2)
      );

      console.log(`✅ Backup created: ${backupName}`);
      return backupDir;
    } catch (error) {
      console.error(`❌ Failed to create backup: ${error.message}`);
      throw error;
    }
  }

  async listBackups() {
    try {
      const backups = await fs.readdir(this.backupPath);
      const backupInfo = [];

      for (const backup of backups) {
        const metadataPath = path.join(this.backupPath, backup, 'metadata.json');
        try {
          const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8'));
          backupInfo.push({
            name: backup,
            ...metadata
          });
        } catch (e) {
          // Skip backups without metadata
        }
      }

      return backupInfo.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error(`❌ Failed to list backups: ${error.message}`);
      return [];
    }
  }

  async restoreBackup(backupName) {
    try {
      const backupPath = path.join(this.backupPath, backupName, 'full-backup.json.gz');
      const compressed = await fs.readFile(backupPath);
      const json = await gunzip(compressed);
      const data = JSON.parse(json.toString());

      console.log(`✅ Backup restored: ${backupName}`);
      return data;
    } catch (error) {
      console.error(`❌ Failed to restore backup: ${error.message}`);
      throw error;
    }
  }

  // ========== EXPORT OPERATIONS ==========

  async exportJSON(palace, filename = 'palace-export.json') {
    try {
      const data = palace.export();
      const json = JSON.stringify(data, null, 2);

      const filepath = path.join(this.storagePath, filename);
      await fs.writeFile(filepath, json);

      console.log(`✅ Palace exported to JSON: ${filename}`);
      return filepath;
    } catch (error) {
      console.error(`❌ Failed to export JSON: ${error.message}`);
      throw error;
    }
  }

  async exportCSV(palace, filename = 'palace-export.csv') {
    try {
      const data = palace.export();
      let csv = 'Type,ID,Name,Value\n';

      // Export wings
      for (const [wingId, wing] of Object.entries(data.wings || {})) {
        csv += `Wing,${wingId},${wing.name || 'N/A'},${wing.rooms ? Object.keys(wing.rooms).length : 0}\n`;
      }

      // Export triples
      for (const triple of data.knowledgeGraph?.triples || []) {
        csv += `Triple,${triple.entity1},${triple.relationship},${triple.entity2}\n`;
      }

      // Export agents
      for (const [agentId, agent] of Object.entries(data.agents || {})) {
        csv += `Agent,${agentId},${agent.name || 'N/A'},${agent.entries ? agent.entries.length : 0}\n`;
      }

      const filepath = path.join(this.storagePath, filename);
      await fs.writeFile(filepath, csv);

      console.log(`✅ Palace exported to CSV: ${filename}`);
      return filepath;
    } catch (error) {
      console.error(`❌ Failed to export CSV: ${error.message}`);
      throw error;
    }
  }

  // ========== UTILITY FUNCTIONS ==========

  calculateChecksum(data) {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data[i];
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  async getStorageStats() {
    try {
      const files = await fs.readdir(this.storagePath);
      let totalSize = 0;

      for (const file of files) {
        const filepath = path.join(this.storagePath, file);
        const stat = await fs.stat(filepath);
        if (stat.isFile()) {
          totalSize += stat.size;
        }
      }

      const backups = await this.listBackups();

      return {
        storagePath: this.storagePath,
        files: files.length,
        totalSize,
        totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
        backups: backups.length,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error(`❌ Failed to get storage stats: ${error.message}`);
      return null;
    }
  }

  async cleanup(maxAge = 30 * 24 * 60 * 60 * 1000) {
    try {
      const backups = await this.listBackups();
      const now = Date.now();
      let deleted = 0;

      for (const backup of backups) {
        if (now - backup.timestamp > maxAge) {
          const backupPath = path.join(this.backupPath, backup.name);
          await fs.rm(backupPath, { recursive: true });
          deleted++;
        }
      }

      console.log(`✅ Cleanup completed: ${deleted} old backups removed`);
      return deleted;
    } catch (error) {
      console.error(`❌ Failed to cleanup: ${error.message}`);
      throw error;
    }
  }
}

export { BrainPalacePersistence };
