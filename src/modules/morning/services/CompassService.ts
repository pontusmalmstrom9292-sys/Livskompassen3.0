import { collection, doc, setDoc, getDocs, query, where, serverTimestamp, limit } from 'firebase/firestore';
import { db } from '../../core/firebase/firestore';

export class CompassService {
  private static COLLECTION = 'daily_intentions';

  static async saveDailyIntention(userId: string, intention: string): Promise<string> {
    const today = new Date();
    // Use local timezone date string (YYYY-MM-DD)
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
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
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
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
