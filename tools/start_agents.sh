#!/usr/bin/env bash

AGENTS_DIR="$HOME/zdos-mesh/agents"

for dir in "$AGENTS_DIR"/*; do
  [ -d "$dir" ] || continue
  name=$(basename "$dir")
  echo "[*] Starting agent for $name"

  cd "$dir"

  NODE_PATH="$HOME/zdos-mesh/node_modules" \
  node agent/agent.js &
done
