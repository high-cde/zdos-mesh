// osint-parser.js
// normalizzazione OSINT -> JSON (whois, dns, certs, ipinfo, history)

class OsintParser {
    parseWhois(rawWhois) {
        const parsed = {};
        rawWhois.split("\n").forEach(line => {
            const parts = line.split(":", 2);
            if (parts.length === 2) {
                const key = parts[0].trim().toLowerCase().replace(/\s+/g, ".");
                parsed[key] = parts[1].trim();
            }
        });
        return parsed;
    }

    parseDns(rawDns) {
        const parsed = { A: [], MX: [], NS: [], TXT: [] };
        rawDns.split("\n").forEach(line => {
            if (line.includes(" IN A ")) {
                parsed.A.push(line.split(" IN A ")[1].trim());
            } else if (line.includes(" IN MX ")) {
                parsed.MX.push(line.split(" IN MX ")[1].trim());
            } else if (line.includes(" IN NS ")) {
                parsed.NS.push(line.split(" IN NS ")[1].trim());
            } else if (line.includes(" IN TXT ")) {
                parsed.TXT.push(line.split(" IN TXT ")[1].trim());
            }
        });
        return parsed;
    }

    parseCrtSh(rawCrtSh) {
        // This would typically parse JSON from crt.sh API or similar
        return { certificates: rawCrtSh }; // Placeholder
    }

    parseIpInfo(rawIpInfo) {
        // This would typically parse JSON from ipinfo.io API or similar
        return { ip_details: rawIpInfo }; // Placeholder
    }

    parseWayback(rawWayback) {
        // This would typically parse JSON from Wayback Machine API or similar
        return { history: rawWayback }; // Placeholder
    }

    parse(type, rawData) {
        switch (type) {
            case "whois": return this.parseWhois(rawData);
            case "dns": return this.parseDns(rawData);
            case "crtsh": return this.parseCrtSh(rawData);
            case "ipinfo": return this.parseIpInfo(rawData);
            case "wayback": return this.parseWayback(rawData);
            default: return { raw: rawData };
        }
    }
}

module.exports = OsintParser;
