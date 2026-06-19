// network-sniffer.js
// Modulo per analisi del traffico di rete (passivo)

class NetworkSniffer {
    constructor(executor, parser) {
        this.executor = executor;
        this.parser = parser;
    }

    async captureTraffic(interfaceName, durationSeconds = 10, filter = "") {
        // Uses tcpdump for packet capture. Requires root privileges.
        // In Termux, tcpdump might need special setup or root.
        // For legal and ethical reasons, this should only be used on networks the user has explicit permission to monitor.
        const timestamp = Date.now();
        const pcapFile = `/tmp/capture_${timestamp}.pcap`;
        const args = [`-i`, interfaceName, `-c`, String(durationSeconds), `-w`, pcapFile];
        if (filter) {
            args.push(filter);
        }

        try {
            console.log(`Starting packet capture on ${interfaceName} for ${durationSeconds} seconds...`);
            // tcpdump will run in background, so we need to wait for it to finish
            await this.executor.executeCommand("tcpdump", args, (durationSeconds + 5) * 1000); // Add 5 seconds buffer
            console.log(`Packet capture saved to ${pcapFile}`);
            return { pcapFile: pcapFile, message: "Packet capture completed. Analyze with tshark or similar." };
        } catch (error) {
            console.error(`Error during packet capture: ${error.message}`);
            return { error: error.message };
        }
    }

    async analyzePcap(pcapFile, displayFilter = "") {
        // Uses tshark to analyze pcap files. Requires tshark to be installed.
        const args = [`-r`, pcapFile, `-Tfields`, `-e`, `frame.number`, `-e`, `ip.src`, `-e`, `ip.dst`, `-e`, `_ws.col.Protocol`, `-e`, `_ws.col.Info`];
        if (displayFilter) {
            args.push(`-Y`, displayFilter);
        }

        try {
            const rawOutput = await this.executor.executeCommand("tshark", args, 60000); // 60 seconds timeout
            return this.parser.parse("tshark_summary", rawOutput);
        } catch (error) {
            console.error(`Error during pcap analysis: ${error.message}`);
            return { error: error.message };
        }
    }
}

module.exports = NetworkSniffer;
