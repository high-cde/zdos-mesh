// cookie-correlator.js
// rischio session hijacking teorico + raccomandazioni hardening

class CookieCorrelator {
    correlate(cookieAuditData) {
        let session_hijacking_risk = "low";
        const recommendations = [];
        const issues = cookieAuditData.issues || [];

        if (issues.length > 0) {
            session_hijacking_risk = "medium";
            recommendations.push("Rivedere le configurazioni dei cookie per affrontare i problemi rilevati.");
        }

        if (!cookieAuditData.secure) {
            session_hijacking_risk = "high";
            recommendations.push("Impostare il flag 'Secure' per il cookie per garantire che venga inviato solo su connessioni HTTPS.");
        }

        if (!cookieAuditData.httponly) {
            session_hijacking_risk = "high";
            recommendations.push("Impostare il flag 'HttpOnly' per il cookie per prevenire l'accesso tramite script lato client.");
        }

        if (cookieAuditData.samesite === "None" && !cookieAuditData.secure) {
            session_hijacking_risk = "high";
            recommendations.push("Se SameSite=None è necessario, assicurarsi che il flag 'Secure' sia sempre impostato.");
        } else if (!cookieAuditData.samesite || cookieAuditData.samesite === "Lax") {
            recommendations.push("Considerare l'uso di SameSite=Strict per una maggiore protezione contro CSRF, se compatibile con la funzionalità dell'applicazione.");
        }

        if (cookieAuditData.duration && cookieAuditData.duration.includes("days")) {
            const days = parseInt(cookieAuditData.duration.split(" ")[0]);
            if (days > 90) { // Example threshold for long duration
                session_hijacking_risk = "medium";
                recommendations.push("Ridurre la durata del cookie per limitare la finestra di opportunità per il dirottamento della sessione.");
            }
        }

        return {
            session_hijacking_risk,
            issues,
            recommendations,
            correlated_data: cookieAuditData
        };
    }
}

module.exports = CookieCorrelator;
