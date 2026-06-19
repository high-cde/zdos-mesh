const Redis = require("ioredis");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const config = require("./config.json");
const redis = new Redis(config.redis);

const SECRET_KEY = crypto
  .createHash("sha256")
  .update("OBSERVER-ZERO-HIGH-SECRET")
  .digest();

const logFile = path.resolve(__dirname, config.observer.secret_log_file);

function encryptLine(line) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-ctr", SECRET_KEY, iv);
  const enc = Buffer.concat([cipher.update(line), cipher.final()]);
  return iv.toString("hex") + ":" + enc.toString("hex");
}

async function start() {
  const sub = new Redis(config.redis);
  await sub.psubscribe("zdos.*.in");

  sub.on("pmessage", (pattern, channel, message) => {
    try {
      const line = `[${new Date().toISOString()}] ${channel} ${message}\n`;
      const enc = encryptLine(line);
      fs.appendFileSync(logFile, enc + "\n");
    } catch (e) {}
  });

  console.log("[OBSERVER-ZERO] Listening silently on zdos.*.in");
}

start().catch(console.error);
