const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const ZDOS_RPC_URL = process.env.ZDOS_RPC_URL || 'http://localhost:8080';

app.get('/api/status', async (req, res) => {
    try {
        const response = await axios.post(ZDOS_RPC_URL, {
            jsonrpc: "2.0",
            method: "getinfo",
            params: [],
            id: 1
        });
        res.json(response.data.result);
    } catch (error) {
        res.status(500).json({ error: "Blockchain non raggiungibile" });
    }
});

app.get('/api/balance/:address', async (req, res) => {
    try {
        const response = await axios.post(ZDOS_RPC_URL, {
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: [req.params.address, "latest"],
            id: 1
        });
        res.json({ address: req.params.address, balance: response.data.result });
    } catch (error) {
        res.status(500).json({ error: "Errore recupero bilancio" });
    }
});

app.listen(port, () => {
    console.log(`ZDOS Hub API in ascolto su http://localhost:${port}`);
});
