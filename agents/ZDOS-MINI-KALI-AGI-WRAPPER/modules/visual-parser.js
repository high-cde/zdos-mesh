// visual-parser.js
// estrazione device, timestamp, geotag

class VisualParser {
    parse(exifData) {
        const parsed = {
            device: exifData.device || "N/A",
            model: exifData.model || "N/A",
            timestamp: exifData.timestamp || "N/A",
            geotag: exifData.geotag || null
        };
        return parsed;
    }
}

module.exports = VisualParser;
