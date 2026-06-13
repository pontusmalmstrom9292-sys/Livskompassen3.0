import { collection, addDoc, getDocs, onSnapshot, query, where, orderBy, serverTimestamp, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firestore';

export interface VaultRecord {
  id: string;
  content: string;
  timestamp: Date;
  ownerId: string;
}

export class VaultService {
  private static COLLECTION_NAME = 'reality_vault';
  private static COLLECTION = 'reality_vault';

  // --- NEW REQUIREMENTS ---
  
  /**
   * Skapar och sparar en post i vault-samlingen.
   * Följer strikt WORM-logiken (Write Once, Read Many).
   * 
   * @param entry Data som ska sparas (måste matcha VaultRecord)
   * @throws Error om posten redan existerar
   */
  static async saveVaultEntry(entry: VaultRecord): Promise<void> {
    const docRef = doc(db, this.COLLECTION, entry.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      throw new Error("Dataintegritetsbrott: Posten finns redan och kan inte skrivas över.");
    }

    await setDoc(docRef, {
      id: entry.id,
      content: entry.content,
      timestamp: entry.timestamp,
      ownerId: entry.ownerId
    });
  }

  /**
   * Hämtar en befintlig post från vault-samlingen.
   * 
   * @param id ID för posten som ska hämtas
   * @returns Posten som VaultRecord eller null om den inte finns
   */
  static async getVaultEntry(id: string): Promise<VaultRecord | null> {
    const docRef = doc(db, this.COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    
    // Hanterar omkonvertering från Firestore Timestamp till JavaScript Date
    const timestamp = data.timestamp?.toDate 
      ? data.timestamp.toDate() 
      : new Date(data.timestamp);

    return {
      id: data.id,
      content: data.content,
      timestamp: timestamp,
      ownerId: data.ownerId
    };
  }

  // --- EXISTING METHODS (Preserved to maintain backwards compatibility with existing UI) ---

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
