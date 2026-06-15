/** Canonical GCP project — matches `.firebaserc` default. */
export const GCP_PROJECT_ID =
  process.env.GCP_PROJECT_ID ??
  process.env.GCLOUD_PROJECT ??
  process.env.GOOGLE_CLOUD_PROJECT ??
  'gen-lang-client-0481875058';

export const GCP_REGION = 'europe-west1' as const;

/** Default Firebase Storage bucket — us-east1 (≠ Functions region). */
export const GCP_STORAGE_BUCKET = `${GCP_PROJECT_ID}.firebasestorage.app`;

/** Storage event triggers must match bucket location. */
export const GCP_STORAGE_TRIGGER_REGION = 'us-east1' as const;
