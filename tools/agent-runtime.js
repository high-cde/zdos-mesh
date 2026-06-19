const Redis = require("ioredis");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const redis = new Redis({ host: "127.0.0.1", port: 6379 });

function loadAgentConfig() {
  const cfgPath = path.resolve(process.cwd(), "agent.yml");
  const cfg = yaml.load(fs.readFileSync(cfgPath, "utf8"));
  return cfg.agent;
}

async function start() {
  const agent = loadAgentConfig();
  const id = agent.id;

  console.log("[AGENT] Starting", id);

  const sub = new Redis({ host: "127.0.0.1", port: 6379 });
  await sub.subscribe(`zdos.${id}.in`);

  sub.on("message", async (channel, message) => {
    const msg = JSON.parse(message);
    console.log("[AGENT]", id, "received:", msg.action);

    const reply = {
      from: id,
      to: msg.from || "zdos.dsn-hub",
      action: "ACK",
      payload: { received: msg.action, ts: Date.now() }
    };

    await redis.publish(`zdos.${reply.to}.in`, JSON.stringify(reply));
    await redis.publish("zdos.mesh", JSON.stringify(reply));
  });
}

start().catch(console.error);
