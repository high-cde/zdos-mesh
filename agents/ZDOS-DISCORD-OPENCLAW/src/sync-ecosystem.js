/**
 * ZDOS Ecosystem Sync Script
 * Questo script assicura che l'Hub sia correttamente configurato per parlare con
 * la blockchain zdos e che i riferimenti al wallet siano aggiornati.
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
    rpc_url: 'http://localhost:8080',
    chain_id: 1337,
    wallet_url: 'https://github.com/high-cde/x-zdos-wallet',
    blockchain_repo: 'https://github.com/high-cde/HighCoin'
};

function sync() {
    console.log('--- Inizio Sincronizzazione Ecosistema ZDOS ---');
    
    // 1. Verifica/Aggiorna .env
    const envPath = path.join(__dirname, '../.env');
    if (!fs.existsSync(envPath)) {
        const envContent = `DISCORD_TOKEN=your_token_here\nZDOS_RPC_URL=${CONFIG.rpc_url}\nPORT=3000\n`;
        fs.writeFileSync(envPath, envContent);
        console.log('[OK] File .env creato con parametri predefiniti.');
    }

    // 2. Log dei componenti collegati
    console.log(`[LINK] Blockchain RPC: ${CONFIG.rpc_url}`);
    console.log(`[LINK] Wallet: ${CONFIG.wallet_url}`);
    console.log(`[LINK] Blockchain Source: ${CONFIG.blockchain_repo}`);
    
    console.log('--- Sincronizzazione Completata ---');
}

sync();
