import { admin } from './firebaseAdmin';
import {
  DEFAULT_ADAPTATION_PREFS,
  type AdaptationPrefsDoc,
  type AdaptationSilo,
} from '../../../shared/adaptation/adaptationTypes';

const PREFS_COLLECTION = 'adaptation_prefs';

export function normalizeAdaptationPrefs(
  uid: string,
  data: admin.firestore.DocumentData | undefined,
): AdaptationPrefsDoc {
  const base = data ?? {};
  return {
    userId: String(base.userId ?? uid),
    ownerId: String(base.ownerId ?? uid),
    coachTone: base.coachTone === 'minimal' || base.coachTone === 'detailed'
      ? base.coachTone
      : DEFAULT_ADAPTATION_PREFS.coachTone,
    uiDensity: base.uiDensity === 'paralys' || base.uiDensity === 'full'
      ? base.uiDensity
      : DEFAULT_ADAPTATION_PREFS.uiDensity,
    routingDefaults:
      base.routingDefaults && typeof base.routingDefaults === 'object'
        ? (base.routingDefaults as Record<string, string>)
        : {},
    dismissedHints: Array.isArray(base.dismissedHints)
      ? base.dismissedHints.map(String).slice(0, 64)
      : [],
    inferredSignals:
      base.inferredSignals && typeof base.inferredSignals === 'object'
        ? (base.inferredSignals as Record<string, number | string | boolean>)
        : {},
    updatedAt: base.updatedAt?.toDate?.()?.toISOString?.() ?? base.updatedAt,
  };
}

export async function getAdaptationPrefsDoc(
  uid: string,
): Promise<AdaptationPrefsDoc | null> {
  const snap = await admin.firestore().collection(PREFS_COLLECTION).doc(uid).get();
  if (!snap.exists) return null;
  return normalizeAdaptationPrefs(uid, snap.data());
}

export async function ensureAdaptationPrefsDoc(uid: string): Promise<AdaptationPrefsDoc> {
  const ref = admin.firestore().collection(PREFS_COLLECTION).doc(uid);
  const snap = await ref.get();
  if (snap.exists) {
    return normalizeAdaptationPrefs(uid, snap.data());
  }

  const doc: AdaptationPrefsDoc = {
    userId: uid,
    ownerId: uid,
    ...DEFAULT_ADAPTATION_PREFS,
    updatedAt: new Date().toISOString(),
  };
  await ref.set({
    ...doc,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return doc;
}

export interface RecordAdaptationSignalInput {
  signalKey: string;
  increment?: number;
  value?: number | string | boolean;
  silo?: AdaptationSilo;
}

/** Deterministisk merge — LLM skriver aldrig direkt till prefs. */
export async function recordAdaptationSignalForUser(
  uid: string,
  input: RecordAdaptationSignalInput,
): Promise<AdaptationPrefsDoc> {
  const key = input.signalKey.trim();
  if (!key || key.length > 64) {
    throw new Error('signalKey krävs (max 64 tecken).');
  }

  const ref = admin.firestore().collection(PREFS_COLLECTION).doc(uid);
  const current = (await getAdaptationPrefsDoc(uid)) ?? {
    userId: uid,
    ownerId: uid,
    ...DEFAULT_ADAPTATION_PREFS,
  };

  const nextSignals = { ...current.inferredSignals };

  if (typeof input.increment === 'number' && Number.isFinite(input.increment)) {
    const prev = nextSignals[key];
    const prevNum = typeof prev === 'number' ? prev : 0;
    nextSignals[key] = prevNum + input.increment;
  } else if (input.value !== undefined) {
    nextSignals[key] = input.value;
  } else {
    const prev = nextSignals[key];
    const prevNum = typeof prev === 'number' ? prev : 0;
    nextSignals[key] = prevNum + 1;
  }

  const next: AdaptationPrefsDoc = {
    ...current,
    inferredSignals: nextSignals,
    updatedAt: new Date().toISOString(),
  };

  await ref.set(
    {
      userId: uid,
      ownerId: uid,
      coachTone: next.coachTone,
      uiDensity: next.uiDensity,
      routingDefaults: next.routingDefaults,
      dismissedHints: next.dismissedHints,
      inferredSignals: next.inferredSignals,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return next;
}
