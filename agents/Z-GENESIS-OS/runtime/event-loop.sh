#!/usr/bin/env bash
source core/utils.sh

log "[RUNTIME] Event loop start"

# Integrity cycle
runtime/hooks/runtime-integrity.sh

# AI analytics
z-ai/z-ai-hooks/z-ai-analyze.sh >/dev/null 2>&1

log "[RUNTIME] Event loop end"
