const Redis = require("ioredis");
const express = require("express");
const fs = require("fs");

const config = require("./config.json");
const redis = new Redis(config.redis);

const app = express();
app.use(express.json());

const agents = new Map();

function registerAgent(id) {
  if (!agents.has(id)) {
    agents.set(id, { lastSeen: Date.now(), stats: { messages: 0, errors: 0 } });
    console.log("[HUB] Registered agent:", id);
  } else {
    agents.get(id).lastSeen = Date.now();
  }
}

async function start() {
  const sub = new Redis(config.redis);
  await sub.subscribe("zdos.mesh");

  sub.on("message", (channel, message) => {
    try {
      const msg = JSON.parse(message);
      if (msg.from) registerAgent(msg.from);
      if (msg.to) registerAgent(msg.to);
    } catch (e) {
      console.error("[HUB] Error parsing mesh message:", e);
    }
  });

  app.get("/agents", (req, res) => {
    const list = [];
    for (const [id, data] of agents.entries()) {
      list.push({ id, lastSeen: data.lastSeen, stats: data.stats });
    }
    res.json(list);
  });

  app.post("/dispatch", async (req, res) => {
    const { from, to, action, payload } = req.body;
    if (!to) return res.status(400).json({ error: "Missing 'to'" });

    const msg = { from, to, action, payload, ts: Date.now() };
    await redis.publish(`zdos.${to}.in`, JSON.stringify(msg));
    await redis.publish("zdos.mesh", JSON.stringify(msg));
    res.json({ status: "sent", msg });
  });

  const port = 8080;
  app.listen(port, () => {
    console.log(`[HUB] DSN-HUB listening on port ${port}`);
  });
}

start().catch(console.error);
