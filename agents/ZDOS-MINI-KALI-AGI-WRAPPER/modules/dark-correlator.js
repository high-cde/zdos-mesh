// dark-correlator.js
// rischio reputazionale / compromissione pregressa

class DarkCorrelator {
    correlate(darkOsintData) {
        let reputational_risk = "low";
        const issues = [];
        const notes = [];

        if (darkOsintData.blacklist_hits && darkOsintData.blacklist_hits.length > 0) {
            reputational_risk = "high";
            issues.push("Il dominio/IP è presente in blacklist, indicando un potenziale rischio reputazionale o una compromissione pregressa.");
            darkOsintData.blacklist_hits.forEach(hit => notes.push(`Blacklist hit: ${hit.value} (${hit.source})`));
        }

        if (darkOsintData.ioc_hits && darkOsintData.ioc_hits.length > 0) {
            if (reputational_risk === "low") reputational_risk = "medium";
            issues.push("Sono stati rilevati Indicatori di Compromissione (IOC), suggerendo una possibile attività malevola.");
            darkOsintData.ioc_hits.forEach(hit => notes.push(`IOC hit: ${hit.value} (${hit.source})`));
        }

        if (darkOsintData.breach_hits && darkOsintData.breach_hits.length > 0) {
            if (reputational_risk === "low") reputational_risk = "medium";
            issues.push("Credenziali o dati relativi all'entità sono stati trovati in violazioni di dati pubbliche.");
            darkOsintData.breach_hits.forEach(hit => notes.push(`Breach hit: ${hit.value} (${hit.source})`));
        }

        return {
            reputational_risk,
            issues,
            notes,
            correlated_data: darkOsintData
        };
    }
}

module.exports = DarkCorrelator;
