#!/usr/bin/env bash
source icp/config/icp-endpoints.conf 2>/dev/null || true
echo "[ICP] Network: ${NETWORK:-unknown}"
echo "[ICP] API base: ${ICP_API_BASE:-unset}"
