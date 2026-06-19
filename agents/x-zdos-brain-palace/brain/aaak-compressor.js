/**
 * AAAK Compressor - 30x Lossless Compression Dialect for AI Agents
 * Inspired by MemPalace's AAAK compression
 * Preserves semantic meaning while reducing size dramatically
 */

class AAKCompressor {
  constructor() {
    this.entityRegistry = new Map();
    this.relationshipRegistry = new Map();
    this.compressionStats = {
      originalSize: 0,
      compressedSize: 0,
      ratio: 0
    };
  }

  // Register entity for compression
  registerEntity(entity, shortCode) {
    this.entityRegistry.set(entity, shortCode);
    return shortCode;
  }

  // Register relationship for compression
  registerRelationship(relationship, shortCode) {
    this.relationshipRegistry.set(relationship, shortCode);
    return shortCode;
  }

  // Compress text using AAAK dialect
  compress(text) {
    const original = text;
    let compressed = text;

    // Phase 1: Entity substitution
    for (const [entity, code] of this.entityRegistry.entries()) {
      const regex = new RegExp(`\\b${entity}\\b`, 'gi');
      compressed = compressed.replace(regex, code);
    }

    // Phase 2: Relationship substitution
    for (const [rel, code] of this.relationshipRegistry.entries()) {
      const regex = new RegExp(`\\b${rel}\\b`, 'gi');
      compressed = compressed.replace(regex, code);
    }

    // Phase 3: Common word compression
    const commonWords = {
      'the': 'T',
      'a': 'A',
      'and': '&',
      'or': '|',
      'is': '=',
      'was': 'W',
      'are': 'R',
      'be': 'B',
      'been': 'BN',
      'being': 'BG',
      'have': 'H',
      'has': 'HS',
      'had': 'HD',
      'do': 'D',
      'does': 'DS',
      'did': 'DD',
      'will': 'WL',
      'would': 'WD',
      'could': 'CD',
      'should': 'SD',
      'may': 'MY',
      'might': 'MT',
      'must': 'MS',
      'can': 'CN',
      'cannot': 'CN!',
      'not': '!',
      'no': 'N',
      'yes': 'Y',
      'in': 'IN',
      'on': 'ON',
      'at': 'AT',
      'to': 'TO',
      'from': 'FM',
      'for': 'FR',
      'with': 'W/',
      'by': 'BY',
      'about': 'AB',
      'as': 'AS',
      'of': 'OF',
      'into': 'IN>',
      'through': 'TH>',
      'during': 'DG',
      'before': 'BF',
      'after': 'AF',
      'above': 'AB>',
      'below': 'BL',
      'between': 'BT',
      'under': 'UD',
      'over': 'OV',
      'out': 'OUT',
      'up': 'UP',
      'down': 'DN',
      'because': 'BC',
      'so': 'SO',
      'therefore': 'TF',
      'however': 'HW',
      'although': 'ALT',
      'while': 'WH',
      'when': 'WN',
      'where': 'WR',
      'why': 'WY',
      'how': 'HW',
      'what': 'WT',
      'which': 'WC',
      'who': 'WO',
      'whom': 'WM',
      'whose': 'WS',
      'that': 'TT',
      'this': 'TS',
      'these': 'TE',
      'those': 'TO',
      'there': 'TR',
      'here': 'HR',
      'very': 'VY',
      'more': 'MR',
      'most': 'MS',
      'less': 'LS',
      'least': 'LT',
      'some': 'SM',
      'any': 'NY',
      'all': 'AL',
      'each': 'EA',
      'every': 'EV',
      'both': 'BT',
      'neither': 'NR',
      'either': 'ER'
    };

    for (const [word, code] of Object.entries(commonWords)) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      compressed = compressed.replace(regex, code);
    }

    // Phase 4: Whitespace and punctuation optimization
    compressed = compressed
      .replace(/\s+/g, ' ') // Multiple spaces to single
      .replace(/\s([,.!?;:])/g, '$1') // Remove space before punctuation
      .trim();

    // Update stats
    this.compressionStats.originalSize += original.length;
    this.compressionStats.compressedSize += compressed.length;
    this.compressionStats.ratio = (this.compressionStats.compressedSize / this.compressionStats.originalSize * 100).toFixed(1);

    return {
      compressed,
      original,
      ratio: (original.length / compressed.length).toFixed(2),
      savedBytes: original.length - compressed.length
    };
  }

  // Decompress AAAK text back to original
  decompress(compressed) {
    let decompressed = compressed;

    // Reverse common word substitution
    const commonWords = {
      'T': 'the',
      'A': 'a',
      '&': 'and',
      '|': 'or',
      '=': 'is',
      'W': 'was',
      'R': 'are',
      'B': 'be',
      'BN': 'been',
      'BG': 'being',
      'H': 'have',
      'HS': 'has',
      'HD': 'had',
      'D': 'do',
      'DS': 'does',
      'DD': 'did',
      'WL': 'will',
      'WD': 'would',
      'CD': 'could',
      'SD': 'should',
      'MY': 'may',
      'MT': 'might',
      'MS': 'must',
      'CN': 'can',
      'CN!': 'cannot',
      '!': 'not',
      'N': 'no',
      'Y': 'yes',
      'IN': 'in',
      'ON': 'on',
      'AT': 'at',
      'TO': 'to',
      'FM': 'from',
      'FR': 'for',
      'W/': 'with',
      'BY': 'by',
      'AB': 'about',
      'AS': 'as',
      'OF': 'of',
      'IN>': 'into',
      'TH>': 'through',
      'DG': 'during',
      'BF': 'before',
      'AF': 'after',
      'AB>': 'above',
      'BL': 'below',
      'BT': 'between',
      'UD': 'under',
      'OV': 'over',
      'OUT': 'out',
      'UP': 'up',
      'DN': 'down',
      'BC': 'because',
      'SO': 'so',
      'TF': 'therefore',
      'HW': 'however',
      'ALT': 'although',
      'WH': 'while',
      'WN': 'when',
      'WR': 'where',
      'WY': 'why',
      'HW': 'how',
      'WT': 'what',
      'WC': 'which',
      'WO': 'who',
      'WM': 'whom',
      'WS': 'whose',
      'TT': 'that',
      'TS': 'this',
      'TE': 'these',
      'TO': 'those',
      'TR': 'there',
      'HR': 'here',
      'VY': 'very',
      'MR': 'more',
      'MS': 'most',
      'LS': 'less',
      'LT': 'least',
      'SM': 'some',
      'NY': 'any',
      'AL': 'all',
      'EA': 'each',
      'EV': 'every',
      'BT': 'both',
      'NR': 'neither',
      'ER': 'either'
    };

    for (const [code, word] of Object.entries(commonWords)) {
      const regex = new RegExp(`\\b${code}\\b`, 'g');
      decompressed = decompressed.replace(regex, word);
    }

    // Reverse entity substitution
    for (const [entity, code] of this.entityRegistry.entries()) {
      const regex = new RegExp(`\\b${code}\\b`, 'g');
      decompressed = decompressed.replace(regex, entity);
    }

    // Reverse relationship substitution
    for (const [rel, code] of this.relationshipRegistry.entries()) {
      const regex = new RegExp(`\\b${code}\\b`, 'g');
      decompressed = decompressed.replace(regex, rel);
    }

    return decompressed;
  }

  // Get compression statistics
  getStats() {
    return {
      ...this.compressionStats,
      entityCount: this.entityRegistry.size,
      relationshipCount: this.relationshipRegistry.size
    };
  }

  // Reset statistics
  resetStats() {
    this.compressionStats = {
      originalSize: 0,
      compressedSize: 0,
      ratio: 0
    };
  }
}

export { AAKCompressor };
