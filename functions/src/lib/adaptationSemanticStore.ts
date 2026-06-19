import * as admin from 'firebase-admin';
import type { AdaptationSemanticProfileDoc } from '../../../shared/adaptation/adaptationSemanticTypes';
import { ADAPTATION_SEMANTIC_REBUILD_VERSION } from '../../../shared/adaptation/adaptationSemanticTypes';

const PROFILE_COLLECTION = 'adaptation_semantic_profile';

export function normalizeAdaptationSemanticProfile(
  uid: string,
  data: admin.firestore.DocumentData | undefined,
): AdaptationSemanticProfileDoc | null {
  if (!data) return null;
  const coachTone =
    data.coachTone === 'minimal' || data.coachTone === 'detailed'
      ? data.coachTone
      : 'standard';
  const uiDensity =
    data.uiDensity === 'paralys' || data.uiDensity === 'full' ? data.uiDensity : 'normal';

  return {
    userId: String(data.userId ?? uid),
    ownerId: String(data.ownerId ?? uid),
    summaryText: typeof data.summaryText === 'string' ? data.summaryText.slice(0, 2000) : '',
    signalSnapshot:
      data.signalSnapshot && typeof data.signalSnapshot === 'object'
        ? (data.signalSnapshot as Record<string, number | string | boolean>)
        : {},
    topRoutes: Array.isArray(data.topRoutes) ? data.topRoutes.map(String).slice(0, 8) : [],
    coachTone,
    uiDensity,
    rebuildVersion:
      data.rebuildVersion === ADAPTATION_SEMANTIC_REBUILD_VERSION
        ? ADAPTATION_SEMANTIC_REBUILD_VERSION
        : ADAPTATION_SEMANTIC_REBUILD_VERSION,
    sourcePrefsFingerprint:
      typeof data.sourcePrefsFingerprint === 'string' ? data.sourcePrefsFingerprint : '',
    updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? data.updatedAt,
  };
}

export async function getAdaptationSemanticProfileDoc(
  uid: string,
): Promise<AdaptationSemanticProfileDoc | null> {
  const snap = await admin.firestore().collection(PROFILE_COLLECTION).doc(uid).get();
  if (!snap.exists) return null;
  return normalizeAdaptationSemanticProfile(uid, snap.data());
}

export async function saveAdaptationSemanticProfileDoc(
  profile: AdaptationSemanticProfileDoc,
): Promise<void> {
  const ref = admin.firestore().collection(PROFILE_COLLECTION).doc(profile.userId);
  await ref.set({
    userId: profile.userId,
    ownerId: profile.ownerId,
    summaryText: profile.summaryText,
    signalSnapshot: profile.signalSnapshot,
    topRoutes: profile.topRoutes,
    coachTone: profile.coachTone,
    uiDensity: profile.uiDensity,
    rebuildVersion: profile.rebuildVersion,
    sourcePrefsFingerprint: profile.sourcePrefsFingerprint,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}
