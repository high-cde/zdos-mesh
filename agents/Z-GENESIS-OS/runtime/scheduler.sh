#!/usr/bin/env bash
source core/utils.sh
source core/system.conf 2>/dev/null || true

log "[RUNTIME] Scheduler tick at $(date)"
