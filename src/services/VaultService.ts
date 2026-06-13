import { collection, addDoc, getDocs, onSnapshot, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../modules/core/firebase/firestore';

export class VaultService {
  private static COLLECTION_NAME = 'reality_vault';

  static async saveRecord(userId: string, data: any): Promise<string> {
    const ref = collection(db, this.COLLECTION_NAME);
    const payload = {
      ...data,
      userId,
      ownerId: userId,
      createdAt: serverTimestamp(),
      isLocked: true,
    };
    
    const forbiddenKeys = ['updatedAt', 'deletedAt', 'modifiedAt', 'revision'];
    for (const key of forbiddenKeys) {
      if (key in data) {
        throw new Error(`WORM violation: field "${key}" is not allowed on create.`);
      }
    }

    const docRef = await addDoc(ref, payload);
    return docRef.id;
  }

  static async getVaultHistory(userId: string): Promise<any[]> {
    const ref = collection(db, this.COLLECTION_NAME);
    const q = query(
      ref,
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snap = await getDocs(q);
    return snap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      };
    });
  }

  static initializeVaultListener(userId: string, onUpdate: (records: any[]) => void): () => void {
    const ref = collection(db, this.COLLECTION_NAME);
    const q = query(
      ref,
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snap) => {
      const records = snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
        };
      });
      onUpdate(records);
    }, (error) => {
      console.error("Vault listener error:", error);
    });
  }
}
