#!/usr/bin/env bash

echo "=== Z-SENTIENCE — SYSTEM ORCHESTRATOR ==="
echo "Timestamp: $(date)"
echo

step() {
  echo
  echo ">>> $1"
  echo "----------------------------------------"
}

# 1) Supervisione
step "GUARDIAN — integrity & functionality"
guardian/z-guardian.sh

# 2) Auto-riparazione
step "HEAL — auto-repair"
heal/z-heal.sh

# 3) Protezione attiva
step "SHIELD — active protection"
shield/z-shield.sh

# 4) Runtime (ciclo vitale)
step "RUNTIME — event loop"
runtime/event-loop.sh

# 5) Analisi cognitiva
step "Z-AI — analytics & insights"
z-ai/z-ai-hooks/z-ai-analyze.sh

echo
echo "=== Z-SENTIENCE COMPLETE ==="
