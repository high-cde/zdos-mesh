import express from "express";
import { Kernel } from "./core/kernel.js";
import { think } from "./z-ai/engine.js";
import { oracleQuery } from "./oracle/engine.js";
import { loadDSN } from "./dsn/engine.js";

const app = express();
app.use(express.json());

// Boot del sistema
Kernel.boot();

// Heartbeat
app.get("/heartbeat", (req, res) => {
  res.json({ status: "alive", timestamp: Date.now() });
});

// AI_AOA
app.post("/ai", (req, res) => {
  think();
  res.json({ status: "AI_AOA cycle executed", input: req.body });
});

// DSN
app.get("/dsn", (req, res) => {
  const dsn = loadDSN();
  res.json({ status: "ok", dsn });
});

// Z-ORACLE
app.post("/oracle/query", async (req, res) => {
  const result = await oracleQuery(req.body || {});
  res.json(result);
});

// Avvio server
app.listen(3000, () => {
  console.log("[Z-GENESIS-OS] Online at port 3000");
});
