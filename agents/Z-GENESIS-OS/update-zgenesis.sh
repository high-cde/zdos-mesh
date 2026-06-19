#!/bin/bash

echo "[Z-GENESIS-OS] Pull ultimo stato da Git..."
git fetch --all
git reset --hard origin/main

if [ -f package.json ]; then
  echo "[Z-GENESIS-OS] Install/aggiorno dipendenze..."
  npm install --production
fi

echo "[Z-GENESIS-OS] Riavvio servizio PM2..."
pm2 restart z-genesis || pm2 start server.js --name z-genesis

echo "[Z-GENESIS-OS] Stato servizi PM2:"
pm2 status z-genesis

echo "[Z-GENESIS-OS] Done."
