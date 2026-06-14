import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/core/firebase/firestore';
import {
  getLocalIsoDate,
  normalizeFocusPoints,
  USER_DAILY_FOCUS_COLLECTION,
} from '@/modules/morning/lib/focusPoints';
import { normalizeFocusKey } from '../lib/goalDetection';

export type PrimaryGoal = {
  text: string;
  focusKey: string;
  confirmedAt: string;
};

export type ConfirmPrimaryGoalInput = {
  text: string;
  focusKey?: string;
  capacityLevel?: 1 | 2 | 3;
  suggestMicroStep?: boolean;
};

function parsePrimaryGoal(data: Record<string, unknown>): PrimaryGoal | null {
  const text = typeof data.primaryGoal === 'string' ? data.primaryGoal.trim() : '';
  if (!text) return null;
  const focusKey =
    typeof data.primaryGoalKey === 'string' && data.primaryGoalKey.trim()
      ? data.primaryGoalKey.trim()
      : normalizeFocusKey(text) ?? text.toLowerCase();
  const confirmedAt =
    typeof data.primaryGoalConfirmedAt === 'string'
      ? data.primaryGoalConfirmedAt
      : '';
  return { text, focusKey, confirmedAt };
}

export async function fetchPrimaryGoal(ownerId: string): Promise<PrimaryGoal | null> {
  const ref = doc(db, USER_DAILY_FOCUS_COLLECTION, ownerId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return parsePrimaryGoal(snap.data() as Record<string, unknown>);
}

/**
 * Kat 5 HITL — skriver `primaryGoal` till `user_daily_focus` efter explicit bekräftelse.
 * Synkar slot 1 i `focusPoints` så Morgonkompassen läser samma data.
 */
export async function confirmPrimaryGoal(
  ownerId: string,
  input: ConfirmPrimaryGoalInput,
): Promise<PrimaryGoal> {
  const text = input.text.trim();
  if (!text) {
    throw new Error('Målet kan inte vara tomt.');
  }

  const focusKey = input.focusKey?.trim() || normalizeFocusKey(text) || text.toLowerCase();
  const rootRef = doc(db, USER_DAILY_FOCUS_COLLECTION, ownerId);
  const rootSnap = await getDoc(rootRef);
  const existing = rootSnap.exists() ? rootSnap.data() : undefined;
  const existingPoints = normalizeFocusPoints(existing?.focusPoints);

  const singleSlotMode = input.capacityLevel === 1 || input.suggestMicroStep === true;
  const focusPoints = singleSlotMode
    ? [text, '', '']
    : [text, existingPoints[1] ?? '', existingPoints[2] ?? ''];

  const isoDate = getLocalIsoDate();
  const confirmedAt = new Date().toISOString();
  const historyRef = doc(db, USER_DAILY_FOCUS_COLLECTION, ownerId, 'history', isoDate);

  const rootPayload = {
    ownerId,
    userId: ownerId,
    primaryGoal: text,
    primaryGoalKey: focusKey,
    primaryGoalConfirmedAt: confirmedAt,
    focusPoints,
    updatedAt: serverTimestamp(),
    ...(typeof existing?.handledProtocolDate === 'string'
      ? { handledProtocolDate: existing.handledProtocolDate }
      : {}),
  };

  const writes: Promise<void>[] = [setDoc(rootRef, rootPayload, { merge: true })];

  const historySnap = await getDoc(historyRef);
  if (!historySnap.exists()) {
    writes.push(
      setDoc(
        historyRef,
        {
          ownerId,
          userId: ownerId,
          focusPoints,
          date: isoDate,
          primaryGoal: text,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      ),
    );
  }

  await Promise.all(writes);
  return { text, focusKey, confirmedAt };
}

/** Tar bort aktivt mål utan att radera övriga fokusplatser. */
export async function clearPrimaryGoal(ownerId: string): Promise<void> {
  const rootRef = doc(db, USER_DAILY_FOCUS_COLLECTION, ownerId);
  await setDoc(
    rootRef,
    {
      ownerId,
      userId: ownerId,
      primaryGoal: '',
      primaryGoalKey: '',
      primaryGoalConfirmedAt: '',
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
