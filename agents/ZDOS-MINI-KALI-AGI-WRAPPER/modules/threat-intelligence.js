// threat-intelligence.js
// Integrazione con feed di Threat Intelligence (AbuseIPDB, OTX)

const axios = require("axios");

class ThreatIntelligence {
    constructor() {
        // API keys would be loaded from environment variables or a secure config
        this.abuseIpDbApiKey = process.env.ABUSEIPDB_API_KEY || "YOUR_ABUSEIPDB_API_KEY";
        this.otxApiKey = process.env.OTX_API_KEY || "YOUR_OTX_API_KEY";
    }

    async lookup(indicator) {
        const results = {
            isMalicious: false,
            sources: []
        };

        // Try to determine if it's an IP or a domain
        const isIp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(indicator);

        if (isIp) {
            // AbuseIPDB lookup for IP addresses
            try {
                const response = await axios.get(`https://api.abuseipdb.com/api/v2/check?ipAddress=${indicator}&maxAgeInDays=90`, {
                    headers: {
                        Key: this.abuseIpDbApiKey,
                        Accept: "application/json"
                    }
                });
                const data = response.data.data;
                if (data.abuseConfidenceScore > 50) {
                    results.isMalicious = true;
                    results.sources.push({ name: "AbuseIPDB", score: data.abuseConfidenceScore, report: data });
                }
            } catch (error) {
                console.error(`Error looking up ${indicator} on AbuseIPDB: ${error.message}`);
            }
        }

        // OTX (AlienVault Open Threat Exchange) lookup for both IPs and domains
        try {
            // Determine the correct endpoint based on indicator type
            const indicatorType = isIp ? 'IPv4' : 'domain';
            const response = await axios.get(`https://otx.alienvault.com/api/v1/indicators/${indicatorType}/${indicator}/general`, {
                headers: {
                    "X-OTX-API-KEY": this.otxApiKey
                }
            });
            const data = response.data;
            if (data.pulse_info && data.pulse_info.count > 0) {
                results.isMalicious = true;
                results.sources.push({ name: "AlienVault OTX", pulses: data.pulse_info.pulses, report: data });
            }
        } catch (error) {
            console.error(`Error looking up ${indicator} on AlienVault OTX: ${error.message}`);
        }

        return results;
    }
}

module.exports = ThreatIntelligence;
