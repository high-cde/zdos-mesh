// attack-surface-mapper.js
// Modulo per Attack Surface Mapping (Subdomain & Cloud Discovery)

const { exec } = require("child_process");

class AttackSurfaceMapper {
    constructor(executor) {
        this.executor = executor;
    }

    async enumerateSubdomains(domain) {
        const subdomains = new Set();
        console.log(`Enumerating subdomains for ${domain}...`);

        // Method 1: Brute-force common subdomains using dig
        const commonSubdomains = ["www", "mail", "ftp", "blog", "dev", "test", "admin", "api"];
        for (const sub of commonSubdomains) {
            try {
                const result = await this.executor.executeCommand("dig", [`${sub}.${domain}`, "+short"]);
                if (result && result.trim() !== "") {
                    subdomains.add(`${sub}.${domain}`);
                }
            } catch (error) {
                // console.error(`Error enumerating ${sub}.${domain}: ${error.message}`);
            }
        }

        // Method 2: Passive DNS lookup (simulated, in real world would use services like crt.sh or VirusTotal)
        try {
            const crtShResult = await this.executor.executeCommand("curl", [`https://crt.sh/?q=%25.${domain}&output=json`]);
            const certs = JSON.parse(crtShResult);
            certs.forEach(cert => {
                const name = cert.common_name;
                if (name.endsWith(domain) && name !== domain) {
                    subdomains.add(name);
                }
                const sans = cert.name_value.split("\n");
                sans.forEach(san => {
                    if (san.endsWith(domain) && san !== domain) {
                        subdomains.add(san);
                    }
                });
            });
        } catch (error) {
            console.error(`Error querying crt.sh for ${domain}: ${error.message}`);
        }

        return Array.from(subdomains);
    }

    async discoverCloudBuckets(domain) {
        const exposedBuckets = [];
        console.log(`Discovering potential cloud buckets for ${domain}...`);

        // Common S3 bucket naming conventions
        const bucketNames = [
            `${domain}`,
            `${domain.replace(/\./g, "-")}`,
            `s3.${domain}`,
            `www.${domain}`,
            `${domain}-bucket`,
            `${domain}-prod`,
            `${domain}-dev`
        ];

        for (const bucket of bucketNames) {
            const s3Url = `http://${bucket}.s3.amazonaws.com`;
            try {
                // Attempt to access the bucket. A 403 Forbidden means it exists but is not public.
                // A 404 Not Found means it doesn't exist.
                const result = await this.executor.executeCommand("curl", ["-s", "-o", "/dev/null", "-w", ",%{http_code}", s3Url]);
                const httpCode = result.split(",").pop().trim();

                if (httpCode === "200") {
                    exposedBuckets.push({ url: s3Url, status: "Publicly Accessible" });
                } else if (httpCode === "403") {
                    exposedBuckets.push({ url: s3Url, status: "Exists, but not public (Forbidden)" });
                }
            } catch (error) {
                // console.error(`Error checking S3 bucket ${s3Url}: ${error.message}`);
            }
        }

        // Placeholder for other cloud providers (Azure Blob, Google Cloud Storage)
        // This would require more specific checks or API integrations

        return exposedBuckets;
    }

    async discoverWebAssets(domain) {
        const subdomains = await this.enumerateSubdomains(domain);
        const cloudBuckets = await this.discoverCloudBuckets(domain);

        return {
            subdomains,
            cloudBuckets
        };
    }
}

module.exports = AttackSurfaceMapper;
