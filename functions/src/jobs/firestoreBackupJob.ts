/**
 * Disaster Recovery — Scheduled Firestore export to Cloud Storage.
 *
 * Exports all WORM collections + critical data to a GCS bucket daily.
 * Maintains a rolling 30-day backup window.
 *
 * Intended to be triggered via Cloud Scheduler or callable.
 * Requires: roles/datastore.importExportAdmin on the service account.
 *
 * DR Plan:
 * - RTO (Recovery Time Objective): 4 hours
 * - RPO (Recovery Point Objective): 24 hours (daily backup)
 * - Backup location: GCS bucket in same region (europe-west1)
 * - Retention: 30 days rolling
 */

import { GCP_PROJECT_ID, GCP_REGION } from '../config';
import { monitor } from '../lib/monitoring';

const BACKUP_BUCKET = `${GCP_PROJECT_ID}-firestore-backups`;

/** Collections included in daily backup — all WORM + critical operational data. */
export const BACKUP_COLLECTIONS = [
  // WORM collections (never purged)
  'reality_vault',
  'children_logs',
  'journal',
  'emotional_memory',
  'vit_entries',
  'dossier_snapshots',
  'kampspar',
  'kb_docs',
  'entity_profiles',
  'system_synapses',
  'transactions',
  'evolution_ledger',
  'evolution_hub',
  'adaptation_ledger',
  'adaptation_prefs',
  'adaptation_semantic_profile',
  'recovery_profile',
  // Operational (critical for recovery)
  'users',
  'dcap_alerts',
  'dcap_alert_reviews',
  'dcap_escalation_state',
  'worm_hash_chain',
  'ai_cost_log',
] as const;

export interface BackupResult {
  success: boolean;
  outputUri: string;
  collections: readonly string[];
  durationMs: number;
  error?: string;
}

/**
 * Execute a Firestore export to GCS.
 * Uses the Firestore Admin REST API (exportDocuments).
 */
export async function runFirestoreBackup(): Promise<BackupResult> {
  const startMs = Date.now();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputUri = `gs://${BACKUP_BUCKET}/backups/${timestamp}`;

  monitor.log('INFO', `[DR-Backup] Starting export to ${outputUri}`, {
    collections: BACKUP_COLLECTIONS.length,
  });

  try {
    const { google } = await import('googleapis');
    const firestore = google.firestore('v1');
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/datastore'],
    });

    const authClient = await auth.getClient();

    await firestore.projects.databases.exportDocuments({
      name: `projects/${GCP_PROJECT_ID}/databases/(default)`,
      requestBody: {
        outputUriPrefix: outputUri,
        collectionIds: [...BACKUP_COLLECTIONS],
      },
      auth: authClient as never,
    });

    const durationMs = Date.now() - startMs;
    monitor.log('INFO', `[DR-Backup] Export initiated successfully in ${durationMs}ms`, {
      outputUri,
      durationMs,
    });

    return {
      success: true,
      outputUri,
      collections: BACKUP_COLLECTIONS,
      durationMs,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const durationMs = Date.now() - startMs;

    monitor.trackError('firestoreBackup', err, { outputUri });
    monitor.log('CRITICAL', `[DR-Backup] Export FAILED: ${message}`, {
      outputUri,
      durationMs,
    });

    return {
      success: false,
      outputUri,
      collections: BACKUP_COLLECTIONS,
      durationMs,
      error: message,
    };
  }
}

/**
 * Verify backup integrity by checking GCS objects exist.
 * Returns { valid, lastBackupAge } for monitoring alerts.
 */
export async function verifyBackupHealth(): Promise<{
  valid: boolean;
  lastBackupAgeHours: number | null;
  bucketUri: string;
}> {
  try {
    const { Storage } = await import('@google-cloud/storage');
    const storage = new Storage({ projectId: GCP_PROJECT_ID });
    const bucket = storage.bucket(BACKUP_BUCKET);

    const [files] = await bucket.getFiles({ prefix: 'backups/' });
    files.sort((a, b) => {
      const tA = a.metadata.updated ? new Date(a.metadata.updated as string).getTime() : 0;
      const tB = b.metadata.updated ? new Date(b.metadata.updated as string).getTime() : 0;
      return tB - tA;
    });

    if (files.length === 0) {
      monitor.log('WARNING', '[DR-Backup] No backups found in bucket');
      return { valid: false, lastBackupAgeHours: null, bucketUri: `gs://${BACKUP_BUCKET}` };
    }

    const lastModified = files[0].metadata.updated
      ? new Date(files[0].metadata.updated as string)
      : new Date(0);
    const ageHours = (Date.now() - lastModified.getTime()) / (1000 * 60 * 60);

    const valid = ageHours < 48; // Alert if older than 48h
    if (!valid) {
      monitor.log('WARNING', `[DR-Backup] Last backup is ${Math.round(ageHours)}h old (>48h threshold)`, {
        lastBackupAgeHours: ageHours,
      });
    }

    return {
      valid,
      lastBackupAgeHours: Math.round(ageHours * 10) / 10,
      bucketUri: `gs://${BACKUP_BUCKET}`,
    };
  } catch (err) {
    monitor.trackError('verifyBackupHealth', err);
    return { valid: false, lastBackupAgeHours: null, bucketUri: `gs://${BACKUP_BUCKET}` };
  }
}

/** DR documentation summary — exported for ops reference. */
export const DR_PLAN = {
  rto: '4 hours',
  rpo: '24 hours',
  backupFrequency: 'Daily (Cloud Scheduler)',
  backupRetention: '30 days rolling',
  backupLocation: `gs://${BACKUP_BUCKET} (${GCP_REGION})`,
  restoreProcedure: [
    '1. Identify target backup timestamp in GCS bucket',
    '2. Run: gcloud firestore import gs://BUCKET/backups/TIMESTAMP',
    '3. Verify WORM hash chain integrity: verifyHashChain(userId, collection)',
    '4. Validate critical collections via smoke tests',
    '5. Re-enable App Check enforcement if disabled during recovery',
  ],
  escalation: [
    'L1: Cloud Monitoring alert → on-call engineer',
    'L2: If RTO breach (>4h) → escalate to CTO',
    'L3: If WORM integrity compromised → forensic audit + legal',
  ],
} as const;

if (require.main === module) {
  runFirestoreBackup()
    .then((result) => {
      console.log('[DR-Backup] Result:', JSON.stringify(result, null, 2));
      process.exit(result.success ? 0 : 1);
    })
    .catch((err) => {
      console.error('[DR-Backup] Fatal:', err);
      process.exit(1);
    });
}
