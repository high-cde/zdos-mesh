const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    const registryPath = path.join(__dirname, '../../core/registry/modules.json');
    const raw = fs.readFileSync(registryPath, 'utf8');
    const data = JSON.parse(raw);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Registry read error', details: err.message }));
  }
};
