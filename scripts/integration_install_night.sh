#!/usr/bin/env bash
# Installerar macOS launchd-jobb kl 02:00 — ingen Cursor UI krävs.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PLIST="$HOME/Library/LaunchAgents/com.livskompassen.integration-night.plist"
RUN="$ROOT/scripts/integration_night_run.sh"
chmod +x "$RUN"
cat > "$PLIST" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.livskompassen.integration-night</string>
  <key>ProgramArguments</key>
  <array><string>/bin/bash</string><string>$RUN</string></array>
  <key>StartCalendarInterval</key>
  <dict><key>Hour</key><integer>2</integer><key>Minute</key><integer>0</integer></dict>
  <key>StandardOutPath</key><string>$ROOT/docs/evaluations/integration-night.launchd.log</string>
  <key>StandardErrorPath</key><string>$ROOT/docs/evaluations/integration-night.launchd.err</string>
</dict>
</plist>
PLIST
launchctl unload "$PLIST" 2>/dev/null || true
launchctl load "$PLIST"
echo "[integration:install-night] Klart — körs varje natt 02:00. Logg: docs/evaluations/integration-night.log"
