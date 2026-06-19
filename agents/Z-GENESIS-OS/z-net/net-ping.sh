#!/usr/bin/env bash
target="${1:-1.1.1.1}"
echo "[Z-NET] Pinging $target..."
ping -c 2 "$target" 2>/dev/null || echo "[Z-NET] Ping failed or not available."
