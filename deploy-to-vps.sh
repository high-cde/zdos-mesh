#!/data/data/com.termux/files/usr/bin/bash
set -e

### CONFIGURAZIONE
GIT_BRANCH="master"                 # o "main" se usi main
VPS_USER="root"                     # utente sulla VPS
VPS_HOST="vmi3082470.contaboserver.net"  # hostname/IP VPS
VPS_PATH="/root/zdos-mesh"          # path repo sulla VPS

COMMIT_MSG="${1:-Auto deploy ZDOS Mesh}"

echo "=== [LOCAL] Git add/commit/push ==="
cd "$HOME/zdos-mesh"

git add -A
if ! git diff --cached --quiet; then
  git commit -m "$COMMIT_MSG"
  git push origin "$GIT_BRANCH"
else
  echo "Nessuna modifica da committare, salto commit/push."
fi

echo "=== [REMOTE] Deploy sulla VPS: $VPS_USER@$VPS_HOST ==="

ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" bash << EOF_REMOTE
set -e
echo ">>> Entrato su VPS: \$(hostname)"

if [ ! -d "$VPS_PATH" ]; then
  echo "Repo non trovato, clono..."
  git clone https://github.com/high-cde/zdos-mesh.git "$VPS_PATH"
fi

cd "$VPS_PATH"

echo ">>> Git pull..."
git pull origin "$GIT_BRANCH"

echo ">>> Install dipendenze HUB..."
cd hub
npm install --production || npm install

echo ">>> Riavvio HUB + OBSERVER + agenti..."

# kill vecchi processi node (grezzo ma efficace)
pkill -f "node index.js" || true
pkill -f "node observer-zero.js" || true

# riavvia HUB + OBSERVER
nohup node index.js > ../logs-hub.log 2>&1 &
nohup node observer-zero.js > ../logs-observer.log 2>&1 &

cd "$VPS_PATH"

if [ -x "./tools/start_agents.sh" ]; then
  ./tools/stop_agents.sh 2>/dev/null || true
  ./tools/start_agents.sh
else
  echo "ATTENZIONE: tools/start_agents.sh non trovato o non eseguibile."
fi

echo ">>> Deploy completato."
EOF_REMOTE

echo "=== DONE: deploy completato. ==="
