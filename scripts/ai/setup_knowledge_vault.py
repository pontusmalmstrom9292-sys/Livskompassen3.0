import os
import json
import time

import vertexai
from vertexai.language_models import TextEmbeddingModel
from vertexai.resources.preview.matching_engine import MatchingEngineIndex, MatchingEngineIndexEndpoint
from google.cloud import storage
from google.api_core import exceptions

# --- VIKTIGA INSTÄLLNINGAR (ÄNDRA DESSA) ---
# Välj ett unikt namn för din Google Cloud Storage bucket.
# Det måste vara globalt unikt (inga andra i världen kan ha samma namn).
# Använd små bokstäver, siffror och bindestreck.
BUCKET_NAME = "ditt-unika-bucket-namn-for-kunskapsvalv"

# --- AVANCERADE INSTÄLLNINGAR (kan lämnas som de är) ---
INDEX_DISPLAY_NAME = "kunskapsvalv-index"
ENDPOINT_DISPLAY_NAME = "kunskapsvalv-endpoint"
DEPLOYED_INDEX_ID = "deployed_knowledge_vault_v1"
EMBEDDINGS_FILE_NAME = "knowledge_vault_data.json"

# --- Automatiska inställningar ---
PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT")
LOCATION = os.getenv("GOOGLE_CLOUD_LOCATION", "europe-west1")
GCS_EMBEDDINGS_DIR = f"gs://{BUCKET_NAME}/embeddings"


def setup_gcs_bucket(bucket_name: str, location: str):
    """Skapar en GCS-bucket om den inte redan finns."""
    print(f"Kontrollerar GCS bucket '{bucket_name}'...")
    storage_client = storage.Client(project=PROJECT_ID)
    try:
        bucket = storage_client.get_bucket(bucket_name)
        print("Bucket finns redan.")
    except exceptions.NotFound:
        print("Bucket hittades inte, skapar ny...")
        bucket = storage_client.create_bucket(bucket_name, location=location)
        print(f"Bucket '{bucket.name}' skapad.")
    return bucket

def create_and_upload_embeddings(documents: dict, bucket: storage.Bucket):
    """Skapar embeddings, sparar lokalt och laddar upp till GCS."""
    print("1. Skapar embeddings för dina dokument...")
    model = TextEmbeddingModel.from_pretrained("text-embedding-004")
    ids = list(documents.keys())
    texts = list(documents.values())
    
    embeddings = model.get_embeddings(texts)
    
    # Skapa JSONL-filen lokalt
    with open(EMBEDDINGS_FILE_NAME, "w") as f:
        for doc_id, embedding in zip(ids, embeddings):
            record = {"id": doc_id, "embedding": embedding.values}
            f.write(json.dumps(record) + "\n")
            
    print(f"2. Laddar upp '{EMBEDDINGS_FILE_NAME}' till GCS...")
    blob = bucket.blob(f"embeddings/{EMBEDDINGS_FILE_NAME}")
    blob.upload_from_filename(EMBEDDINGS_FILE_NAME)
    
    # Städa upp den lokala filen
    os.remove(EMBEDDINGS_FILE_NAME)
    print("Uppladdning klar och lokal fil borttagen.")

def create_vector_search_resources():
    """Skapar och driftsätter Vector Search Index och Endpoint."""
    # Skapa index
    print("3. Skapar Vector Search Index (detta kan ta 20-30 minuter)...")
    vector_index = MatchingEngineIndex.create_tree_ah_index(
        display_name=INDEX_DISPLAY_NAME,
        contents_delta_uri=GCS_EMBEDDINGS_DIR,
        dimensions=768,  # Dimension för text-embedding-004
        approximate_neighbors_count=10,
        distance_measure_type="COSINE_DISTANCE",
    )
    print(f"Index skapat med resursnamn: {vector_index.resource_name}")

    # Skapa endpoint
    print("4. Skapar Index Endpoint...")
    index_endpoint = MatchingEngineIndexEndpoint.create(
        display_name=ENDPOINT_DISPLAY_NAME,
        public_endpoint_enabled=True,
    )
    print(f"Endpoint skapad med resursnamn: {index_endpoint.resource_name}")

    # Driftsätt index till endpoint
    print("5. Driftsätter index till endpoint (detta kan ta ca 10 minuter)...")
    index_endpoint.deploy_index(
        index=vector_index, deployed_index_id=DEPLOYED_INDEX_ID
    )
    print("Driftsättning klar!")
    return index_endpoint.name, DEPLOYED_INDEX_ID


if __name__ == "__main__":
    if not PROJECT_ID:
        raise ValueError("Miljövariabeln GOOGLE_CLOUD_PROJECT är inte satt.")
    if BUCKET_NAME == "ditt-unika-bucket-namn-for-kunskapsvalv":
        raise ValueError("Du måste ändra BUCKET_NAME i skriptet till ett unikt värde.")

    # Initiera Vertex AI
    vertexai.init(project=PROJECT_ID, location=LOCATION)

    # Dokumenten som ska finnas i kunskapsvalvet
    documents_to_index = {
        "doc_1": "Företagets policy för hemarbete är max 3 dagar i veckan. Man måste vara på kontoret tisdagar och torsdagar.",
        "doc_2": "För att återställa ditt lösenord till IT-systemet, ring supporten på 08-123 45 67 eller maila it@foretaget.se.",
        "doc_3": "Kaffemaskinen på plan 3 rengörs varje fredag eftermiddag."
    }

    # Steg 1 & 2: Skapa bucket, skapa embeddings och ladda upp
    bucket = setup_gcs_bucket(BUCKET_NAME, LOCATION)
    create_and_upload_embeddings(documents_to_index, bucket)

    # Steg 3, 4 & 5: Skapa och driftsätt Vector Search-resurser
    endpoint_id, deployed_id = create_vector_search_resources()

    print("\n" + "="*50)
    print("✅ GRATTIS! Ditt kunskapsvalv är nu byggt och redo!")
    print("Kopiera följande värden och klistra in dem i din huvudapplikation:")
    print("-" * 50)
    print(f'INDEX_ENDPOINT_ID = "{endpoint_id}"')
    print(f'DEPLOYED_INDEX_ID = "{deployed_id}"')
    print("="*50)
