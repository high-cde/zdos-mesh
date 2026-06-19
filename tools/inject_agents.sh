#!/data/data/com.termux/files/usr/bin/bash

AGENTS_DIR="$HOME/zdos-mesh/agents"
RUNTIME_SRC="$HOME/zdos-mesh/tools/agent-runtime.js"

for dir in "$AGENTS_DIR"/*; do
  [ -d "$dir" ] || continue
  name=$(basename "$dir")
  echo "[*] Processing $name"

  cd "$dir"

  if [ ! -f "agent.yml" ]; then
    cat > agent.yml << EOY
agent:
  id: "zdos.$name"
  role: "tool"
  capabilities:
    - "echo"
EOY
    echo "[+] Created agent.yml for $name"
  fi

  mkdir -p agent
  cp "$RUNTIME_SRC" agent/agent.js
done
