#!/bin/bash

# Livskompassen v2 - Vertex AI Vector Search Setup
# Detta skript provisionerar ett RAG-index (Vector Search) i Google Cloud för Minne.
# Det använder textembedding-gecko.

PROJECT_ID="gen-lang-client-0481875058"
LOCATION="europe-north1"
INDEX_DISPLAY_NAME="kampspar_index"
ENDPOINT_DISPLAY_NAME="kampspar_endpoint"
# Inbäddningsmodell (Gecko ger 768 dimensioner)
DIMENSIONS=768

echo "Sätter GCP-projekt till $PROJECT_ID..."
gcloud config set project $PROJECT_ID

echo "Aktiverar Vertex AI API..."
gcloud services enable aiplatform.googleapis.com

echo "Skapar Vector Search Index (detta kan ta upp till 60 minuter i GCP)..."
gcloud ai indexes create \
  --display-name=$INDEX_DISPLAY_NAME \
  --description="Vektorindex för Livskompassens Minne (RAG)" \
  --metadata-file="scripts/index_metadata.json" \
  --region=$LOCATION

echo "Hämtar ID för nyskapade Indexet..."
INDEX_ID=$(gcloud ai indexes list --region=$LOCATION --filter="displayName=$INDEX_DISPLAY_NAME" --format="value(name)")

if [ -z "$INDEX_ID" ]; then
    echo "Kunde inte hitta Index ID. Avbryter."
    exit 1
fi

echo "Skapar Index Endpoint för att servera sökningar..."
gcloud ai index-endpoints create \
  --display-name=$ENDPOINT_DISPLAY_NAME \
  --network="projects/${PROJECT_ID}/global/networks/default" \
  --region=$LOCATION

echo "Hämtar ID för Endpointen..."
ENDPOINT_ID=$(gcloud ai index-endpoints list --region=$LOCATION --filter="displayName=$ENDPOINT_DISPLAY_NAME" --format="value(name)")

echo "Distribuerar Indexet till Endpointen (detta tar också tid)..."
gcloud ai index-endpoints deploy-index $ENDPOINT_ID \
  --deployed-index-id="kampspar_deployed_v1" \
  --display-name="Minne Deployed" \
  --index=$INDEX_ID \
  --region=$LOCATION

echo "=== Vector Search 2.0 är nu uppsatt! ==="
echo "Index ID: $INDEX_ID"
echo "Endpoint ID: $ENDPOINT_ID"
echo "Du kan nu skicka 'textembedding-gecko' inbäddningar till denna endpoint för RAG."

