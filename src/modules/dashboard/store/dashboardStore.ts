import { create } from 'zustand';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import type { CollectionReference, DocumentData } from 'firebase/firestore';
import { db } from '../../core/firebase/firestore';

/**
 * Hjälpfunktion för att säkra alla Firestore-frågor med ownerId
 * Enligt säkerhetsfokuserad arkitektur
 */
export function secureQuery(ref: CollectionReference<DocumentData, DocumentData>, ownerId: string) {
  return query(ref, where('ownerId', '==', ownerId));
}

export interface DashboardData {
  id: string;
  [key: string]: unknown;
}

export interface DashboardStore {
  data: DashboardData[];
  isLoading: boolean;
  error: string | null;
  fetchData: (ownerId: string) => Promise<void>;
  addInsight: (ownerId: string, insightData: Omit<DashboardData, 'id' | 'ownerId'>) => Promise<void>;
}

/**
 * Zustand store för DashboardHub
 */
export const useDashboardStore = create<DashboardStore>((set) => ({
  data: [],
  isLoading: false,
  error: null,
  
  fetchData: async (ownerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const ref = collection(db, 'user_insights');
      // Automatisk injicering av ownerId-filtret
      const q = secureQuery(ref, ownerId);
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as DashboardData));
      set({ data, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  addInsight: async (ownerId: string, insightData: Omit<DashboardData, 'id' | 'ownerId'>) => {
    try {
      const ref = collection(db, 'user_insights');
      // Tvingad ownerId injicering enligt Layered Defense / Data Connect-standard
      const docData = {
        ...insightData,
        ownerId,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(ref, docData);
      
      // Update local state directly to reflect changes without a new fetch
      set(state => ({
        data: [{ id: docRef.id, ...docData }, ...state.data]
      }));
    } catch (err) {
      throw err; // Låt komponenten hantera felet (t.ex. visa en toast)
    }
  }
}));
