#!/usr/bin/env bash

echo "[ ZDOS AUTOBUILD VPS-ONLY v4 ]"
echo "[*] Ambiente: VPS Contabo — modalità server-only"
echo ""

# 1) Installazione dipendenze globali
echo "[*] Installazione dipendenze globali..."
npm install -g ioredis js-yaml

# 2) Rimozione ESM da tutti gli agenti
echo "[*] Rimozione 'type: module' da tutti gli agenti..."
find agents -name package.json -exec sed -i 's/"type": "module",//g' {} \;

# 3) Conversione agent.js in CommonJS
echo "[*] Conversione agent.js in CommonJS..."
find agents -name agent.js -exec sed -i 's/^import /\/\/import /g' {} \;
find agents -name agent.js -exec sed -i 's/^export /\/\/export /g' {} \;

# 4) Installazione dipendenze minime per ogni agente
echo "[*] Installazione dipendenze locali per ogni agente..."
for AGENT in agents/*; do
  if [ -d "$AGENT/agent" ]; then
    echo "[*] → $AGENT"
    (cd "$AGENT" && npm init -y >/dev/null 2>&1)
    (cd "$AGENT" && npm install ioredis js-yaml >/dev/null 2>&1)
  fi
done

# 5) Avvio agenti
echo ""
echo "[*] Avvio agenti VPS..."
bash tools/start_agents.sh

echo ""
echo "[✓] AUTOBUILD VPS-ONLY COMPLETATO."

