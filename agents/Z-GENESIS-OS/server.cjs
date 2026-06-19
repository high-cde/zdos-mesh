const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// /api/modules
function handleModules(req, res) {
  try {
    const registryPath = path.join(__dirname, 'core/registry/modules.json');
    const raw = fs.readFileSync(registryPath, 'utf8');
    const data = JSON.parse(raw);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Registry read error', details: err.message }));
  }
}

// /api/<module>/heartbeat
function handleHeartbeat(req, res, moduleName) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    module: moduleName,
    status: "online",
    timestamp: Date.now()
  }));
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);

  if (parsed.pathname === '/api/modules') {
    return handleModules(req, res);
  }

  const hbMatch = parsed.pathname.match(/^\/api\/([^\/]+)\/heartbeat$/);
  if (hbMatch) {
    return handleHeartbeat(req, res, hbMatch[1]);
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(3000, () => {
  console.log('Z-GENESIS-OS API server running on port 3000');
});
