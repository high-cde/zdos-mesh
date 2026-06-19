// remediation-engine.js
// Modulo per la generazione di script di hardening e remediation

class RemediationEngine {
    async generateScript(vulnerabilityReport) {
        let script = "#!/bin/bash\n\n# Script di Remediation Generato da ZDOS MINI-KALI AGI WRAPPER\n# Data: " + new Date().toISOString() + "\n\n";
        let recommendations = [];

        if (vulnerabilityReport.issues && vulnerabilityReport.issues.length > 0) {
            script += "echo \"Rilevate le seguenti vulnerabilità:\"\n";
            vulnerabilityReport.issues.forEach(issue => {
                script += `echo \"- ${issue}\"\n`;
                // Basic logic to generate recommendations based on issue keywords
                if (issue.toLowerCase().includes("open ports")) {
                    recommendations.push("Rivedere le regole del firewall per chiudere le porte non necessarie.");
                    script += "# Esempio: chiudere la porta 23 (Telnet) se non in uso\n";
                    script += "# sudo ufw deny 23/tcp\n";
                }
                if (issue.toLowerCase().includes("ssl certificate")) {
                    recommendations.push("Aggiornare o rinnovare i certificati SSL/TLS scaduti o deboli.");
                    script += "# Esempio: verificare la configurazione SSL del server web\n";
                    script += "# openssl s_client -connect yourdomain.com:443 < /dev/null | openssl x509 -text -noout\n";
                }
                if (issue.toLowerCase().includes("publicly exposed")) {
                    recommendations.push("Limitare l'accesso a risorse esposte pubblicamente.");
                    script += "# Esempio: configurare le ACL dei bucket S3 per l'accesso privato\n";
                    script += "# aws s3api put-bucket-acl --bucket your-bucket-name --acl private\n";
                }
                if (issue.toLowerCase().includes("weak credentials")) {
                    recommendations.push("Imporre password complesse e autenticazione a più fattori.");
                    script += "# Esempio: forzare il cambio password per gli utenti\n";
                    script += "# sudo passwd username\n";
                }
            });
        }

        if (recommendations.length > 0) {
            script += "\necho \"Raccomandazioni per la remediation:\"\n";
            recommendations.forEach(rec => {
                script += `echo \"- ${rec}\"\n`;
            });
        }

        script += "\necho \"Script di remediation completato. Eseguire con cautela e previa verifica.\"\n";

        return {
            script_content: script,
            recommendations: recommendations
        };
    }
}

module.exports = RemediationEngine;
