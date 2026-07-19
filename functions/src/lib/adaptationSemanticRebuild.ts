import { admin } from './firebaseAdmin';
import { prefsLedgerFingerprint } from '../../../shared/adaptation/adaptationLedgerSync';
import {
  buildSemanticProfileFromPrefs,
  type AdaptationSemanticProfileDoc,
} from '../../../shared/adaptation/adaptationSemanticTypes';
import { getAdaptationPrefsDoc } from './adaptationPrefsStore';
import {
  getAdaptationSemanticProfileDoc,
  saveAdaptationSemanticProfileDoc,
} from './adaptationSemanticStore';
import {
  adaptationLedgerDedupKey,
  adaptationLedgerDedupKeyFromStored,
} from '../../../shared/adaptation/adaptationLedgerSync';

const LEDGER_COLLECTION = 'adaptation_ledger';

async function appendSemanticIndexedLedger(
  userId: string,
  profile: AdaptationSemanticProfileDoc,
): Promise<void> {
  const entry = {
    userId,
    ownerId: userId,
    type: 'semantic_indexed' as const,
    source: 'system' as const,
    silo: 'core' as const,
    rationale: 'Semantisk profil ombyggd från adaptation_prefs',
    metadata: {
      rebuildVersion: profile.rebuildVersion,
      sourcePrefsFingerprint: profile.sourcePrefsFingerprint,
      topRoutes: profile.topRoutes,
      summaryLength: profile.summaryText.length,
    },
  };

  const key = adaptationLedgerDedupKey(entry);
  const db = admin.firestore();
  const snap = await db.collection(LEDGER_COLLECTION).where('ownerId', '==', userId).get();

  for (const docSnap of snap.docs) {
    if (adaptationLedgerDedupKeyFromStored(docSnap.data() as Record<string, unknown>) === key) {
      return;
    }
  }

  await db.collection(LEDGER_COLLECTION).add({
    ...entry,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

export interface RebuildAdaptationSemanticResult {
  profile: AdaptationSemanticProfileDoc;
  changed: boolean;
  skipped: boolean;
}

/**
 * Deterministisk ombyggnad — endast adaptation_prefs, ingen cross-silo-läsning.
 */
export async function rebuildAdaptationSemanticProfileForUser(
  uid: string,
): Promise<RebuildAdaptationSemanticResult> {
  const prefs = await getAdaptationPrefsDoc(uid);
  if (!prefs) {
    throw new Error('adaptation_prefs saknas — skapa prefs först.');
  }

  const fingerprint = prefsLedgerFingerprint(prefs);
  const prev = await getAdaptationSemanticProfileDoc(uid);
  const prevFingerprint = prev?.sourcePrefsFingerprint;

  const { profile, changed } = buildSemanticProfileFromPrefs(
    uid,
    prefs,
    fingerprint,
    prevFingerprint,
  );

  if (!changed && prev) {
    return { profile: prev, changed: false, skipped: true };
  }

  await saveAdaptationSemanticProfileDoc(profile);
  await appendSemanticIndexedLedger(uid, profile);

  return { profile, changed: true, skipped: false };
}
