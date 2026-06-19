#!/usr/bin/env bash
echo "[Z-NET] Network info"
hostnamectl 2>/dev/null || echo "hostname: $(hostname)"
