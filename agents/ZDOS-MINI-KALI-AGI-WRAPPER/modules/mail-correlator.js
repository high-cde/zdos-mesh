// mail-correlator.js
// rischio phishing + suggerimenti difensivi

class MailCorrelator {
    correlate(mailData) {
        let phishing_likelihood = "low";
        const issues = [];
        const defensive_suggestions = [];

        if (mailData.spf_status === "fail" || mailData.dkim_status === "fail" || mailData.dmarc_status === "fail") {
            phishing_likelihood = "high";
            issues.push("Fallimento SPF/DKIM/DMARC: L'email potrebbe essere spoofata.");
            defensive_suggestions.push("Non rispondere all'email. Segnala come phishing.");
        }

        if (mailData.suspicious_links && mailData.suspicious_links.length > 0) {
            phishing_likelihood = "high";
            issues.push("Link sospetti rilevati: Non cliccare su questi link.");
            defensive_suggestions.push("Verifica l'autenticità del mittente prima di interagire con i link.");
        }

        if (mailData.phishing_indicators && mailData.phishing_indicators.length > 0) {
            if (phishing_likelihood === "low") phishing_likelihood = "medium";
            issues.push("Indicatori di phishing rilevati nel contenuto dell'email.");
            defensive_suggestions.push("Sii cauto con le richieste urgenti o le email che chiedono informazioni personali.");
        }

        return {
            phishing_likelihood,
            issues,
            defensive_suggestions,
            correlated_data: mailData
        };
    }
}

module.exports = MailCorrelator;
