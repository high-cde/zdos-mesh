// dns-monitor.js
// Modulo per DNS monitoring (passivo)

class DnsMonitor {
    constructor(executor, parser) {
        this.executor = executor;
        this.parser = parser;
    }

    async monitorDns(interfaceName, durationSeconds = 10) {
        // Uses tcpdump to capture DNS traffic. Requires root privileges.
        const timestamp = Date.now();
        const pcapFile = `/tmp/dns_capture_${timestamp}.pcap`;
        const args = [`-i`, interfaceName, `-c`, String(durationSeconds), `-w`, pcapFile, `udp port 53`];

        try {
            console.log(`Starting DNS monitoring on ${interfaceName} for ${durationSeconds} seconds...`);
            await this.executor.executeCommand("tcpdump", args, (durationSeconds + 5) * 1000);
            console.log(`DNS capture saved to ${pcapFile}`);
            return { pcapFile: pcapFile, message: "DNS capture completed. Analyze with tshark or similar." };
        } catch (error) {
            console.error(`Error during DNS capture: ${error.message}`);
            return { error: error.message };
        }
    }

    async analyzeDnsPcap(pcapFile) {
        // Uses tshark to analyze DNS pcap files.
        const args = [`-r`, pcapFile, `-Tfields`, `-e`, `dns.qry.name`, `-e`, `dns.resp.name`, `-e`, `dns.resp.type`, `-e`, `dns.resp.ttl`];

        try {
            const rawOutput = await this.executor.executeCommand("tshark", args, 60000);
            return this.parser.parse("tshark_dns", rawOutput);
        } catch (error) {
            console.error(`Error during DNS pcap analysis: ${error.message}`);
            return { error: error.message };
        }
    }
}

module.exports = DnsMonitor;
