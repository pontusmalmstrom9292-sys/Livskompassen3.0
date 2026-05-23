#!/usr/bin/env bash
# Skapar/uppdaterar Secret Manager-secrets för Vite-build i Cloud Build.
# Läser från .env i projektroten (committas aldrig).
#
# Användning:
#   cd Livskompassen2.0
#   ./scripts/cloudbuild/sync-vite-secrets.sh
#   ./scripts/cloudbuild/sync-vite-secrets.sh --project gen-lang-client-0481875058

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
ENV_FILE="${ROOT}/.env"
PROJECT="gen-lang-client-0481875058"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --project)
      PROJECT="${2:?--project kräver projekt-id}"
      shift 2
      ;;
    *)
      echo "Okänd flagga: $1" >&2
      exit 1
      ;;
  esac
done

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Saknar $ENV_FILE — kopiera från .env.example och fyll i VITE_FIREBASE_*." >&2
  exit 1
fi

# shellcheck disable=SC1090
set -a
source "$ENV_FILE"
set +a

REQUIRED=(
  VITE_FIREBASE_API_KEY
  VITE_FIREBASE_AUTH_DOMAIN
  VITE_FIREBASE_PROJECT_ID
  VITE_FIREBASE_STORAGE_BUCKET
  VITE_FIREBASE_MESSAGING_SENDER_ID
  VITE_FIREBASE_APP_ID
)

for key in "${REQUIRED[@]}"; do
  val="${!key:-}"
  if [[ -z "$val" ]]; then
    echo "Saknar $key i .env" >&2
    exit 1
  fi
  if gcloud secrets describe "$key" --project="$PROJECT" &>/dev/null; then
    printf '%s' "$val" | gcloud secrets versions add "$key" --project="$PROJECT" --data-file=-
    echo "Uppdaterade secret: $key"
  else
    printf '%s' "$val" | gcloud secrets create "$key" --project="$PROJECT" --data-file=-
    echo "Skapade secret: $key"
  fi
done

PROJECT_NUMBER="$(gcloud projects describe "$PROJECT" --format='value(projectNumber)')"
CB_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

for key in "${REQUIRED[@]}"; do
  gcloud secrets add-iam-policy-binding "$key" \
    --project="$PROJECT" \
    --member="serviceAccount:${CB_SA}" \
    --role="roles/secretmanager.secretAccessor" \
    --quiet >/dev/null
done

echo "Klart. Cloud Build SA (${CB_SA}) kan läsa VITE_FIREBASE_* secrets."
