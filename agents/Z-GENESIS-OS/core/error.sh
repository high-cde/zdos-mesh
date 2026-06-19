#!/usr/bin/env bash
LOG_FILE="${LOG_FILE:-core/logs/zdos.log}"

err() {
  local msg="$1"
  printf "[ERR] %s %s\n" "$(date +%Y-%m-%dT%H:%M:%S)" "$msg" | tee -a "$LOG_FILE" >&2
}
