

⚡ ZDOS‑AGI — Cognitive Node v2
Sistema AGI modulare, orchestrato e compatibile con Termux + Python 3.13

!Status
!Python
!Platform

---

🧬 Visione
ZDOS‑AGI è un nodo cognitivo modulare, progettato per operare come un micro‑OS intelligente:

- Router AGI  
- Agenti modulari (GitHub, Ops, Discord)  
- API Starlette  
- Bot Discord (nextcord)  
- Architettura asincrona  
- Compatibile con Termux (Android)  

---

📁 Struttura del progetto

`
zdos-agi/
 ├── main.py
 ├── requirements.txt
 ├── config/
 │    └── settings.yaml
 ├── io_layer/
 │    ├── api.py
 │    ├── discord_bot.py
 │    └── init.py
 ├── kernel/
 │    ├── router.py
 │    ├── task.py
 │    └── init.py
 ├── agents/
 │    ├── github_agent.py
 │    ├── ops_agent.py
 │    ├── discord_agent.py
 │    └── init.py
 └── README.md
`

---

⚙️ Installazione (Termux Ready)

1) Installa Python 3.13
Termux:
`sh
pkg update && pkg upgrade
pkg install python git
`

2) Clona il repo
`sh
git clone https://github.com/z-dos/zdos-agi
cd zdos-agi
`

3) Installa le dipendenze
`sh
pip install -r requirements.txt
`

---

🔧 Configurazione

Modifica:

`
config/settings.yaml
`

E inserisci:

`yaml
discord:
  token: "TOKEN_DISCORD"
  prefix: "!"

github:
  token: "TOKEN_GITHUB"
  username: "USERNAME"
`

---

🚀 Avvio del sistema

`sh
python main.py
`

Il nodo avvia:

- API Starlette su 0.0.0.0:8000
- Bot Discord (nextcord)

---

🧠 Router AGI

Il router gestisce i task:

`python
Task("github.list_repos")
Task("github.create_issue")
Task("ops.health")
`

---

🤖 Comandi Discord

Lista repo
`
!repos
`

Crea issue
`
!issue nome_repo titolo dell’issue
`

---

🌐 API

Health check
`
GET /health
`

Risposta:
`json
{"status": "ok"}
`

---

🛠 Tecnologie

- Python 3.13  
- nextcord  
- Starlette  
- Uvicorn (async server)  
- GitHub API  
- Termux compatibility  

---

🧩 Roadmap

- [ ] AGI Planner /zdos
- [ ] CodeGen Agent
- [ ] GitHub → Discord Feed
- [ ] Memory Engine
- [ ] Shell virtuale ZDOS

---

🧑‍💻 Autore
High — ZDOS Architect  
`

