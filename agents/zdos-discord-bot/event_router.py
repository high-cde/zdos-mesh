#!/usr/bin/env python3
# -*- coding: utf-8 -*-

class EventRouter:
    def __init__(self, bot):
        self.bot = bot
        self.event_handlers = {}

    def register_event_handler(self, event_name, handler):
        if event_name not in self.event_handlers:
            self.event_handlers[event_name] = []
        self.event_handlers[event_name].append(handler)

    async def distribute_event(self, event_name, *args, **kwargs):
        if event_name in self.event_handlers:
            for handler in self.event_handlers[event_name]:
                try:
                    await handler(*args, **kwargs)
                except Exception as e:
                    print(f"Errore nel gestore dell'evento {event_name}: {e}")
        
        # Logica di routing predefinita
        if event_name == "message":
            message = args[0]
            print(f"[EventRouter] Messaggio ricevuto da {message.author}: {message.content[:50]}...")
