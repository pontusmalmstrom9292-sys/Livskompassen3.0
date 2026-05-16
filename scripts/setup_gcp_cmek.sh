#!/bin/bash

# Livskompassen v2 - GCP KMS & Firestore CMEK Setup
# Detta script konfigurerar Customer-Managed Encryption Keys (CMEK) för Firestore.
# OBS: Firestore-databasen MÅSTE skapas tillsammans med KMS-nyckeln om CMEK ska aktiveras för hela databasen.

PROJECT_ID="gen-lang-client-0481875058" 
LOCATION="europe-north1"              
KEY_RING_NAME="livskompassen-keyring"
KEY_NAME="firestore-cmek-key"

echo "Sätter GCP-projekt till $PROJECT_ID..."
gcloud config set project $PROJECT_ID

echo "Aktiverar nödvändiga API:er..."
gcloud services enable cloudkms.googleapis.com firestore.googleapis.com

echo "Skapar KMS Key Ring..."
gcloud kms keyrings create $KEY_RING_NAME \
    --location=$LOCATION

echo "Skapar KMS Crypto Key..."
gcloud kms keys create $KEY_NAME \
    --location=$LOCATION \
    --keyring=$KEY_RING_NAME \
    --purpose=encryption

echo "Hämtar Cloud Firestore Service Agent Service Account..."
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
FIRESTORE_SA="service-$PROJECT_NUMBER@gcp-sa-firestore.iam.gserviceaccount.com"

echo "Ger Firestore Service Agent rättigheter till KMS-nyckeln..."
gcloud kms keys add-iam-policy-binding $KEY_NAME \
    --keyring=$KEY_RING_NAME \
    --location=$LOCATION \
    --member="serviceAccount:$FIRESTORE_SA" \
    --role="roles/cloudkms.cryptoKeyEncrypterDecrypter"

echo "OBS: För att aktivera CMEK för Firestore måste du skapa databasen med denna nyckel."
echo "Exempel på gcloud-kommando (om du skapar en ny (namngiven) databas, t.ex. 'livskompassen-db'):"
echo ""
echo "gcloud alpha firestore databases create \\"
echo "    --database=livskompassen-db \\"
echo "    --location=$LOCATION \\"
echo "    --type=firestore-native \\"
echo "    --kms-key-name=projects/$PROJECT_ID/locations/$LOCATION/keyRings/$KEY_RING_NAME/cryptoKeys/$KEY_NAME"
echo ""
echo "Script slutfört. Nycklarna är provisionerade."
