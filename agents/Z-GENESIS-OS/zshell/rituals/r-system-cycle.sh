#!/usr/bin/env bash

echo "=== R-SYSTEM-CYCLE — GLOBAL ORCHESTRATION ==="
echo "Timestamp: $(date)"
echo

step() {
  echo
  echo ">>> $1"
  echo "----------------------------------------"
}

step "GUARDIAN — integrity & functionality"
guardian/z-guardian.sh || echo "[WARN] Guardian reported issues."

step "HEAL — auto-repair"
heal/z-heal.sh || echo "[WARN] Heal encountered issues."

step "SHIELD — active protection"
shield/z-shield.sh || echo "[WARN] Shield reported issues."

step "RUNTIME — event loop + AI analytics"
runtime/event-loop.sh || echo "[WARN] Runtime encountered issues."

step "Z-AI — log analysis & suggestions"
z-ai/z-ai-hooks/z-ai-analyze.sh || echo "[WARN] Z-AI analysis failed."

echo
echo "=== R-SYSTEM-CYCLE COMPLETE ==="
