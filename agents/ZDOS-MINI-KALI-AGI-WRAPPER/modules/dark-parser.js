// dark-parser.js
// normalizzazione hit in blacklist / IOC / breach feed

class DarkParser {
    parse(rawData) {
        const normalized = {
            blacklist_hits: [],
            ioc_hits: [],
            breach_hits: []
        };

        if (rawData.blacklist_hits) {
            normalized.blacklist_hits = rawData.blacklist_hits.map(hit => ({
                source: hit.source,
                type: hit.type,
                value: hit.value,
                description: `Found in blacklist from ${hit.source}`
            }));
        }

        if (rawData.ioc_hits) {
            normalized.ioc_hits = rawData.ioc_hits.map(hit => ({
                source: hit.source,
                type: hit.type,
                value: hit.value,
                description: `Identified as Indicator of Compromise from ${hit.source}`
            }));
        }

        if (rawData.breach_hits) {
            normalized.breach_hits = rawData.breach_hits.map(hit => ({
                source: hit.source,
                type: hit.type,
                value: hit.value,
                description: `Found in data breach from ${hit.source}`
            }));
        }

        return normalized;
    }
}

module.exports = DarkParser;
