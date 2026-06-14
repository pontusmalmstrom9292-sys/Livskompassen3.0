import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/core/firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '@/core/types/firestore';

export type RecoveryProgramType = 'twelve_step_inspired' | 'custom_abstinence' | 'other';
export type PreferredGrounding = 'breathing_478' | 'grounding_54321' | 'either';

export type RecoveryProfile = {
  userId: string;
  ownerId: string;
  programType: RecoveryProgramType;
  startDateKey: string;
  shareWithCoach: false;
  coreWhy?: string;
  triggerTags?: string[];
  supportContactHint?: string;
  preferredGrounding?: PreferredGrounding;
  twelveStepProgress?: Record<string, string>;
};

export async function fetchRecoveryProfile(userId: string): Promise<RecoveryProfile | null> {
  const ref = doc(db, FIRESTORE_COLLECTIONS.recovery_profile, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    userId: String(data.userId ?? userId),
    ownerId: String(data.ownerId ?? userId),
    programType: (data.programType as RecoveryProgramType) ?? 'twelve_step_inspired',
    startDateKey: String(data.startDateKey ?? ''),
    shareWithCoach: false,
    coreWhy: typeof data.coreWhy === 'string' ? data.coreWhy : undefined,
    triggerTags: Array.isArray(data.triggerTags)
      ? data.triggerTags.filter((t): t is string => typeof t === 'string')
      : undefined,
    supportContactHint:
      typeof data.supportContactHint === 'string' ? data.supportContactHint : undefined,
    preferredGrounding: data.preferredGrounding as PreferredGrounding | undefined,
    twelveStepProgress:
      data.twelveStepProgress && typeof data.twelveStepProgress === 'object'
        ? (data.twelveStepProgress as Record<string, string>)
        : undefined,
  };
}

export async function upsertRecoveryProfile(
  userId: string,
  patch: Partial<
    Pick<
      RecoveryProfile,
      | 'programType'
      | 'startDateKey'
      | 'coreWhy'
      | 'triggerTags'
      | 'supportContactHint'
      | 'preferredGrounding'
      | 'twelveStepProgress'
    >
  >,
): Promise<void> {
  const ref = doc(db, FIRESTORE_COLLECTIONS.recovery_profile, userId);
  const existing = await getDoc(ref);
  const base = existing.exists() ? existing.data() : {};

  await setDoc(
    ref,
    {
      userId,
      ownerId: userId,
      programType: patch.programType ?? base.programType ?? 'twelve_step_inspired',
      startDateKey: patch.startDateKey ?? base.startDateKey ?? '',
      shareWithCoach: false,
      updatedAt: serverTimestamp(),
      ...(patch.coreWhy !== undefined ? { coreWhy: patch.coreWhy } : {}),
      ...(patch.triggerTags !== undefined ? { triggerTags: patch.triggerTags } : {}),
      ...(patch.supportContactHint !== undefined
        ? { supportContactHint: patch.supportContactHint }
        : {}),
      ...(patch.preferredGrounding !== undefined
        ? { preferredGrounding: patch.preferredGrounding }
        : {}),
      ...(patch.twelveStepProgress !== undefined
        ? { twelveStepProgress: patch.twelveStepProgress }
        : {}),
    },
    { merge: true },
  );
}

export async function syncRecoveryProfileStartDate(
  userId: string,
  startDateKey: string,
): Promise<void> {
  if (!startDateKey) return;
  await upsertRecoveryProfile(userId, {
    startDateKey,
    programType: 'twelve_step_inspired',
  });
}

export async function touchLastSosAt(userId: string): Promise<void> {
  const existing = await fetchRecoveryProfile(userId);
  const startDateKey = existing?.startDateKey || new Date().toISOString().slice(0, 10);
  const ref = doc(db, FIRESTORE_COLLECTIONS.recovery_profile, userId);
  await setDoc(
    ref,
    {
      userId,
      ownerId: userId,
      programType: existing?.programType ?? 'twelve_step_inspired',
      startDateKey,
      shareWithCoach: false,
      updatedAt: serverTimestamp(),
      lastSosAt: serverTimestamp(),
      ...(existing?.coreWhy ? { coreWhy: existing.coreWhy } : {}),
      ...(existing?.triggerTags ? { triggerTags: existing.triggerTags } : {}),
      ...(existing?.supportContactHint ? { supportContactHint: existing.supportContactHint } : {}),
      ...(existing?.preferredGrounding ? { preferredGrounding: existing.preferredGrounding } : {}),
      ...(existing?.twelveStepProgress ? { twelveStepProgress: existing.twelveStepProgress } : {}),
    },
    { merge: true },
  );
}
