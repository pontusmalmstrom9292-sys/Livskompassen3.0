#!/usr/bin/env bash
# Engång: pusha VITE_FIREBASE_* från lokal .env till GitHub Actions secrets (Livskompassen3.0).
# Kräver: brew install gh && gh auth login
# Se docs/CI-HOSTING.md

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

GITHUB_REPO="${GITHUB_REPO:-pontusmalmstrom9292-sys/Livskompassen3.0}"
ENV_FILE="${ENV_FILE:-.env}"

if ! command -v gh >/dev/null 2>&1; then
  echo "Saknar GitHub CLI. Installera: brew install gh"
  echo "Logga in: gh auth login"
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Saknar $ENV_FILE i projektroten. Kopiera från .env.example och fyll i VITE_FIREBASE_*."
  exit 1
fi

# shellcheck disable=SC1090
set -a
# shellcheck source=/dev/null
source "$ENV_FILE"
set +a

KEYS=(
  VITE_FIREBASE_API_KEY
  VITE_FIREBASE_AUTH_DOMAIN
  VITE_FIREBASE_PROJECT_ID
  VITE_FIREBASE_STORAGE_BUCKET
  VITE_FIREBASE_MESSAGING_SENDER_ID
  VITE_FIREBASE_APP_ID
)

missing=0
for key in "${KEYS[@]}"; do
  val="${!key:-}"
  if [[ -z "$val" || "$val" == "YOUR_"* ]]; then
    echo "Saknar eller ogiltigt värde för $key i $ENV_FILE"
    missing=1
  fi
done
[[ "$missing" -eq 0 ]] || exit 1

echo "Sätter ${#KEYS[@]} secrets på $GITHUB_REPO …"
for key in "${KEYS[@]}"; do
  gh secret set "$key" --repo "$GITHUB_REPO" --body "${!key}"
  echo "  OK $key"
done

if [[ -n "${1:-}" ]]; then
  SA_JSON="$1"
  if [[ ! -f "$SA_JSON" ]]; then
    echo "Service account-fil finns inte: $SA_JSON"
    exit 1
  fi
  gh secret set FIREBASE_SERVICE_ACCOUNT --repo "$GITHUB_REPO" --body-file "$SA_JSON"
  echo "  OK FIREBASE_SERVICE_ACCOUNT (från $SA_JSON)"
else
  echo ""
  echo "Tips: kör med JSON-nyckel för deploy:"
  echo "  $0 ~/Downloads/gen-lang-client-0481875058-xxxx.json"
fi

echo ""
echo "Klart. Verifiera: https://github.com/$GITHUB_REPO/settings/secrets/actions"
