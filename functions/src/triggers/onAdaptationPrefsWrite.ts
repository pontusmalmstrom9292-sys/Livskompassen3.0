import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import { GCP_REGION } from '../config';
import { syncAdaptationPrefsToLedgerServer } from '../lib/adaptationPrefsLedgerServer';
import { normalizeAdaptationPrefs } from '../lib/adaptationPrefsStore';
import type { AdaptationPrefsDoc } from '../../../shared/adaptation/adaptationTypes';

export const onAdaptationPrefsWrite = onDocumentWritten(
  {
    document: 'adaptation_prefs/{uid}',
    region: GCP_REGION,
  },
  async (event) => {
    const uid = event.params.uid;
    if (!event.data?.after.exists) return;

    const beforeData = event.data.before.exists
      ? normalizeAdaptationPrefs(uid, event.data.before.data())
      : null;
    const afterData = normalizeAdaptationPrefs(uid, event.data.after.data());

    const db = admin.firestore();
    await syncAdaptationPrefsToLedgerServer(db, uid, beforeData, {
      ...afterData,
      userId: afterData.userId || uid,
      ownerId: afterData.ownerId || uid,
    } satisfies AdaptationPrefsDoc);
  },
);
