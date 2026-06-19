// mail-defense.js
// analisi email (header, SPF/DKIM/DMARC, link sospetti)

class MailDefense {
    async analyze(emailContent) {
        const results = {
            spf_status: "N/A",
            dkim_status: "N/A",
            dmarc_status: "N/A",
            suspicious_links: [],
            phishing_indicators: []
        };

        // Simulate header analysis (in a real scenario, this would involve parsing email headers)
        if (emailContent.includes("Authentication-Results:")) {
            if (emailContent.includes("spf=fail")) results.spf_status = "fail";
            if (emailContent.includes("dkim=fail")) results.dkim_status = "fail";
            if (emailContent.includes("dmarc=fail")) results.dmarc_status = "fail";
        }

        // Simulate link extraction and suspicion check
        const linkRegex = /(https?:\[^\]\s]+)/g;
        let match;
        while ((match = linkRegex.exec(emailContent)) !== null) {
            const link = match[1];
            // Simple check for suspicious links (e.g., IP addresses instead of domains, known malicious domains)
            if (link.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/) || link.includes("malicious-site.com")) {
                results.suspicious_links.push(link);
            }
        }

        // Simulate other phishing indicators
        if (emailContent.includes("urgent action required") || emailContent.includes("verify your account")) {
            results.phishing_indicators.push("Urgency/Account Verification keywords");
        }

        return results;
    }
}

module.exports = MailDefense;
