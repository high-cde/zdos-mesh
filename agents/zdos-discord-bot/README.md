# ZDOS-DISCORD-OPENCLAW Bot

Questo è il repository ufficiale del bot Discord **ZDOS-DISCORD-OPENCLAW**, ottimizzato per l'ecosistema ZDOS.

## 🚀 Caratteristiche
- **Integrazione Discord Completa**: Gestione eventi e comandi tramite `discord.py`.
- **Pipeline OpenClaw**: Supporto per i comandi di pipeline (`scan`, `plan`, `act`).
- **ZDOS Core**: Sincronizzazione canali e gestione stato del sistema.
- **Hosting Pronto**: Configurato per GitHub Actions e Manus Cloud Computer.

## 🛠️ Installazione Locale

1. **Clona il repository**:
   ```bash
   git clone https://github.com/high-cde/zdos-discord-bot.git
   cd zdos-discord-bot
   ```

2. **Installa le dipendenze**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configura le variabili d'ambiente**:
   Crea un file `.env` o esporta il token:
   ```bash
   export DISCORD_TOKEN="IL_TUO_TOKEN"
   ```

4. **Avvia il bot**:
   ```bash
   python3 discord_bot.py
   ```

## ☁️ Hosting su GitHub Actions

Per mantenere il bot attivo gratuitamente su GitHub:
1. Crea il file `.github/workflows/discord_bot.yml` nel repository.
2. Aggiungi il tuo `DISCORD_TOKEN` in **Settings > Secrets and variables > Actions**.
3. Avvia il workflow dalla scheda **Actions**.

## 🎮 Comandi Disponibili
- `!ping`: Verifica la latenza.
- `!info`: Dettagli sul sistema ZDOS.
- `!openclaw <azione> <target>`: Esegue la pipeline OpenClaw.
- `!zdos sync`: Sincronizza i canali del server.

## 📄 Licenza
Rilasciato sotto licenza MIT.
