import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db, type CheckInRow } from './firestore';
import { FIRESTORE_COLLECTIONS } from '../types/firestore';

/**
 * Normaliserar Firestore Timestamp eller datumsträng till ISO-sträng.
 */
function normalizeCreatedAt(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === 'string') return value;
  if (value == null) return '';
  return String(value);
}

/**
 * Hämtar historik för MåBra-incheckningar (questionId == 'mabra_checkin')
 * för en specifik användare sorterat efter skapad-datum i fallande ordning.
 * 
 * @param userId Användarens unika ID
 * @param limitCount Maximalt antal incheckningar som ska hämtas (standard: 30)
 * @returns En lista med MåBra-incheckningar
 */
export async function getMabraHistory(
  userId: string,
  limitCount: number = 30
): Promise<CheckInRow[]> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.checkins);

  const q = query(
    ref,
    where('ownerId', '==', userId),
    where('questionId', '==', 'mabra_checkin'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      userId: String(data.userId ?? userId),
      questionId: String(data.questionId ?? 'mabra_checkin'),
      questionText: data.questionText as string | undefined,
      optionSelected: String(data.optionSelected ?? 'completed'),
      taskCategory: data.taskCategory as string | undefined,
      taskNote: data.taskNote as string | undefined,
      taskText: data.taskText as string | undefined,
      taskCompleted: data.taskCompleted as boolean | undefined,
      energy: typeof data.energy === 'number' ? data.energy : undefined,
      mood: typeof data.mood === 'number' ? data.mood : undefined,
      createdAt: normalizeCreatedAt(data.createdAt),
    } as CheckInRow;
  });
}
