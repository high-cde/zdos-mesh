#!/usr/bin/env bash

echo "=== Z-GENESIS-OS GUARDIAN CHECK ==="
echo "Timestamp: $(date)"
echo

# Helper
ok() { printf " ✓ %s\n" "$1"; }
fail() { printf " ✗ %s\n" "$1"; }

#############################
# 1) CORE
#############################
echo "[CORE]"
[ -f core/dragon-status.sh ] && ok "Dragon Core" || fail "Dragon Core missing"
[ -f core/utils.sh ] && ok "Utils" || fail "Utils missing"
[ -f core/system.conf ] && ok "System config" || fail "System config missing"
echo

#############################
# 2) Z-AI
#############################
echo "[Z-AI]"
z-ai/z-ai-core.sh status >/dev/null 2>&1 && ok "Z-AI operational" || fail "Z-AI failure"
echo

#############################
# 3) ICP
#############################
echo "[ICP]"
icp/scripts/icp-status.sh >/dev/null 2>&1 && ok "ICP gateway" || fail "ICP gateway failure"
echo

#############################
# 4) RUNTIME
#############################
echo "[RUNTIME]"
runtime/scheduler.sh >/dev/null 2>&1 && ok "Scheduler" || fail "Scheduler failure"
runtime/event-loop.sh >/dev/null 2>&1 && ok "Event loop" || fail "Event loop failure"
echo

#############################
# 5) ZONES
#############################
echo "[ZONES]"
for z in zshell/zones/*.sh; do
  [ -f "$z" ] && ok "$(basename "$z")" || fail "$(basename "$z")"
done
echo

#############################
# 6) RITUALS
#############################
echo "[RITUALS]"
for r in zshell/rituals/*.sh; do
  [ -f "$r" ] && ok "$(basename "$r")" || fail "$(basename "$r")"
done
echo

#############################
# 7) LOG HEALTH
#############################
echo "[LOGS]"
if [ -s core/logs/zdos.log ]; then
  ok "Log file present"
else
  fail "Log file empty or missing"
fi
echo

echo "=== GUARDIAN CHECK COMPLETE ==="
