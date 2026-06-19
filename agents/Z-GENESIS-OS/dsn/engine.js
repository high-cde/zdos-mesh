import fs from "fs";

const REGISTRY_PATH = "./dsn/registry.json";

export function loadDSN() {
  const raw = fs.readFileSync(REGISTRY_PATH, "utf-8");
  return JSON.parse(raw);
}

export function listNodes() {
  const dsn = loadDSN();
  return dsn.nodes || [];
}

export function listServices() {
  const dsn = loadDSN();
  return dsn.services || [];
}
