import { create } from 'zustand';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../core/firebase/firestore';

interface MorningCompassState {
  threeFocusPoints: string[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  setFocusPoint: (index: number, value: string) => void;
  clearFocusPoints: (ownerId?: string) => Promise<void>;
  fetchFocusPoints: (ownerId: string) => Promise<void>;
  saveFocusPoints: (ownerId: string) => Promise<void>;
}

export const useMorningCompassStore = create<MorningCompassState>((set, get) => ({
  threeFocusPoints: ['', '', ''],
  isLoading: false,
  isSaving: false,
  error: null,

  setFocusPoint: (index, value) =>
    set((state) => {
      const newPoints = [...state.threeFocusPoints];
      newPoints[index] = value;
      return { threeFocusPoints: newPoints };
    }),

  clearFocusPoints: async (ownerId?: string) => {
    set({ threeFocusPoints: ['', '', ''] });
    if (ownerId) {
      await get().saveFocusPoints(ownerId);
    }
  },

  fetchFocusPoints: async (ownerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const docRef = doc(db, 'user_daily_focus', ownerId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data.focusPoints && Array.isArray(data.focusPoints)) {
          const points = ['', '', ''];
          data.focusPoints.forEach((p: string, i: number) => {
            if (i < 3) points[i] = p;
          });
          set({ threeFocusPoints: points });
        }
      }
      set({ isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  saveFocusPoints: async (ownerId: string) => {
    set({ isSaving: true, error: null });
    try {
      const { threeFocusPoints } = get();
      const docRef = doc(db, 'user_daily_focus', ownerId);
      await setDoc(docRef, {
        ownerId,
        userId: ownerId,
        focusPoints: threeFocusPoints,
        updatedAt: serverTimestamp()
      }, { merge: true });
      set({ isSaving: false });
    } catch (err) {
      set({ error: (err as Error).message, isSaving: false });
    }
  }
}));
