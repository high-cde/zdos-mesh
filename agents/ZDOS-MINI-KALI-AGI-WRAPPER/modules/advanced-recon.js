// advanced-recon.js
// Modulo per recon attivo avanzato (Nmap stealth, service detection)

class AdvancedRecon {
    constructor(executor, parser) {
        this.executor = executor;
        this.parser = parser;
    }

    async nmapScan(target, scanType = "-sV") {
        // -sV: Probe open ports to determine service/version info
        // -sS: SYN scan (stealthy)
        // -O: OS detection
        // -p-: Scan all ports
        const args = [scanType, target];
        try {
            const rawOutput = await this.executor.executeCommand("nmap", args);
            return this.parser.parse("nmap", rawOutput);
        } catch (error) {
            console.error(`Error during Nmap scan for ${target}: ${error.message}`);
            return { error: error.message };
        }
    }

    async bannerGrabbing(target, port) {
        // Use netcat or curl to grab banners
        // For simplicity, we'll use curl for HTTP/HTTPS banners
        // Determine protocol based on port
        const protocol = port === 443 ? 'https' : 'http';
        const url = `${protocol}://${target}:${port}`;
        try {
            const rawOutput = await this.executor.executeCommand("curl", ["-I", url, "--max-time", "5", "-k"]);
            return this.parser.parse("curl_headers", rawOutput);
        } catch (error) {
            console.error(`Error during banner grabbing for ${target}:${port}: ${error.message}`);
            return { error: error.message };
        }
    }

    async sslAudit(target, port = 443) {
        // Use openssl to get TLS/SSL certificate information
        const args = ["s_client", "-connect", `${target}:${port}`, "-servername", target];
        try {
            const rawOutput = await this.executor.executeCommand("openssl", args);
            return this.parser.parse("openssl", rawOutput);
        } catch (error) {
            console.error(`Error during SSL audit for ${target}:${port}: ${error.message}`);
            return { error: error.message };
        }
    }
}

module.exports = AdvancedRecon;
