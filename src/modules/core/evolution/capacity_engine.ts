import { collection, query, where, getDocs, getDocsFromCache } from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { FIRESTORE_COLLECTIONS, type CheckIn } from '../types/firestore';

/**
 * Calculates a 7-day moving average capacity score based on MåBra checkins.
 * Returns a normalized value between 0 and 1.
 * Uses cached queries when possible for efficiency.
 *
 * @param uid The user ID to calculate the score for.
 * @returns A promise resolving to a number between 0 and 1.
 */
export async function calculateCapacityScore(uid: string): Promise<number> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const checkinsRef = collection(db, FIRESTORE_COLLECTIONS.checkins);
  const q = query(
    checkinsRef,
    where('userId', '==', uid),
    where('questionId', '==', 'mabra_checkin'),
    where('createdAt', '>=', sevenDaysAgo.toISOString())
  );

  let snapshot;
  try {
    // Attempt to read from cache first for maximum efficiency
    snapshot = await getDocsFromCache(q);
    // If cache is empty, fallback to server to ensure we have recent data
    if (snapshot.empty) {
      snapshot = await getDocs(q);
    }
  } catch (err) {
    // Fallback to server if cache fetch fails
    snapshot = await getDocs(q);
  }

  if (snapshot.empty) {
    return 0;
  }

  let totalScore = 0;
  let count = 0;

  snapshot.forEach((doc) => {
    const data = doc.data() as CheckIn;
    let docScore = 0;
    let validFields = 0;

    // Mood and energy are typically on a 0-10 scale
    if (typeof data.mood === 'number') {
      docScore += data.mood;
      validFields++;
    }
    if (typeof data.energy === 'number') {
      docScore += data.energy;
      validFields++;
    }

    if (validFields > 0) {
      // Normalize the score for this checkin to be between 0 and 1
      const normalizedDocScore = (docScore / validFields) / 10;
      totalScore += normalizedDocScore;
      count++;
    }
  });

  return count > 0 ? totalScore / count : 0;
}
