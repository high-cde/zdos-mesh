// parser.js
// Converte output tecnico (nmap, curl -I, whois, openssl) in JSON

class Parser {
    parseNmap(rawOutput) {
        const ports = [];
        const services = [];
        // Basic Nmap parsing for demonstration. Real parsing would be more complex.
        const portServiceRegex = /(\d+)\/tcp\s+open\s+(\S+)/g;
        let match;
        while ((match = portServiceRegex.exec(rawOutput)) !== null) {
            ports.push(parseInt(match[1]));
            services.push(match[2]);
        }
        return { ports, services };
    }

    parseCurlHeaders(rawOutput) {
        const headers = {};
        rawOutput.split("\n").forEach(line => {
            const parts = line.split(": ", 2);
            if (parts.length === 2) {
                headers[parts[0].toLowerCase()] = parts[1].trim();
            }
        });
        return headers;
    }

    parseWhois(rawOutput) {
        const whoisData = {};
        // Basic WHOIS parsing. Real parsing would be more complex.
        rawOutput.split("\n").forEach(line => {
            const parts = line.split(":", 2);
            if (parts.length === 2) {
                const key = parts[0].trim().replace(/\s+/g, ".").toLowerCase();
                whoisData[key] = parts[1].trim();
            }
        });
        return whoisData;
    }

    parseOpenssl(rawOutput) {
        const tlsData = {};
        // Basic OpenSSL parsing for TLS info. Real parsing would be more complex.
        const subjectRegex = /Subject:.*?CN\s*=\s*([^\/]+)/;
        const issuerRegex = /Issuer:.*?CN\s*=\s*([^\/]+)/;
        const validFromRegex = /Not Before:\s*(.*)/;
        const validToRegex = /Not After\s*:\s*(.*)/;

        let match;
        if ((match = rawOutput.match(subjectRegex))) {
            tlsData.subjectCN = match[1];
        }
        if ((match = rawOutput.match(issuerRegex))) {
            tlsData.issuerCN = match[1];
        }
        if ((match = rawOutput.match(validFromRegex))) {
            tlsData.validFrom = match[1];
        }
        if ((match = rawOutput.match(validToRegex))) {
            tlsData.validTo = match[1];
        }

        return tlsData;
    }

    parseGobusterOutput(rawOutput) {
        const results = {
            directories: [],
            vhosts: [],
            statusCodes: {}
        };

        rawOutput.split('\n').forEach(line => {
            // Parse Gobuster output format: /path (Status: 200)
            const dirMatch = line.match(/^(\S+)\s+\(Status:\s*(\d+)\)/);
            if (dirMatch) {
                results.directories.push({
                    path: dirMatch[1],
                    statusCode: parseInt(dirMatch[2])
                });
                results.statusCodes[dirMatch[2]] = (results.statusCodes[dirMatch[2]] || 0) + 1;
            }
            // Parse vhost output format: Found: example.com (Status: 200)
            const vhostMatch = line.match(/Found:\s*(\S+)\s+\(Status:\s*(\d+)\)/);
            if (vhostMatch) {
                results.vhosts.push({
                    vhost: vhostMatch[1],
                    statusCode: parseInt(vhostMatch[2])
                });
            }
        });

        return results;
    }

    parseTsharkSummary(rawOutput) {
        const summary = {
            packets: 0,
            protocols: {},
            conversations: []
        };

        rawOutput.split('\n').forEach(line => {
            // Parse packet count
            const packetMatch = line.match(/^(\d+)\s+packets/);
            if (packetMatch) {
                summary.packets = parseInt(packetMatch[1]);
            }
            // Parse protocol statistics
            const protocolMatch = line.match(/^\s*(\w+)\s+(\d+)\s+packets/);
            if (protocolMatch) {
                summary.protocols[protocolMatch[1]] = parseInt(protocolMatch[2]);
            }
        });

        return summary;
    }

    parseTsharkArp(rawOutput) {
        const arpData = {
            requests: [],
            replies: [],
            anomalies: []
        };

        rawOutput.split('\n').forEach(line => {
            // Parse ARP request: Who has 192.168.1.1? Tell 192.168.1.100
            const requestMatch = line.match(/Who has ([\d.]+)\? Tell ([\d.]+)/);
            if (requestMatch) {
                arpData.requests.push({
                    targetIp: requestMatch[1],
                    senderIp: requestMatch[2]
                });
            }
            // Parse ARP reply: 192.168.1.1 is at aa:bb:cc:dd:ee:ff
            const replyMatch = line.match(/([\d.]+) is at ([0-9a-f:]+)/i);
            if (replyMatch) {
                arpData.replies.push({
                    ip: replyMatch[1],
                    mac: replyMatch[2]
                });
            }
            // Detect potential ARP spoofing
            if (line.includes('gratuitous') || line.includes('unsolicited')) {
                arpData.anomalies.push({
                    type: 'suspicious_arp',
                    line: line.trim()
                });
            }
        });

        return arpData;
    }

    parseTsharkDns(rawOutput) {
        const dnsData = {
            queries: [],
            responses: [],
            anomalies: []
        };

        rawOutput.split('\n').forEach(line => {
            // Parse DNS query: example.com A?
            const queryMatch = line.match(/^([\w.]+)\s+([A-Z]+)\?/);
            if (queryMatch) {
                dnsData.queries.push({
                    domain: queryMatch[1],
                    type: queryMatch[2]
                });
            }
            // Parse DNS response: example.com A 192.168.1.1
            const responseMatch = line.match(/^([\w.]+)\s+([A-Z]+)\s+([\d.]+|[0-9a-f:]+)/);
            if (responseMatch) {
                dnsData.responses.push({
                    domain: responseMatch[1],
                    type: responseMatch[2],
                    answer: responseMatch[3]
                });
            }
            // Detect DNS anomalies (NXDOMAIN, timeouts, etc.)
            if (line.includes('NXDOMAIN') || line.includes('SERVFAIL') || line.includes('TIMEOUT')) {
                dnsData.anomalies.push({
                    type: 'dns_error',
                    line: line.trim()
                });
            }
        });

        return dnsData;
    }

    // Generic parse method to dispatch to specific parsers
    parse(toolName, rawOutput) {
        switch (toolName) {
            case "nmap":
                return this.parseNmap(rawOutput);
            case "curl_headers":
                return this.parseCurlHeaders(rawOutput);
            case "whois":
                return this.parseWhois(rawOutput);
            case "openssl":
                return this.parseOpenssl(rawOutput);
            case "gobuster":
                return this.parseGobusterOutput(rawOutput);
            case "tshark_summary":
                return this.parseTsharkSummary(rawOutput);
            case "tshark_arp":
                return this.parseTsharkArp(rawOutput);
            case "tshark_dns":
                return this.parseTsharkDns(rawOutput);
            default:
                console.warn(`No parser found for tool: ${toolName}`);
                return { raw: rawOutput };
        }
    }
}

module.exports = Parser;
