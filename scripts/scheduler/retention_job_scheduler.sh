/**
 * Cloud Scheduler Jobs - Livskompassen v2
 *
 * Driftsätt med:
 *   gcloud scheduler jobs create pubsub livskompassen-retention-job \
 *     --schedule="0 3 * * *" \
 *     --time-zone="Europe/Stockholm" \
 *     --topic=firebase-schedule-scheduledRetentionJob-europe-west1 \
 *     --message-body="{}" \
 *     --location=europe-west1
 *
 * Notera: scheduledRetentionJob i index.ts skapar automatiskt ett
 * Cloud Scheduler-jobb vid deploy via Firebase Functions.
 * Denna fil dokumenterar det manuella alternativet för Cloud Run Jobs.
 */

# ─── Cloud Run Job: GDPR Retention (alternativt fristående jobb) ─────────────
#
# Om du föredrar att köra retentionJob som ett helt fristående Cloud Run Job
# (utan Firebase Functions), använd konfigurationen nedan.
#
# Bygg och pusha imagen:
#   docker build -t europe-west1-docker.pkg.dev/livskompassen-v2/jobs/retention-job:latest .
#   docker push europe-west1-docker.pkg.dev/livskompassen-v2/jobs/retention-job:latest
#
# Skapa Cloud Run Job:
#   gcloud run jobs create livskompassen-retention-job \
#     --image=europe-west1-docker.pkg.dev/livskompassen-v2/jobs/retention-job:latest \
#     --region=europe-west1 \
#     --max-retries=3 \
#     --task-timeout=3600s \
#     --set-env-vars="GCP_PROJECT_ID=livskompassen-v2,RETENTION_DAYS=90,VECTOR_SEARCH_INDEX_ID=<DITT_INDEX_ID>"
#
# Schemalägg med Cloud Scheduler:
#   gcloud scheduler jobs create http livskompassen-retention-scheduler \
#     --schedule="0 3 * * *" \
#     --time-zone="Europe/Stockholm" \
#     --uri="https://europe-west1-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/livskompassen-v2/jobs/livskompassen-retention-job:run" \
#     --message-body="{}" \
#     --oauth-service-account-email="<DIN_SERVICE_ACCOUNT>@livskompassen-v2.iam.gserviceaccount.com" \
#     --location=europe-west1
