#!/usr/bin/env bash

echo "[RUNTIME] Running integrity cycle..."

guardian/z-guardian.sh >/dev/null 2>&1
heal/z-heal.sh >/dev/null 2>&1
shield/z-shield.sh >/dev/null 2>&1

echo "[RUNTIME] Integrity cycle complete."
