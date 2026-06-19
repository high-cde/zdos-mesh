const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const ZDOS_RPC_URL = process.env.ZDOS_RPC_URL || 'http://localhost:8080';

client.once('ready', () => {
    console.log('ZDOS Hub Bot è online!');
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content === '!zdos-status') {
        try {
            const response = await axios.post(ZDOS_RPC_URL, {
                jsonrpc: "2.0",
                method: "getinfo",
                params: [],
                id: 1
            });
            
            const info = response.data.result;
            const embed = new EmbedBuilder()
                .setTitle('📊 Stato Blockchain ZDOS')
                .setColor('#00ff00')
                .addFields(
                    { name: 'Nome Rete', value: info.name, inline: true },
                    { name: 'Versione', value: info.version, inline: true },
                    { name: 'Chain ID', value: info.chain_id.toString(), inline: true }
                )
                .setFooter({ text: 'ZDOS Ecosystem Hub' });

            message.reply({ embeds: [embed] });
        } catch (error) {
            message.reply('❌ Errore nella connessione alla blockchain ZDOS.');
        }
    }

    if (message.content.startsWith('!zdos-balance ')) {
        const address = message.content.split(' ')[1];
        try {
            const response = await axios.post(ZDOS_RPC_URL, {
                jsonrpc: "2.0",
                method: "eth_getBalance",
                params: [address, "latest"],
                id: 1
            });
            
            const balanceHex = response.data.result;
            const balance = parseInt(balanceHex, 16) / 1e18;

            message.reply(`💰 Il bilancio di \`${address}\` è **${balance} ZD**`);
        } catch (error) {
            message.reply('❌ Errore nel recupero del bilancio.');
        }
    }
});

client.login(process.env.DISCORD_TOKEN).catch(() => {
    console.log('DISCORD_TOKEN non configurato, il bot non si avvierà.');
});
