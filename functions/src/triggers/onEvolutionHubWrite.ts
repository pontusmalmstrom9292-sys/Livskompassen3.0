import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import { GCP_REGION } from '../config';
import { syncEvolutionHubToLedgerServer } from '../lib/evolutionHubLedgerServer';
import type { EvolutionHubDoc } from '../../../shared/evolution/evolutionHubLedgerSync';

export const onEvolutionHubWrite = onDocumentWritten(
  {
    document: 'evolution_hub/{uid}',
    region: GCP_REGION,
  },
  async (event) => {
    const uid = event.params.uid;
    if (!event.data?.after.exists) return;

    const beforeData = event.data.before.exists
      ? (event.data.before.data() as EvolutionHubDoc)
      : null;
    const afterData = event.data.after.data() as EvolutionHubDoc;

    const db = admin.firestore();
    await syncEvolutionHubToLedgerServer(db, uid, beforeData, {
      ...afterData,
      userId: afterData.userId || uid,
      ownerId: afterData.ownerId || uid,
    });
  },
);
