#!/usr/bin/env bash

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
MEM_DIR="$BASE_DIR/z-ai-memory"
HOOKS_DIR="$BASE_DIR/z-ai-hooks"

mkdir -p "$MEM_DIR" "$HOOKS_DIR"

ai_log() {
  printf "[Z-AI] %s\n" "$1"
}

ai_memory_append() {
  echo "$1" >> "$MEM_DIR/history.log"
}

ai_handle() {
  local input="$*"
  ai_log "input: $input"
  ai_memory_append "$input"
  case "$input" in
    help)
      echo "Z-AI_AOA — Adaptive Operational Agent"
      echo "Commands: help, status, whoami"
      ;;
    status)
      echo "Z-AI status: online (minimal core)"
      ;;
    whoami)
      echo "You are an operator inside Z-GENESIS-OS."
      ;;
    *)
      echo "Z-AI: no model wired yet, but core is alive."
      ;;
  esac
}

if [[ "$0" = "${BASH_SOURCE[0]}" ]]; then
  ai_handle "$@"
fi
