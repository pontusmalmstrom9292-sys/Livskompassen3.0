import { create } from 'zustand';
import { collection, query, where, getDocs, orderBy, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../core/firebase/firestore';

export interface InsightData {
  id: string;
  createdAt?: Timestamp;
  text?: string;
  category?: string;
  [key: string]: any;
}

export interface ReflectionState {
  insights: InsightData[];
  currentFocusPoints: string[];
  isLoading: boolean;
  error: string | null;
  fetchReflectionData: (ownerId: string) => Promise<void>;
}

export const useReflectionStore = create<ReflectionState>((set) => ({
  insights: [],
  currentFocusPoints: [],
  isLoading: false,
  error: null,

  fetchReflectionData: async (ownerId: string) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Fetch historical insights
      const insightsRef = collection(db, 'user_insights');
      const q = query(
        insightsRef,
        where('ownerId', '==', ownerId),
        orderBy('createdAt', 'desc')
      );
      
      const insightsSnap = await getDocs(q);
      const insightsData = insightsSnap.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      } as InsightData));

      // 2. Fetch current daily focus points
      const currentFocusPoints: string[] = ['', '', ''];
      const focusDocRef = doc(db, 'user_daily_focus', ownerId);
      const focusSnap = await getDoc(focusDocRef);
      if (focusSnap.exists()) {
        const data = focusSnap.data();
        if (data.focusPoints && Array.isArray(data.focusPoints)) {
          data.focusPoints.forEach((p: string, i: number) => {
            if (i < 3) currentFocusPoints[i] = p;
          });
        }
      }

      set({
        insights: insightsData,
        currentFocusPoints,
        isLoading: false
      });
    } catch (err) {
      console.error('Error fetching reflection data:', err);
      set({ error: (err as Error).message, isLoading: false });
    }
  }
}));
