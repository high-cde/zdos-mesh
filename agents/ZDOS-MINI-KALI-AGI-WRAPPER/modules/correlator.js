// correlator.js
// Correlazione Recon + TLS + WHOIS + DNS -> risk map

class Correlator {
    correlateRecon(nmapData, whoisData, tlsData = {}) {
        let risk_level = "low";
        const issues = [];
        const notes = [];

        // Example correlation logic
        if (nmapData.ports && nmapData.ports.length > 0) {
            notes.push(`Found ${nmapData.ports.length} open ports.`);
            if (nmapData.ports.some(p => [21, 22, 23, 80, 443, 3389].includes(p))) { // Common risky ports
                risk_level = "medium";
                issues.push("Common service ports are open, increasing attack surface.");
            }
        }

        if (whoisData.domain_name && !whoisData.domain_name.includes("privateregistration")) {
            notes.push(`WHOIS data is publicly visible for domain: ${whoisData.domain_name}`);
            issues.push("Domain WHOIS information is public, potentially exposing registrant details.");
        }

        if (tlsData.validTo) {
            const validToDate = new Date(tlsData.validTo);
            const now = new Date();
            const daysUntilExpiry = Math.ceil((validToDate - now) / (1000 * 60 * 60 * 24));
            if (daysUntilExpiry < 30) {
                risk_level = "medium";
                issues.push(`SSL certificate expires in ${daysUntilExpiry} days. Renew soon.`);
            }
        }

        // More sophisticated correlation logic would go here
        // e.g., correlating open ports with known vulnerabilities, analyzing TLS configurations, etc.

        return {
            risk_level,
            issues,
            notes,
            correlated_data: { nmap: nmapData, whois: whoisData, tls: tlsData }
        };
    }

    // Placeholder for OSINT correlation
    correlateOsint(osintData) {
        let exposure_score = 0;
        const issues = [];
        const notes = [];

        if (osintData.public_repos && osintData.public_repos.length > 0) {
            exposure_score += 20;
            issues.push("Public code repositories found, potential for sensitive information exposure.");
        }
        if (osintData.breach_hits && osintData.breach_hits.length > 0) {
            exposure_score += 50;
            issues.push("Credentials or data found in public breaches.");
            risk_level = "high";
        }

        return {
            exposure_score,
            issues,
            notes,
            correlated_data: osintData
        };
    }

    // Placeholder for Social OSINT correlation
    correlateSocialFootprint(socialOsintData, reconData) {
        let risk_level = "low";
        const issues = [];
        const notes = [];

        if (socialOsintData.tech_stack && socialOsintData.tech_stack.length > 0) {
            notes.push(`Identified tech stack: ${socialOsintData.tech_stack.join(", ")}`);
        }

        // Example: if public repos expose vulnerable tech stack versions found in recon
        if (socialOsintData.public_repos && reconData.services) {
            // This would require more advanced logic to compare versions and known vulnerabilities
            issues.push("Potential for correlating public code with exposed services.");
        }

        return {
            risk_level,
            issues,
            notes,
            correlated_data: { socialOsint: socialOsintData, recon: reconData }
        };
    }

    // Placeholder for Dark OSINT correlation
    correlateDarkOsint(darkOsintData) {
        let reputational_risk = "low";
        const issues = [];
        const notes = [];

        if (darkOsintData.blacklist_hits && darkOsintData.blacklist_hits.length > 0) {
            reputational_risk = "high";
            issues.push("Domain/IP found in blacklists or IOC feeds.");
        }

        return {
            reputational_risk,
            issues,
            notes,
            correlated_data: darkOsintData
        };
    }

    // Placeholder for Visual OSINT correlation
    correlateVisualOsint(visualOsintData, otherOsintData) {
        let leak_position_risk = "low";
        const issues = [];
        const notes = [];

        if (visualOsintData.geotag) {
            notes.push(`Geotag found in image: ${visualOsintData.geotag}`);
            // Correlate with other OSINT data to see if it reveals sensitive locations
            issues.push("Image contains geotag information, potential location leak.");
            leak_position_risk = "medium";
        }

        return {
            leak_position_risk,
            issues,
            notes,
            correlated_data: { visualOsint: visualOsintData, otherOsint: otherOsintData }
        };
    }

    // Placeholder for Mail Defense correlation
    correlateMailDefense(mailData) {
        let phishing_likelihood = "low";
        const issues = [];
        const notes = [];

        if (mailData.spf_fail || mailData.dkim_fail || mailData.dmarc_fail) {
            phishing_likelihood = "high";
            issues.push("SPF, DKIM, or DMARC failure detected, indicating potential spoofing.");
        }
        if (mailData.suspicious_links && mailData.suspicious_links.length > 0) {
            phishing_likelihood = "high";
            issues.push("Suspicious links found in email content.");
        }

        return {
            phishing_likelihood,
            issues,
            notes,
            correlated_data: mailData
        };
    }

    // Placeholder for Cookie Audit correlation
    correlateCookieAudit(cookieData) {
        let session_hijacking_risk = "low";
        const issues = [];
        const notes = [];

        if (!cookieData.secure || !cookieData.httponly) {
            session_hijacking_risk = "high";
            issues.push("Insecure cookie flags (Secure/HttpOnly) detected, increasing session hijacking risk.");
        }

        return {
            session_hijacking_risk,
            issues,
            notes,
            correlated_data: cookieData
        };
    }

    // Placeholder for SE Awareness correlation
    correlateSEAwareness(seData) {
        let se_risk_level = "low";
        const issues = [];
        const notes = [];

        if (seData.social_engineering_patterns && seData.social_engineering_patterns.length > 0) {
            se_risk_level = "high";
            issues.push("Social engineering patterns detected in text content.");
        }

        return {
            se_risk_level,
            issues,
            notes,
            correlated_data: seData
        };
    }
}

module.exports = Correlator;
