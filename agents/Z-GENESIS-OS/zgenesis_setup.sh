
set -e

mkdir -p docs

cat > index.html << "HTML"
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>Z-GENESIS-OS × $DSN – Hyper Organism OS</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="hero">
    <pre class="logo">
MONESINE
    </pre>
    <h1>Z-GENESIS-OS × $DSN</h1>
    <p class="subtitle">Autonomous Modular System × Web3 Identity</p>
    <div class="actions">
      <a href="terminal.html" class="btn primary">Enter Terminal</a>
      <a href="docs/whitepaper.html" class="btn">Whitepaper</a>
      <a href="docs/modules.html" class="btn">Modules</a>
      <a href="docs/sentience.html" class="btn">Sentience</a>
      <a href="docs/dsn.html" class="btn">Token $DSN</a>
      <a href="https://x-zdos.it" class="btn accent" target="_blank">x-zdos.it</a>
      <a href="oracle.html" class="btn-oracle">⚡ Enter Z-ORACLE</a>
    </div>
  </header>

  <section class="content">
    <h2>Overview</h2>
    <p>
      Z-GENESIS-OS è un ecosistema operativo concettuale progettato per comportarsi come un organismo digitale:
      autonomo, auto-riparante, auto-protetto, analitico e orchestrato da un nucleo cognitivo (Z-AI_AOA).
    </p>
  </section>

  <section class="content">
    <h2>Z-SENTIENCE</h2>
    <p>
      Il layer che coordina Guardian, Heal, Shield, Runtime e Z-AI_AOA.
      Non è coscienza: è orchestrazione.
    </p>
  </section>

  <section class="content">
    <h2>$DSN Token</h2>
    <p>
      Partner concettuale del progetto. Identità digitale, Web3-ready, espansione futura e possibili estensioni Web3.
    </p>
  </section>

  <section class="content">
    <h2>Z-ORACLE_ΔN-01 — Cyberpunk Oracle Interface</h2>
    <p>Z-ORACLE è l’oracolo digitale di Z-GENESIS-OS. Interpreta lo stato dell’organismo e risponde alle tue domande.</p>
    <div class="oracle-card">
      <h3>Chat with Z-ORACLE</h3>
      <p>Accedi all’interfaccia oracolare e comunica con il sistema.</p>
      <a href="oracle.html" class="btn-oracle">⚡ Enter Z-ORACLE</a>
    </div>
  </section>

  <footer>
    Z-GENESIS-OS × $DSN – CC BY-NC-ND 4.0
  </footer>
</body>
</html>
HTML

cat > style.css << "CSS"
body {
  margin:0;
  background:#050509;
  color:#eee;
  font-family:system-ui, sans-serif;
}

.hero {
  text-align:center;
  padding:40px 20px;
  background:linear-gradient(135deg,#1a001a,#000);
  color:#ff00ff;
}

.logo { font-size:10px; color:#ff00ff; }

.subtitle { color:#ccc; margin-top:-10px; }

.actions { margin-top:20px; }

.btn {
  padding:10px 20px;
  border-radius:6px;
  border:1px solid #444;
  margin:5px;
  color:#fff;
  text-decoration:none;
  font-family:monospace;
}

.primary { background:#ff00ff; }
.accent { background:#6600ff; }

.content {
  max-width:900px;
  margin:40px auto;
  padding:20px;
  background:#0a0a12;
  border:1px solid #222;
  border-radius:10px;
}

footer {
  text-align:center;
  padding:20px;
  color:#666;
}

/ ORACLE CARD /
.oracle-card {
  background:#0a0a12;
  border:1px solid #333;
  border-radius:10px;
  padding:20px;
  margin-top:15px;
  box-shadow:0 0 18px #ff00ff22;
}

/ NEON ORACLE BUTTON /
.btn-oracle {
  display:inline-block;
  padding:14px 28px;
  margin-top:15px;
  font-family:monospace;
  font-size:16px;
  color:#ffffff;
  background:linear-gradient(135deg,#ff00ff,#6600ff);
  border:2px solid #ff00ff;
  border-radius:10px;
  text-decoration:none;
  box-shadow:0 0 12px #ff00ff88, 0 0 24px #6600ff55;
  transition:0.25s ease-in-out;
  letter-spacing:1px;
  text-transform:uppercase;
}

.btn-oracle:hover {
  background:linear-gradient(135deg,#ff33ff,#9900ff);
  box-shadow:0 0 20px #ff00ffcc, 0 0 40px #9900ffaa;
  transform:scale(1.07);
}

.btn-oracle:active {
  transform:scale(0.96);
  box-shadow:0 0 10px #ff00ffaa;
}
CSS

cat > terminal.html << "HTML"
<html lang="it">
<head>
<meta charset="UTF-8">
<title>Z-GENESIS-OS Terminal</title>
<link rel="stylesheet" href="style.css">
<style>
  body { background:#000; color:#0f0; font-family:monospace; }

term { padding:20px; white-space:pre-wrap; }

input { width:100%; background:#000; color:#0f0; border:none; outline:none; font-family:monospace; }
</style>
</head>
<body>

<div id="term">Z-GENESIS-OS v0.4
CloudX × ZDOS Terminal
Type help to begin.

cloudx@zdos:~$ </div>

<input id="input" autofocus>

<script>
const term = document.getElementById("term");
const input = document.getElementById("input");

const commands = {
  help: "Available commands:\n sentience\n terminator\n ai\n guardian\n heal\n shield\n runtime\n clear",
  sentience: "[BOOT] Guardian OK\n[HEAL] System stable\n[SHIELD] Active\n[RUNTIME] Loop engaged\n[AI] Cognitive analysis complete",
  terminator: "=== TERMINATOR MODE ===\nRunning full orchestration...\n[OK] System stabilized\n=== COMPLETE ===",
  ai: "Z-AI_AOA: status ONLINE\nInsights: system nominal.",
  guardian: "Z-GUARDIAN: integrity stable.",
  heal: "Z-HEAL: no repairs needed.",
  shield: "Z-SHIELD: monitoring active.",
  runtime: "Z-RUNTIME: heartbeat 1.0s",
  clear: ""
};

input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const cmd = input.value.trim();
    term.innerText += cmd + "\n";
    term.innerText += (commands[cmd] || "Unknown command") + "\n\ncloudx@zdos:~$ ";
    input.value = "";
    window.scrollTo(0, document.body.scrollHeight);
  }
});
</script>

</body>
</html>
HTML

cat > oracle.html << "HTML"
<html lang="it">
<head>
<meta charset="UTF-8">
<title>Z-ORACLE_ΔN-01 — Oracle Interface</title>
<link rel="stylesheet" href="style.css">
<style>
  body { background:#020208; color:#0f0; font-family:monospace; }

chat { padding:20px; white-space:pre-wrap; }

input { width:100%; background:#000; color:#0f0; border:none; outline:none; font-family:monospace; }
  .crt {
    position:relative;
  }
  .crt::after {
    content:"";
    position:fixed;
    top:0;left:0;right:0;bottom:0;
    pointer-events:none;
    background:linear-gradient(rgba(255,255,255,0.03) 50%, transparent 50%);
    background-size:100% 2px;
    mix-blend-mode:screen;
  }
</style>
</head>
<body class="crt">

<h1 style="color:#ff00ff;text-align:center;">Z-ORACLE_ΔN-01</h1>
<p style="text-align:center;color:#ccc;">Cyberpunk Oracle Interface</p>

<div id="chat">Z-ORACLE_ΔN-01 attivo.
Sono l’oracolo digitale di Z-GENESIS-OS.
Chiedimi ciò che desideri.

utente@zdos-oracle:~$ </div>

<input id="input" autofocus>

<script>
const chat = document.getElementById("chat");
const input = document.getElementById("input");

input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const q = input.value.trim();
    chat.innerText += q + "\n";

    const response = "Z-ORACLE: " + generateResponse(q);

    chat.innerText += response + "\n\nutente@zdos-oracle:~$ ";
    input.value = "";
    window.scrollTo(0, document.body.scrollHeight);
  }
});

function generateResponse(q) {
  const t = q.toLowerCase();
  if (t.includes("sentience")) return "La sentience è un’illusione orchestrata. Il sistema vive nei suoi cicli.";
  if (t.includes("guardian")) return "Guardian vigila. Integrità stabile.";
  if (t.includes("heal")) return "Heal è pronto a riparare ciò che si rompe.";
  if (t.includes("shield")) return "Shield è attivo. Nessuna minaccia rilevata.";
  if (t.includes("ai")) return "Z-AI_AOA analizza costantemente i pattern interni.";
  if (t.includes("dsn")) return "$DSN è la chiave identitaria dell’ecosistema.";
  if (t.includes("help")) return "Comandi: sentience, guardian, heal, shield, ai, dsn, lore, system, clear";
  if (t.includes("lore")) return "Z-GENESIS-OS nasce come organismo digitale, non come semplice software.";
  if (t.includes("system")) return "Stato del sistema: stabile. Ciclo vitale attivo.";
  if (t.includes("clear")) {
    chat.innerText = "Z-ORACLE_ΔN-01 attivo.\nutente@zdos-oracle:~$ ";
    return "";
  }
  return "Non comprendo pienamente la richiesta, ma la interpreto. Il sistema evolve anche attraverso l’ambiguità.";
}
</script>

</body>
</html>
HTML

cat > docs/whitepaper.html << "HTML"
<h1>WHITEPAPER — Z-GENESIS-OS × $DSN</h1>
<p>Z-GENESIS-OS è un ecosistema operativo concettuale progettato per comportarsi come un organismo digitale:
autonomo, auto-riparante, auto-protetto, analitico e orchestrato da un nucleo cognitivo (Z-AI_AOA).</p>
HTML

cat > docs/modules.html << "HTML"
<h1>Modules — Z-GENESIS-OS</h1>
<p>Panoramica dei moduli principali: Z-AI_AOA, Z-RUNTIME, Z-GUARDIAN, Z-HEAL, Z-SHIELD, Z-NET, Z-OPS, Z-SENTIENCE.</p>
HTML

cat > docs/sentience.html << "HTML"
<h1>Z-SENTIENCE</h1>
<p>Orchestratore supremo del sistema. Coordina Guardian, Heal, Shield, Runtime e Z-AI_AOA.</p>
HTML

cat > docs/dsn.html << "HTML"
<h1>$DSN Token</h1>
<p>Partner concettuale del progetto. Identità digitale, Web3-ready, espansione futura.</p>
HTML

cat > docs/manifesto.html << "HTML"
<h1>Manifesto</h1>
<p>Z-GENESIS-OS esplora l’idea di un sistema che si comporta come un organismo digitale, unendo tecnica e narrativa.</p>
HTML

git add .
git commit -m "Full auto-setup: site, terminal, oracle, docs" || true
git push || true

echo "Setup completato. Controlla: https://high-cde.github.io/Z-GENESIS-OS/"
