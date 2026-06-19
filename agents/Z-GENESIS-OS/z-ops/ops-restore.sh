#!/usr/bin/env bash
ARCHIVE="$1"
if [[ -z "$ARCHIVE" || ! -f "$ARCHIVE" ]]; then
  echo "[Z-OPS] Usage: ops-restore.sh <archive.tar.gz>"
  exit 1
fi
echo "[Z-OPS] Restoring from $ARCHIVE"
tar xzf "$ARCHIVE"
