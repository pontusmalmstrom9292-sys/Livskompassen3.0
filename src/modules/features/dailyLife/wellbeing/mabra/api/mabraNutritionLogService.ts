import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/modules/core/firebase/firestore';
import { assertOfflineWriteAllowed } from '@/modules/core/firebase/offlineWritePolicy';
import { FIRESTORE_COLLECTIONS } from '@/modules/core/types/firestore';
import type { NutritionDayState } from '../lib/mabraNutritionDayStorage';

const COLLECTION = FIRESTORE_COLLECTIONS.mabra_nutrition_log;

function nutritionDayDocRef(uid: string, dateKey: string) {
  return doc(db, COLLECTION, uid, 'days', dateKey);
}

function parseNutritionDay(data: Record<string, unknown>): NutritionDayState {
  const water =
    typeof data.waterGlasses === 'number' ? Math.floor(data.waterGlasses) : 0;
  return {
    waterGlasses: Math.min(12, Math.max(0, water)),
    proteinMarked: data.proteinMarked === true,
    omega3Marked: data.omega3Marked === true,
    mealMarked: data.mealMarked === true,
  };
}

export async function getMabraNutritionDay(
  uid: string,
  dateKey: string,
): Promise<NutritionDayState | null> {
  const snap = await getDoc(nutritionDayDocRef(uid, dateKey));
  if (!snap.exists()) return null;
  return parseNutritionDay(snap.data() as Record<string, unknown>);
}

export async function saveMabraNutritionDay(
  uid: string,
  dateKey: string,
  state: NutritionDayState,
): Promise<void> {
  assertOfflineWriteAllowed(COLLECTION);
  const ref = nutritionDayDocRef(uid, dateKey);
  await setDoc(
    ref,
    {
      userId: uid,
      ownerId: uid,
      dateKey,
      waterGlasses: Math.min(12, Math.max(0, Math.floor(state.waterGlasses))),
      proteinMarked: state.proteinMarked,
      omega3Marked: state.omega3Marked,
      mealMarked: state.mealMarked,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
