#!/usr/bin/env bash

LOG="core/logs/zdos.log"

echo "=== Z-AI ANALYTICS ==="

if [ ! -f "$LOG" ]; then
  echo "[Z-AI] No log file found."
  exit 1
fi

echo "[Z-AI] Analyzing logs..."

ERRORS=$(grep -i "err" "$LOG" | wc -l)
RUNTIME=$(grep -i "runtime" "$LOG" | wc -l)

echo "[Z-AI] Errors detected: $ERRORS"
echo "[Z-AI] Runtime events: $RUNTIME"

if [ "$ERRORS" -gt 0 ]; then
  echo "[Z-AI] Suggestion: Run heal module."
fi

echo "[Z-AI] Analysis complete."
