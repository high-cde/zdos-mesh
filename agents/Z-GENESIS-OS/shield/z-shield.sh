#!/usr/bin/env bash

echo "=== Z-SHIELD — ACTIVE PROTECTION ==="

CRITICAL=(
  core/utils.sh
  core/system.conf
  zshell/gt-zshell
  zshell/gt-z-config
  icp/config/icp-endpoints.conf
)

for f in "${CRITICAL[@]}"; do
  if [ ! -f "$f" ]; then
    echo "[SHIELD] ALERT: Missing critical file: $f"
  fi
done

echo "[SHIELD] Scan complete."
