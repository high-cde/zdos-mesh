import { listNodes, listServices } from "../dsn/engine.js";

export async function oracleQuery(payload = {}) {
  const nodes = listNodes();
  const services = listServices();

  return {
    status: "ok",
    message: "Z-ORACLE online",
    payload,
    topology: {
      nodes,
      services
    }
  };
}
