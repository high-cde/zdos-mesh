// social-correlator.js
// correlazione social footprint + Recon -> rischio esposizione

class SocialCorrelator {
    correlate(socialOsintData, reconData = {}) {
        let risk_exposure = "low";
        const issues = [];
        const notes = [];

        if (socialOsintData.technical_exposure && socialOsintData.technical_exposure.email) {
            notes.push(`Email esposta pubblicamente: ${socialOsintData.technical_exposure.email}`);
            risk_exposure = "medium";
            issues.push("Indirizzo email esposto pubblicamente, potenziale per attacchi di phishing mirati.");
        }

        if (socialOsintData.public_repos && socialOsintData.public_repos.length > 0) {
            notes.push(`Trovati ${socialOsintData.public_repos.length} repository pubblici.`);
            // Further logic to check for sensitive info in repos or outdated dependencies
            issues.push("Repository pubblici potrebbero contenere informazioni sensibili o dipendenze vulnerabili.");
            risk_exposure = "medium";
        }

        // Example: Correlate exposed tech stack with recon data
        if (socialOsintData.tech_stack && reconData.services) {
            const commonTech = socialOsintData.tech_stack.filter(tech => 
                reconData.services.some(service => service.toLowerCase().includes(tech.toLowerCase()))
            );
            if (commonTech.length > 0) {
                notes.push(`Tecnologie comuni tra OSINT sociale e servizi esposti: ${commonTech.join(", ")}`);
                issues.push("Tecnologie esposte pubblicamente corrispondono a servizi attivi, aumentando la superficie di attacco.");
                risk_exposure = "high";
            }
        }

        return {
            risk_exposure,
            issues,
            notes,
            correlated_data: { socialOsint: socialOsintData, recon: reconData }
        };
    }
}

module.exports = SocialCorrelator;
