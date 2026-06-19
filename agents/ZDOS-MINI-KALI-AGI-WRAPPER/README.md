# ZDOS MINI-KALI AGI WRAPPER

![ZDOS Banner](https://img.shields.io/badge/ZDOS-Cybersecurity-green?style=for-the-badge)
![License MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Platform Termux](https://img.shields.io/badge/Platform-Termux-orange?style=for-the-badge)

**ZDOS MINI-KALI AGI WRAPPER** è un orchestratore di cybersecurity d'élite guidato da intelligenza artificiale (AGI), progettato specificamente per funzionare su **Termux** (Android). Trasforma il tuo dispositivo mobile in un potente SOC portatile per threat hunting, OSINT e hardening automatizzato.

## 🚀 Visione ZDOS
Questo progetto punta esclusivamente all'eccellenza nel campo della sicurezza offensiva e difensiva, integrando le capacità di ragionamento avanzato dell'AGI con i tool classici di Kali Linux. Il framework è parte integrante dell'ecosistema **ZDOS**, focalizzato sulla sovranità digitale e la sicurezza proattiva.

## 🧠 Caratteristiche Principali

- **Core AGI Orchestrator**: Gestione intelligente dei task di sicurezza tramite motori neurali.
- **Advanced Recon Module**: Scansioni stealth, banner grabbing e audit SSL/TLS.
- **Holistic OSINT**: Correlazione automatizzata di WHOIS, DNS, certificati e dati storici.
- **Sniffing & Analysis**: Monitoraggio ARP, DNS e analisi del traffico in tempo reale.
- **Reporting Engine**: Generazione di report professionali in Markdown pronti per l'export.

## 🛠️ Architettura del Progetto

Il sistema è strutturato in moduli specializzati coordinati dal cervello centrale:

- **`core/agi-brain.js`**: Il motore di ragionamento che decide quali moduli attivare.
- **`modules/executor.js`**: Wrapper sicuro per l'esecuzione di tool come Nmap, TShark e OpenSSL.
- **`modules/neural-analysis-engine.js`**: Analisi profonda dei risultati tramite LLM (GPT-4o-mini).
- **`modules/threat-intelligence.js`**: Integrazione con AlienVault OTX per threat feed in tempo reale.

## ⚙️ Installazione Rapida

1.  **Dipendenze**:
    ```bash
    pkg update && pkg upgrade -y
    pkg install -y nodejs nmap curl wget openssl tshark
    ```
2.  **Clona**:
    ```bash
    git clone https://github.com/high-cde/ZDOS-MINI-KALI-AGI-WRAPPER.git
    cd ZDOS-MINI-KALI-AGI-WRAPPER
    ```
3.  **Setup**:
    ```bash
    npm install
    chmod +x cli/zdos-mini
    ```

## 📖 Documentazione
Consulta la [Guida alla Documentazione](https://high-cde.github.io/ZDOS-MINI-KALI-AGI-WRAPPER/) per istruzioni dettagliate su ogni comando.

## ⚖️ Disclaimer Legale
Questo strumento è destinato esclusivamente a scopi educativi e di test di sicurezza autorizzati. L'uso di ZDOS per attività non autorizzate è severamente proibito. Il team ZDOS non si assume alcuna responsabilità per l'uso improprio di questo framework.

---
© 2026 **ZDOS Team** - *Elite Cybersecurity Solutions*
