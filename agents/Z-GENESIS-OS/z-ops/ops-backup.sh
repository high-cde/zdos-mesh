#!/usr/bin/env bash
TARGET="${1:-backup.tar.gz}"
echo "[Z-OPS] Creating minimal backup: $TARGET"
tar czf "$TARGET" core zshell icp runtime z-ai z-net z-ops 2>/dev/null || echo "[Z-OPS] Backup failed or partial."
