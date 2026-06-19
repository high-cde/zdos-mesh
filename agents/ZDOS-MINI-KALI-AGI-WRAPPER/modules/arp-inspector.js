// arp-inspector.js
// Modulo per ARP inspection (passivo)

class ArpInspector {
    constructor(executor, parser) {
        this.executor = executor;
        this.parser = parser;
    }

    async monitorArp(interfaceName, durationSeconds = 10) {
        // Uses tcpdump to capture ARP traffic. Requires root privileges.
        const timestamp = Date.now();
        const pcapFile = `/tmp/arp_capture_${timestamp}.pcap`;
        const args = [`-i`, interfaceName, `-c`, String(durationSeconds), `-w`, pcapFile, `arp`];

        try {
            console.log(`Starting ARP monitoring on ${interfaceName} for ${durationSeconds} seconds...`);
            await this.executor.executeCommand("tcpdump", args, (durationSeconds + 5) * 1000);
            console.log(`ARP capture saved to ${pcapFile}`);
            return { pcapFile: pcapFile, message: "ARP capture completed. Analyze with tshark or similar." };
        } catch (error) {
            console.error(`Error during ARP capture: ${error.message}`);
            return { error: error.message };
        }
    }

    async analyzeArpPcap(pcapFile) {
        // Uses tshark to analyze ARP pcap files.
        const args = [`-r`, pcapFile, `-Tfields`, `-e`, `arp.opcode`, `-e`, `arp.src.hw_mac`, `-e`, `arp.src.proto_ipv4`, `-e`, `arp.dst.hw_mac`, `-e`, `arp.dst.proto_ipv4`];

        try {
            const rawOutput = await this.executor.executeCommand("tshark", args, 60000);
            return this.parser.parse("tshark_arp", rawOutput);
        } catch (error) {
            console.error(`Error during ARP pcap analysis: ${error.message}`);
            return { error: error.message };
        }
    }
}

module.exports = ArpInspector;
