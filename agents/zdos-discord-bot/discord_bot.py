#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import discord
from discord.ext import commands
import os
import logging

# Configurazione Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("ZDOSBot")

class ZDOSDiscordBot(commands.Bot):
    def __init__(self, command_prefix: str, config: dict, event_router, command_handler_class):
        intents = discord.Intents.default()
        intents.message_content = True
        intents.members = True
        super().__init__(command_prefix=command_prefix, intents=intents)
        
        self.config = config
        self.event_router = event_router
        # Inizializza il router con l'istanza del bot
        self.event_router.bot = self
        # Inizializza l'handler passandogli l'istanza del bot
        self.command_handler = command_handler_class(self, self.event_router)
        self.zdos_channels = {}

    async def on_ready(self):
        logger.info(f"Bot connesso come {self.user} (ID: {self.user.id})")
        await self._initialize_zdos_channels()
        logger.info("Sistema ZDOS pronto e operativo.")

    async def _initialize_zdos_channels(self):
        for guild in self.guilds:
            channels_config = self.config.get("discord", {}).get("channels", {})
            for key, name in channels_config.items():
                channel = discord.utils.get(guild.channels, name=name)
                if channel:
                    self.zdos_channels[key] = channel
                    logger.info(f"Canale '{key}' collegato a #{name} in {guild.name}")

    async def on_message(self, message):
        if message.author == self.user:
            return
        logger.info(f"Messaggio da {message.author} in #{message.channel}: {message.content}")
        await self.process_commands(message)
        if self.event_router:
            await self.event_router.distribute_event("message", message)

if __name__ == "__main__":
    from command_handler import CommandHandler
    from event_router import EventRouter

    token = os.getenv("DISCORD_TOKEN")
    config = {
        "discord": {
            "prefix": os.getenv("BOT_PREFIX", "!"),
            "channels": {
                "welcome": "zdos-welcome",
                "core": "zdos-core",
                "logs": "zdos-logs"
            }
        }
    }

    if not token:
        logger.error("DISCORD_TOKEN non impostato!")
        exit(1)

    router = EventRouter(None)
    bot = ZDOSDiscordBot(
        command_prefix=config["discord"]["prefix"],
        config=config,
        event_router=router,
        command_handler_class=CommandHandler
    )
    
    try:
        bot.run(token)
    except Exception as e:
        logger.error(f"Errore fatale: {e}")
