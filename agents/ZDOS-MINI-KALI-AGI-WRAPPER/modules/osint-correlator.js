// osint-correlator.js
// correlazione OSINT + Recon -> exposure score

class OsintCorrelator {
    correlate(osintData, reconData = {}) {
        let exposureScore = 0;
        const issues = [];
        const notes = [];

        // Example correlation logic
        if (osintData.whois && osintData.whois.registrant_email) {
            notes.push(`Registrant email found in WHOIS: ${osintData.whois.registrant_email}`);
            exposureScore += 10; // Public email increases exposure
        }

        if (osintData.dns && osintData.dns.MX && osintData.dns.MX.length > 0) {
            notes.push(`Mail Exchange records found: ${osintData.dns.MX.join(", ")}`);
        }

        // If reconData is available, correlate with OSINT
        if (reconData.ports && reconData.ports.length > 0) {
            // Example: Check if any open ports correspond to services mentioned in OSINT
            // This would require more advanced logic to map services to ports
            notes.push("Recon data available for further correlation.");
        }

        // Placeholder for more advanced OSINT correlation
        // e.g., correlating historical data from Wayback Machine with current configurations
        // e.g., identifying subdomains from DNS records and checking their status

        return {
            exposure_score: exposureScore,
            issues,
            notes,
            correlated_data: { osint: osintData, recon: reconData }
        };
    }
}

module.exports = OsintCorrelator;
