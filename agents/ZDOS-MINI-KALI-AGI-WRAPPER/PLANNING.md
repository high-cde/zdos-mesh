# Pianificazione del Completamento del Repository ZDOS-MINI-KALI-AGI-WRAPPER

Questo documento delinea le funzionalità mancanti e le aree di miglioramento identificate nel repository `ZDOS-MINI-KALI-AGI-WRAPPER`, insieme a un piano d'azione per il loro completamento.

## 1. Problemi di Orchestrazione e Inizializzazione (`agi-brain.js`, `api/server.js`, `autonomous-monitor.js`)

### Problemi Rilevati

| ID Problema | Descrizione | File Coinvolti | Dettagli | Priorità |
|---|---|---|---|---|
| **1.1** | Inizializzazione `autonomousMonitor` prima di `agiBrain` | `api/server.js` | La riga `const autonomousMonitor = new AutonomousMonitor(agiBrain);` viene eseguita prima che `agiBrain` sia istanziato, causando un errore logico. | Alta |
| **1.2** | Nome del modulo `advanced-recon` non corrispondente | `api/server.js`, `core/agi-brain.js` | `server.js` registra il modulo come `"advanced-recon"`, ma `agi-brain.js` lo richiama come `this.modules.advancedRecon`, che potrebbe causare problemi se la registrazione non è coerente. | Media |
| **1.3** | Parametro `interval` non utilizzato in `autonomous-monitor.js` | `modules/autonomous-monitor.js`, `api/server.js` | Il metodo `startMonitoring` in `autonomous-monitor.js` non accetta o applica il parametro `interval` passato da `server.js`, mantenendo l'intervallo di default di 3600000 ms. | Media |

### Piano d'Azione

*   **1.1**: Spostare l'inizializzazione di `autonomousMonitor` dopo l'istanziazione di `agiBrain` in `api/server.js`.
*   **1.2**: Assicurarsi che il nome del modulo utilizzato per la registrazione in `api/server.js` corrisponda esattamente al nome utilizzato per l'accesso in `agi-brain.js` (es. `advancedRecon`).
*   **1.3**: Modificare il costruttore o il metodo `startMonitoring` in `autonomous-monitor.js` per accettare e utilizzare il parametro `interval`.

## 2. Parser Mancanti in `parser.js`

### Problemi Rilevati

| ID Problema | Descrizione | File Coinvolti | Dettagli | Priorità |
|---|---|---|---|---|
| **2.1** | Implementazioni parser mancanti | `modules/parser.js`, `modules/advanced-fuzzing.js`, `modules/network-sniffer.js`, `modules/arp-inspector.js`, `modules/dns-monitor.js` | Mancano i parser per `parseGobusterOutput`, `tshark_summary`, `tshark_arp`, e `tshark_dns`. Attualmente, il fallback è `{ raw: rawOutput }`, che non fornisce un'analisi strutturata. | Alta |

### Piano d'Azione

*   **2.1**: Implementare le funzioni di parsing per `Gobuster`, `tshark_summary`, `tshark_arp` e `tshark_dns` in `modules/parser.js` per convertire l'output grezzo in un formato JSON strutturato.

## 3. Funzionalità CLI Incomplete (`cli/zdos-mini`)

### Problemi Rilevati

| ID Problema | Descrizione | File Coinvolti | Dettagli | Priorità |
|---|---|---|---|---|
| **3.1** | Recupero report simulato | `cli/zdos-mini` | Il recupero dei report nella CLI è attualmente simulato, mentre l'API espone una route `/report/:id` funzionante. | Bassa |

### Piano d'Azione

*   **3.1**: Implementare il recupero effettivo dei report dalla route `/report/:id` dell'API nella CLI.

## 4. Miglioramenti Specifici dei Moduli

### Problemi Rilevati

| ID Problema | Descrizione | File Coinvolti | Dettagli | Priorità |
|---|---|---|---|---|
| **4.1** | `bannerGrabbing` per HTTPS errato | `modules/advanced-recon.js` | Il metodo `bannerGrabbing` utilizza `curl -I http://...` anche per la porta 443, che dovrebbe usare `https`. | Media |
| **4.2** | OTX IPv4 endpoint per domini | `modules/threat-intelligence.js` | La lookup OTX interroga sempre l'endpoint IPv4 anche se l'indicatore potrebbe essere un dominio. | Bassa |
| **4.3** | Cloud Providers incompleti in `attack-surface-mapper.js` | `modules/attack-surface-mapper.js` | I commenti indicano che altri provider cloud non sono implementati. | Bassa |
| **4.4** | Mismatch nome file di cattura | `modules/network-sniffer.js`, `modules/arp-inspector.js`, `modules/dns-monitor.js` | Questi moduli presentano una discrepanza tra il nome del file di cattura generato dal comando e il nome del file restituito. | Media |
| **4.5** | Nome del modello `gpt-4.1-mini` | `modules/neural-analysis-engine.js` | Il modello `gpt-4.1-mini` potrebbe essere un placeholder o un nome obsoleto. | Bassa |

### Piano d'Azione

*   **4.1**: Modificare `bannerGrabbing` per utilizzare `https` quando la porta è 443.
*   **4.2**: Implementare una logica per distinguere tra IP e domini per le query OTX e utilizzare l'endpoint appropriato.
*   **4.3**: (Opzionale) Estendere `attack-surface-mapper.js` per supportare altri provider cloud.
*   **4.4**: Correggere la logica di generazione del nome del file in `network-sniffer.js`, `arp-inspector.js` e `dns-monitor.js` per garantire la coerenza tra il file creato e quello restituito.
*   **4.5**: Verificare e aggiornare il nome del modello LLM in `neural-analysis-engine.js` a un modello OpenAI valido e aggiornato.

## 5. Architettura del Completamento

Il completamento del repository seguirà un approccio iterativo, concentrandosi prima sui problemi di orchestrazione e sui parser mancanti, in quanto sono i blocchi principali per il funzionamento del sistema. Successivamente, verranno affrontati i miglioramenti specifici dei moduli e le funzionalità CLI incomplete.

Ogni modifica verrà testata localmente prima di essere integrata nel repository principale. Verranno aggiunti commenti al codice per spiegare le nuove implementazioni e le correzioni apportate.

Questo piano verrà aggiornato man mano che si procede con lo sviluppo e si scoprono ulteriori dettagli o requisiti.
