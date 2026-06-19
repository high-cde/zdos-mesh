#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import discord
from discord.ext import commands
import time

class CommandHandler:
    def __init__(self, bot, event_router):
        self.bot = bot
        self.event_router = event_router
        self._register_internal_commands()

    def _register_internal_commands(self):
        @self.bot.command(name="ping")
        async def ping(ctx):
            latency = round(self.bot.latency * 1000)
            await ctx.send(f"🏓 Pong! Latenza: {latency}ms")

        @self.bot.command(name="info")
        async def info(ctx):
            embed = discord.Embed(title="ZDOS-DISCORD-OPENCLAW", color=0x00ff00)
            embed.add_field(name="Versione", value="1.0.0-stable", inline=True)
            embed.add_field(name="Status", value="Online", inline=True)
            embed.add_field(name="Moduli", value="OpenClaw, Core, EventRouter", inline=False)
            await ctx.send(embed=embed)

        @self.bot.command(name="openclaw")
        async def openclaw(ctx, action=None, *, target=None):
            if not action:
                await ctx.send("Uso: `!openclaw <scan|plan|act> <target>`")
                return
            
            msg = await ctx.send(f"🔄 **OpenClaw Pipeline**: Inizializzazione fase `{action}`...")
            time.sleep(1) # Simulazione elaborazione
            await msg.edit(content=f"✅ **OpenClaw Pipeline**: Fase `{action}` completata per `{target or 'global'}`.")

        @self.bot.command(name="zdos")
        async def zdos(ctx, cmd=None):
            if cmd == "sync":
                await ctx.send("🔄 Sincronizzazione canali ZDOS in corso...")
                await self.bot._initialize_zdos_channels()
                await ctx.send("✅ Sincronizzazione completata.")
            else:
                await ctx.send("Comandi ZDOS disponibili: `sync`")

        @self.bot.command(name="clear")
        @commands.has_permissions(manage_messages=True)
        async def clear(ctx, amount: int = 5):
            await ctx.channel.purge(limit=amount + 1)
            await ctx.send(f"🧹 Puliti {amount} messaggi.", delete_after=3)
