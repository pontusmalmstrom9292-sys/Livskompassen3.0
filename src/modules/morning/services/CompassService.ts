import { collection, doc, setDoc, getDocs, query, where, serverTimestamp, limit } from 'firebase/firestore';
import { db } from '../../core/firebase/firestore';
import { getLocalIsoDate } from '../lib/focusPoints';

/**
 * Legacy-reserv för `daily_intentions`.
 * Kanonisk sink: `user_daily_focus` via `morningStore.saveFocus`.
 * Behålls tills migrering bekräftad (G1).
 */
export class CompassService {
  private static COLLECTION = 'daily_intentions';

  static async saveDailyIntention(userId: string, intention: string): Promise<string> {
    const dateStr = getLocalIsoDate();
    const docId = `${userId}_${dateStr}`;
    const docRef = doc(db, this.COLLECTION, docId);
    
    await setDoc(docRef, {
      userId,
      ownerId: userId,
      intention,
      date: dateStr,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    return docId;
  }

  static async getDailyIntentions(userId: string): Promise<any[]> {
    const dateStr = getLocalIsoDate();
    
    const q = query(
      collection(db, this.COLLECTION),
      where('ownerId', '==', userId),
      where('date', '==', dateStr),
      limit(1)
    );

    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
