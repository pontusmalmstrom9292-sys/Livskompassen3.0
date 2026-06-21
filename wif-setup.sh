#!/bin/bash
set -e

PROJECT_ID="gen-lang-client-0481875058"
NEW_EMAIL="rekanred36@gmail.com"
SA_NAME="github-deploy"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
POOL_ID="github-pool"
PROVIDER_ID="github-provider"
REPO_FULL="pontusmalmstrom9292-sys/Livskompassen3.0"

echo "=== 1. Säkerställer autentisering ==="
# Om gcloud inte är inloggad kommer den avbryta eller be om inloggning.
gcloud config set project $PROJECT_ID

echo "=== 2. Lägger till NEW_EMAIL som Owner ==="
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="user:${NEW_EMAIL}" \
  --role="roles/owner" \
  --condition=None || echo "Varning: Kunde inte lägga till Owner. Fortsätter..."

echo "=== 3. Skapar Service Account: $SA_NAME ==="
gcloud iam service-accounts create $SA_NAME \
  --project="$PROJECT_ID" \
  --display-name="GitHub Actions Deploy WIF" || echo "SA kanske redan finns, fortsätter..."

echo "=== 4. Tilldelar minsta nödvändiga roller till Service Account ==="
ROLES=(
  "roles/firebase.admin"
  "roles/cloudfunctions.developer"
  "roles/iam.serviceAccountUser"
  "roles/artifactregistry.admin"
  "roles/cloudbuild.builds.editor"
)
for ROLE in "${ROLES[@]}"; do
  echo "Tilldelar $ROLE..."
  gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="$ROLE" \
    --condition=None > /dev/null
done

echo "=== 5. Skapar Workload Identity Pool: $POOL_ID ==="
gcloud iam workload-identity-pools create $POOL_ID \
  --project="$PROJECT_ID" \
  --location="global" \
  --display-name="GitHub Actions Pool" || echo "Pool kanske redan finns, fortsätter..."

echo "=== 6. Skapar WIF Provider: $PROVIDER_ID ==="
gcloud iam workload-identity-pools providers create-oidc $PROVIDER_ID \
  --project="$PROJECT_ID" \
  --location="global" \
  --workload-identity-pool="$POOL_ID" \
  --display-name="GitHub Actions Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
  --issuer-uri="https://token.actions.githubusercontent.com" || echo "Provider kanske redan finns, fortsätter..."

echo "=== 7. Hämtar Project Number ==="
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
echo "Project Number: $PROJECT_NUMBER"

echo "=== 8. Binder WIF till exakt repository: $REPO_FULL ==="
gcloud iam service-accounts add-iam-policy-binding $SA_EMAIL \
  --project="$PROJECT_ID" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_ID}/attribute.repository/${REPO_FULL}"

echo "=== 9. Genererar variabler för GitHub Actions ==="
PROVIDER_NAME="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_ID}/providers/${PROVIDER_ID}"

echo ""
echo "=== KLART! Här är värdena som ska in i GitHub Secrets ==="
echo "WIF_PROVIDER: $PROVIDER_NAME"
echo "WIF_SERVICE_ACCOUNT: $SA_EMAIL"
echo "GCP_PROJECT_ID: $PROJECT_ID"
