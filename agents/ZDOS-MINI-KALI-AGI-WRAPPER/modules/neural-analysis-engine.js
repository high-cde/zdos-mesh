// neural-analysis-engine.js
// Modulo per l'analisi dei risultati tramite LLM (Large Language Models)

const OpenAI = require("openai");

class NeuralAnalysisEngine {
    constructor() {
        // API key and base URL are pre-configured from environment variables
        // Ensure OPENAI_API_KEY is set in the environment
        this.openai = new OpenAI(); 
    }

    async analyze(reportData) {
        const prompt = `Analizza il seguente report di cybersecurity e fornisci:
1. Una spiegazione chiara e concisa delle vulnerabilità e dei rischi rilevati.
2. Suggerimenti su potenziali exploit path o scenari di attacco basati sulle informazioni fornite (solo a scopo difensivo/educativo).
3. Un piano di hardening avanzato e prioritizzato.
4. Un executive summary non tecnico per un pubblico non specializzato.

Report di Cybersecurity in formato JSON:
${JSON.stringify(reportData, null, 2)}

Rispondi in formato JSON con le seguenti chiavi: 'explanation', 'exploit_suggestions', 'hardening_plan', 'executive_summary'.`;

        try {
            const chatCompletion = await this.openai.chat.completions.create({
                model: "gpt-4o-mini", // Using a suitable model for analysis (gpt-4o-mini is more recent and cost-effective)
                messages: [{
                    role: "user",
                    content: prompt
                }],
                response_format: { type: "json_object" },
            });

            const responseContent = chatCompletion.choices[0].message.content;
            return JSON.parse(responseContent);

        } catch (error) {
            console.error("Error calling OpenAI API:", error);
            return { error: "Failed to perform neural analysis", details: error.message };
        }
    }
}

module.exports = NeuralAnalysisEngine;
