// reporting-engine.js
// Modulo per la generazione di report professionali in Markdown e PDF

class ReportingEngine {
    async generateMarkdownReport(reportData) {
        let markdown = `# Report di Analisi di Sicurezza\n\n`;
        markdown += `**Generato da:** ZDOS MINI-KALI AGI WRAPPER\n`;
        markdown += `**Data:** ${reportData.timestamp}\n`;
        markdown += `**Task:** ${reportData.task}\n`;
        markdown += `**Livello di Rischio Complessivo:** **${reportData.overallRiskLevel.toUpperCase()}**\n\n`;

        markdown += `## Executive Summary\n`;
        markdown += `${reportData.executiveSummary}\n\n`;

        if (reportData.issues && reportData.issues.length > 0) {
            markdown += `## Problemi Rilevati\n`;
            reportData.issues.forEach((issue, index) => {
                markdown += `${index + 1}. ${issue}\n`;
            });
            markdown += `\n`;
        }

        if (reportData.notes && reportData.notes.length > 0) {
            markdown += `## Note e Osservazioni\n`;
            reportData.notes.forEach((note, index) => {
                markdown += `${index + 1}. ${note}\n`;
            });
            markdown += `\n`;
        }

        // Add detailed results based on the task type
        markdown += `## Dettagli dell'Analisi\n`;
        for (const key in reportData.details) {
            if (reportData.details.hasOwnProperty(key)) {
                markdown += `### ${key.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })}\n`;
                markdown += `\`\`\`json\n${JSON.stringify(reportData.details[key], null, 2)}\n\`\`\`\n\n`;
            }
        }

        if (reportData.defensePlan && reportData.defensePlan.length > 0) {
            markdown += `## Piano di Difesa Prioritizzato\n`;
            reportData.defensePlan.forEach((item, index) => {
                markdown += `${index + 1}. ${item}\n`;
            });
            markdown += `\n`;
        }

        if (reportData.checklist && reportData.checklist.length > 0) {
            markdown += `## Checklist Operativa\n`;
            reportData.checklist.forEach((item, index) => {
                markdown += `${index + 1}. ${item}\n`;
            });
            markdown += `\n`;
        }

        markdown += `--- \n`;
        markdown += `*Questo report è stato generato automaticamente e dovrebbe essere revisionato da un esperto di sicurezza.*\n`;

        return markdown;
    }

    // PDF generation will be handled by an external tool after markdown is generated
}

module.exports = ReportingEngine;
