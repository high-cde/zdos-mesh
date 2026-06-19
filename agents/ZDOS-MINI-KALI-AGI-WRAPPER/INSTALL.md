## Istruzioni di Installazione e Avvio per ZDOS MINI-KALI AGI WRAPPER

Questo documento fornisce le istruzioni per installare e avviare l'orchestratore di cybersecurity AGI-driven su Termux (Android).

### 1. Aggiornamento del Sistema e Installazione delle Dipendenze

Apri Termux sul tuo dispositivo Android ed esegui i seguenti comandi per aggiornare il sistema e installare i pacchetti necessari:

```bash
pkg update && pkg upgrade -y
pkg install -y nodejs python nmap curl wget openssl whois traceroute dnsutils tcpdump tshark bind-utils
```

*   `nodejs`: Ambiente di runtime per JavaScript, necessario per l'applicazione.
*   `python`: Potrebbe essere richiesto da alcuni script o tool esterni.
*   `nmap`: Network scanner per la scoperta di host e servizi.
*   `curl`, `wget`: Utilità per il trasferimento dati.
*   `openssl`: Per l'analisi dei certificati SSL/TLS.
*   `whois`: Per la ricerca di informazioni sui domini.
*   `traceroute`, `dnsutils`: Per l'analisi della rete e del DNS.
*   `tcpdump`, `tshark`: Per la cattura e l'analisi del traffico di rete (richiede permessi di root per la cattura diretta su alcune interfacce).

### 2. Clonazione del Repository

Clona il repository del progetto nella tua directory home di Termux:

```bash
cd ~
git clone https://github.com/high-cde/ZDOS-MINI-KALI-AGI-WRAPPER.git
cd ZDOS-MINI-KALI-AGI-WRAPPER
```

**Nota**: Clona il repository ufficiale di ZDOS.

### 3. Installazione delle Dipendenze Node.js

Naviga nella directory del progetto e installa le dipendenze Node.js:

```bash
cd ~/ZDOS-MINI-KALI-AGI-WRAPPER
npm install
```

### 4. Avvio del Server API

Per avviare il server API REST, esegui:

```bash
node api/server.js
```

Il server API sarà in ascolto sulla porta `3000` (http://localhost:3000).

### 5. Utilizzo della CLI `zdos-mini`

Per rendere lo script CLI eseguibile e utilizzarlo globalmente (o dalla directory del progetto):

```bash
chmod +x cli/zdos-mini
# Per usarlo dalla directory corrente:
./cli/zdos-mini <command> [subcommand] [value]
# Per usarlo globalmente (aggiungi al PATH o crea un symlink):
# sudo ln -s $(pwd)/cli/zdos-mini /usr/local/bin/zdos-mini
```

Esempi di utilizzo:

*   **Scansione Base**: `zdos-mini scan basic example.com`
*   **Recon Avanzato**: `zdos-mini scan advanced example.com`
*   **Banner Grabbing**: `zdos-mini scan banner example.com 80`
*   **Audit SSL**: `zdos-mini scan ssl example.com`
*   **Attack Surface Mapping**: `zdos-mini scan attack-surface example.com`
*   **Generazione Remediation**: `zdos-mini remediation generate report.json`
*   **Generazione Report**: `zdos-mini report generate <report-id> markdown`
*   **OSINT Completo**: `zdos-mini osint full example.com`
*   **Audit Email**: `zdos-mini mail-audit email.txt` (dove `email.txt` contiene il contenuto dell'email)
*   **Audit Cookie**: `zdos-mini cookie-audit cookie.json` (dove `cookie.json` contiene il JSON del cookie)
*   **Controllo Social Engineering**: `zdos-mini se-check message.txt` (dove `message.txt` contiene il testo da analizzare)
*   **Cattura Traffico**: `zdos-mini sniffer capture wlan0 60 "port 80"`
*   **Analisi PCAP**: `zdos-mini sniffer analyze-pcap /tmp/capture_12345.pcap "http.request"`
*   **Monitoraggio ARP**: `zdos-mini sniffer arp-monitor wlan0 30`
*   **Analisi PCAP ARP**: `zdos-mini sniffer analyze-arp-pcap /tmp/arp_capture_12345.pcap`
*   **Monitoraggio DNS**: `zdos-mini sniffer dns-monitor wlan0 30`
*   **Analisi PCAP DNS**: `zdos-mini sniffer analyze-dns-pcap /tmp/dns_capture_12345.pcap`

### 6. Permessi di Root per Sniffing

Per le funzionalità di sniffing (`tcpdump`, `tshark`), potrebbe essere necessario eseguire Termux con permessi di root o configurare `tcpdump`/`tshark` per essere eseguibili da utenti non-root con i permessi necessari. Questo varia a seconda della configurazione del dispositivo Android e della versione di Termux. Assicurati di avere i permessi appropriati e di utilizzare questi strumenti in modo etico e legale.
