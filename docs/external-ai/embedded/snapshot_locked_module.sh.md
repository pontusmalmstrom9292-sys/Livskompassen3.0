# Embedded: snapshot_locked_module.sh

Kopiera till `scripts/snapshot_locked_module.sh`:

```bash
#!/usr/bin/env bash
# Snapshot locked module to ~/Livskompassen-snapshots/
# Usage: ./scripts/snapshot_locked_module.sh valv|inkast|synapser|upload-unified

set -euo pipefail

MODULE="${1:-}"
if [[ -z "$MODULE" ]]; then
  echo "Usage: $0 <valv|inkast|synapser|upload-unified>"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DATE="$(date +%Y-%m-%d)"
DEST="$HOME/Livskompassen-snapshots/${DATE}-${MODULE}"
MANIFEST="$ROOT/docs/external-ai/MODULE-SNAPSHOT-MANIFESTS.md"

mkdir -p "$DEST"

copy_path() {
  local rel="$1"
  local src="$ROOT/$rel"
  if [[ -e "$src" ]]; then
    local dest_dir="$DEST/$(dirname "$rel")"
    mkdir -p "$dest_dir"
    cp -R "$src" "$dest_dir/"
    echo "[ok] $rel"
  else
    echo "[skip] missing: $rel"
  fi
}

in_section=0
while IFS= read -r line; do
  if [[ "$line" == "## $MODULE" ]]; then
    in_section=1
    continue
  fi
  if [[ $in_section -eq 1 && "$line" == "## "* ]]; then
    break
  fi
  if [[ $in_section -eq 1 && "$line" =~ ^[a-zA-Z0-9/] ]]; then
    copy_path "$line"
  fi
done < "$MANIFEST"

GIT_COMMIT=""
if command -v git &>/dev/null && git -C "$ROOT" rev-parse HEAD &>/dev/null; then
  GIT_COMMIT="$(git -C "$ROOT" rev-parse --short HEAD)"
fi

cat > "$DEST/SNAPSHOT-MANIFEST.md" <<EOF
# Snapshot: $MODULE

- **Datum:** $DATE
- **Git commit:** ${GIT_COMMIT:-unknown}
- **Källa:** $ROOT
- **Modul:** $MODULE

Återställ: kopiera filer tillbaka till motsvarande sökvägar i projektrot.

Smoke vid snapshot: se docs/external-ai/LIFE-OS-BUILD-STATE.md
EOF

echo ""
echo "Snapshot klar: $DEST"
```
