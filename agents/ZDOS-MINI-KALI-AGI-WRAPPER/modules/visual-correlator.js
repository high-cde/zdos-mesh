// visual-correlator.js
// correlazione geotag/timeline con resto OSINT -> leak posizione

class VisualCorrelator {
    correlate(visualOsintData, otherOsintData = {}) {
        let leak_position_risk = "low";
        const issues = [];
        const notes = [];

        if (visualOsintData.geotag) {
            notes.push(`Geotag trovato nell'immagine: Latitudine ${visualOsintData.geotag.latitude}, Longitudine ${visualOsintData.geotag.longitude}`);
            issues.push("L'immagine contiene informazioni di geotag, potenziale fuga di posizione.");
            leak_position_risk = "medium";

            // Example: Correlate geotag with other OSINT data (e.g., WHOIS registrant address)
            if (otherOsintData.whois && otherOsintData.whois.registrant_street) {
                // This would require geocoding the WHOIS address and comparing with image geotag
                notes.push("Potenziale correlazione tra geotag e indirizzo WHOIS.");
            }
        }

        if (visualOsintData.timestamp && otherOsintData.socialOsint && otherOsintData.socialOsint.posts) {
            // Example: Correlate image timestamp with social media posts around the same time/location
            notes.push("Potenziale correlazione tra timestamp dell'immagine e attività sui social media.");
        }

        return {
            leak_position_risk,
            issues,
            notes,
            correlated_data: { visualOsint: visualOsintData, otherOsint: otherOsintData }
        };
    }
}

module.exports = VisualCorrelator;
