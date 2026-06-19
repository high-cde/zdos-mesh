#!/bin/bash

echo "[SOVRANA-EXTENDER] Installazione in corso..."

BASE=~/Z-GENESIS-OS/z-ai/agi/core/lupenox

mkdir -p $BASE
mkdir -p ~/Z-GENESIS-OS/z-ai/agi/data
mkdir -p ~/Z-GENESIS-OS/zshell/zones

###############################################
# LLM EXTENDER
###############################################
cat > $BASE/llm_extender.py << 'EOF'
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch, requests

class LLMExtender:
    def __init__(self):
        self.backends = {}
        self.active = None

    def add_hf_model(self, name, device=None):
        device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        tokenizer = AutoTokenizer.from_pretrained(name)
        model = AutoModelForCausalLM.from_pretrained(
            name,
            torch_dtype=torch.float16 if device == "cuda" else torch.float32,
            device_map="auto" if device == "cuda" else None
        )
        self.backends[name] = pipeline(
            "text-generation",
            model=model,
            tokenizer=tokenizer,
            device=0 if device == "cuda" else -1
        )
        self.active = name

    def add_api_backend(self, name, endpoint, key):
        self.backends[name] = {"endpoint": endpoint, "key": key}
        self.active = name

    def use(self, name):
        if name in self.backends:
            self.active = name

    def generate(self, prompt, max_tokens=200, temperature=0.7):
        backend = self.backends[self.active]

        if isinstance(backend, dict):
            r = requests.post(
                backend["endpoint"],
                headers={"Authorization": f"Bearer {backend['key']}"},
                json={"prompt": prompt, "max_tokens": max_tokens}
            )
            return r.json().get("text", "")

        out = backend(
            prompt,
            max_new_tokens=max_tokens,
            temperature=temperature,
            do_sample=True,
            top_k=50,
            top_p=0.95
        )
        return out[0]["generated_text"].strip()
EOF

###############################################
# MEMORY LONGTERM
###############################################
cat > $BASE/memory_longterm.py << 'EOF'
import json, os, numpy as np
from sentence_transformers import SentenceTransformer

class LongTermMemory:
    def __init__(self, path="data/ltm.json"):
        self.path = path
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.data = []

        if os.path.exists(path):
            with open(path, "r") as f:
                self.data = json.load(f)

    def add(self, text):
        embedding = self.model.encode(text).tolist()
        self.data.append({"text": text, "embedding": embedding})
        self._save()

    def search(self, query, top_k=3):
        q_emb = self.model.encode(query)
        scored = []

        for item in self.data:
            emb = np.array(item["embedding"])
            score = np.dot(q_emb, emb) / (np.linalg.norm(q_emb) * np.linalg.norm(emb))
            scored.append((score, item["text"]))

        scored.sort(reverse=True)
        return [t for _, t in scored[:top_k]]

    def _save(self):
        with open(self.path, "w") as f:
            json.dump(self.data, f, indent=2)
EOF

###############################################
# TOOLS
###############################################
cat > $BASE/tools.py << 'EOF'
import subprocess, json, requests, os

class Tools:
    def shell(self, command):
        try:
            return subprocess.check_output(command, shell=True, text=True)
        except Exception as e:
            return str(e)

    def read_file(self, path):
        if not os.path.exists(path):
            return "File non trovato."
        with open(path, "r") as f:
            return f.read()

    def write_file(self, path, content):
        with open(path, "w") as f:
            f.write(content)
        return "OK"

    def http_get(self, url):
        try:
            return requests.get(url).text
        except:
            return "Errore nella richiesta HTTP."
EOF

###############################################
# PLANNER
###############################################
cat > $BASE/planner.py << 'EOF'
class Planner:
    def decompose(self, goal):
        steps = [
            f"Analisi del problema: {goal}",
            "Identificazione informazioni rilevanti",
            "Recupero memoria a lungo termine",
            "Generazione ipotesi",
            "Selezione strategia migliore",
            "Produzione risposta finale"
        ]
        return steps
EOF

###############################################
# UPDATE REASONING
###############################################
cat > $BASE/../reasoning.py << 'EOF'
from llm_extender import LLMExtender
from memory_longterm import LongTermMemory
from tools import Tools
from planner import Planner

class Reasoner:
    def __init__(self, memory):
        self.memory = memory
        self.ltm = LongTermMemory()
        self.tools = Tools()
        self.planner = Planner()
        self.llm = LLMExtender()

        self.llm.add_api_backend(
            "api_default",
            endpoint="https://api.example.com/generate",
            key="API_KEY"
        )

    def think(self, input_text):
        steps = self.planner.decompose(input_text)
        context = self.ltm.search(input_text)
        prompt = f"Goal: {input_text}\nSteps: {steps}\nMemoria rilevante: {context}\nRispondi:"
        response = self.llm.generate(prompt)
        self.ltm.add(input_text)
        return response
EOF

###############################################
# Z-AGI LAUNCHER
###############################################
cat > ~/Z-GENESIS-OS/zshell/zones/z-agi.sh << 'EOF'
#!/bin/bash
source ~/Z-GENESIS-OS/z-ai/agi/venv/bin/activate
python3 ~/Z-GENESIS-OS/z-ai/agi/agents/sovrana.py
EOF
chmod +x ~/Z-GENESIS-OS/zshell/zones/z-agi.sh

###############################################
# GIT ALIAS
###############################################
git config --global alias.zpush '!git add . && git commit -m "Sync: $(date)" && git push'

echo "[SOVRANA-EXTENDER] Installazione completata."
