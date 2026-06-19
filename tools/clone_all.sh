#!/data/data/com.termux/files/usr/bin/bash

USER="high-cde"
TARGET_DIR="$HOME/zdos-mesh/agents"

mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR"

echo "[*] Fetching repos for user: $USER"

curl -s "https://api.github.com/users/$USER/repos?per_page=100" \
  | jq -r '.[].clone_url' \
  | while read url; do
      name=$(basename "$url" .git)

      echo ""
      echo "=== Checking $name ==="

      # Skip if already exists
      if [ -d "$name" ]; then
        echo "[=] Repo $name already exists, skipping"
        continue
      fi

      # Check repo size (skip > 50MB)
      size=$(curl -s "https://api.github.com/repos/$USER/$name" | jq '.size')
      if [ "$size" -gt 50000 ]; then
        echo "[!] Skipping $name (too large: ${size}KB)"
        continue
      fi

      echo "[+] Cloning $name (light mode)"
      git clone --depth 1 --filter=blob:none "$url" "$name"
    done
