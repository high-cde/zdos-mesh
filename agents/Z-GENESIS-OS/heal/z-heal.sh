#!/usr/bin/env bash

echo "=== Z-HEAL — AUTO-REPAIR MODULE ==="

repair_file() {
  local f="$1"
  local content="$2"

  if [ ! -f "$f" ]; then
    echo "[HEAL] Restoring missing file: $f"
    echo "$content" > "$f"
  fi
}

# Ripara file critici
repair_file core/utils.sh "#!/usr/bin/env bash"
repair_file core/system.conf "# Z-GENESIS-OS system config"
repair_file zshell/gt-zshell "#!/usr/bin/env bash"
repair_file icp/config/icp-endpoints.conf "ICP_API_BASE=https://ic0.app"

echo "[HEAL] Completed."
