#!/bin/bash
# Livskompassen v2 — Vector Search endpoint (europe-west1, befintligt index)
set -euo pipefail

PROJECT_ID="gen-lang-client-0481875058"
LOCATION="europe-west1"
INDEX_NUMERIC_ID="2686894156982255616"
ENDPOINT_DISPLAY_NAME="livskompassen-kv-endpoint"
DEPLOYED_INDEX_ID="livskompassen_kv_deployed_v1"

gcloud config set project "$PROJECT_ID"
gcloud services enable aiplatform.googleapis.com --quiet

INDEX_RESOURCE="projects/${PROJECT_ID}/locations/${LOCATION}/indexes/${INDEX_NUMERIC_ID}"

ENDPOINT_ID=$(gcloud ai index-endpoints list --region="$LOCATION" \
  --filter="displayName=$ENDPOINT_DISPLAY_NAME" --format="value(name)" 2>/dev/null | head -1)

if [ -z "$ENDPOINT_ID" ]; then
  echo "Skapar index endpoint..."
  gcloud ai index-endpoints create \
    --display-name="$ENDPOINT_DISPLAY_NAME" \
    --region="$LOCATION" \
    --project="$PROJECT_ID"
  ENDPOINT_ID=$(gcloud ai index-endpoints list --region="$LOCATION" \
    --filter="displayName=$ENDPOINT_DISPLAY_NAME" --format="value(name)" | head -1)
fi

ENDPOINT_NUMERIC_ID="${ENDPOINT_ID##*/}"
echo "Endpoint: $ENDPOINT_ID"

DEPLOYED=$(gcloud ai index-endpoints describe "$ENDPOINT_NUMERIC_ID" --region="$LOCATION" \
  --format="value(deployedIndexes.id)" 2>/dev/null || true)

if [ -z "$DEPLOYED" ]; then
  echo "Deployar index (30–60 min)..."
  gcloud ai index-endpoints deploy-index "$ENDPOINT_NUMERIC_ID" \
    --region="$LOCATION" \
    --deployed-index-id="$DEPLOYED_INDEX_ID" \
    --display-name="Livskompassen KV Deployed" \
    --index="$INDEX_RESOURCE"
else
  echo "Index redan deployat: $DEPLOYED"
fi

echo "VECTOR_SEARCH_INDEX_ID=$INDEX_NUMERIC_ID"
echo "VECTOR_SEARCH_ENDPOINT_ID=$ENDPOINT_NUMERIC_ID"
echo "VECTOR_SEARCH_DEPLOYED_INDEX_ID=$DEPLOYED_INDEX_ID"
