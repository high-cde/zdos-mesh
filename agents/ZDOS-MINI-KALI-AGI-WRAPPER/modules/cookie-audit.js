// cookie-audit.js
// analisi sicurezza cookie forniti dall’utente (Secure, HttpOnly, SameSite, scope)

class CookieAudit {
    async analyze(cookieJson) {
        const results = {
            secure: false,
            httponly: false,
            samesite: "None", // Strict, Lax, None
            scope: "",
            duration: "",
            issues: []
        };

        try {
            const cookie = JSON.parse(cookieJson);

            if (cookie.Secure) {
                results.secure = true;
            } else {
                results.issues.push("Cookie non marcato come Secure. Potrebbe essere intercettato su connessioni non HTTPS.");
            }

            if (cookie.HttpOnly) {
                results.httponly = true;
            } else {
                results.issues.push("Cookie non marcato come HttpOnly. Potrebbe essere accessibile tramite script lato client (XSS).");
            }

            if (cookie.SameSite) {
                results.samesite = cookie.SameSite;
                if (cookie.SameSite === "None" && !cookie.Secure) {
                    results.issues.push("SameSite=None richiede il flag Secure. Il cookie potrebbe non essere inviato o essere vulnerabile a CSRF.");
                }
            } else {
                results.issues.push("SameSite non specificato. Potrebbe essere vulnerabile a attacchi CSRF.");
            }

            if (cookie.Path) {
                results.scope = cookie.Path;
            }

            if (cookie.Expires) {
                const expiresDate = new Date(cookie.Expires);
                const now = new Date();
                const days = Math.ceil((expiresDate - now) / (1000 * 60 * 60 * 24));
                results.duration = `${days} days`;
                if (days > 365) {
                    results.issues.push("Durata del cookie molto lunga. Aumenta il rischio in caso di compromissione.");
                }
            }

        } catch (error) {
            results.issues.push(`Errore durante l'analisi del JSON del cookie: ${error.message}`);
        }

        return results;
    }
}

module.exports = CookieAudit;
