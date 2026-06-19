// mail-parser.js
// normalizzazione header e indicatori phishing

class MailParser {
    parse(mailAnalysisData) {
        const normalized = {
            spf_status: mailAnalysisData.spf_status,
            dkim_status: mailAnalysisData.dkim_status,
            dmarc_status: mailAnalysisData.dmarc_status,
            suspicious_links: mailAnalysisData.suspicious_links,
            phishing_indicators: mailAnalysisData.phishing_indicators
        };
        return normalized;
    }
}

module.exports = MailParser;
