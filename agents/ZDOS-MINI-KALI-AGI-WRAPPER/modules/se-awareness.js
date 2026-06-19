// se-awareness.js
// analisi testi/messaggi/email per pattern di social engineering
// (solo difesa e training, nessuna funzione offensiva)

class SEAwareness {
    async analyze(textContent) {
        const results = {
            se_risk_level: "low",
            patterns_detected: [],
            explanation: "",
            behavioral_advice: []
        };

        // Placeholder for social engineering pattern detection
        // This would involve NLP techniques to identify common phishing/social engineering phrases

        const keywordsUrgency = ["urgente", "immediato", "agisci ora", "scadenza"];
        const keywordsAuthority = ["direttore", "CEO", "amministratore", "sicurezza"];
        const keywordsScarcity = ["offerta limitata", "solo per oggi", "pochi posti"];
        const keywordsFear = ["account bloccato", "violazione", "problema di sicurezza"];

        let detectedCount = 0;

        keywordsUrgency.forEach(keyword => {
            if (textContent.toLowerCase().includes(keyword)) {
                results.patterns_detected.push(`Urgenza: ${keyword}`);
                detectedCount++;
            }
        });

        keywordsAuthority.forEach(keyword => {
            if (textContent.toLowerCase().includes(keyword)) {
                results.patterns_detected.push(`Autorità: ${keyword}`);
                detectedCount++;
            }
        });

        keywordsScarcity.forEach(keyword => {
            if (textContent.toLowerCase().includes(keyword)) {
                results.patterns_detected.push(`Scarsità: ${keyword}`);
                detectedCount++;
            }
        });

        keywordsFear.forEach(keyword => {
            if (textContent.toLowerCase().includes(keyword)) {
                results.patterns_detected.push(`Paura: ${keyword}`);
                detectedCount++;
            }
        });

        if (detectedCount > 0) {
            results.se_risk_level = detectedCount > 2 ? "high" : "medium";
            results.explanation = "Rilevati pattern comuni di ingegneria sociale. Sii cauto.";
            results.behavioral_advice.push("Verifica sempre l'identità del mittente tramite un canale separato.");
            results.behavioral_advice.push("Non cliccare su link o scaricare allegati da fonti sospette.");
            results.behavioral_advice.push("Non fornire informazioni personali o credenziali.");
        }

        return results;
    }
}

module.exports = SEAwareness;
