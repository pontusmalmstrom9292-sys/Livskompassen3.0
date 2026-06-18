import { create } from 'zustand';
import type { CheckInRow } from '@/core/firebase/firestore';
import { getMabraHistory } from '@/core/firebase/mabraHistory';
import { getMabraRsdErrorCopy } from '../lib/mabraRsdErrorCopy';

export interface MabraHistoryState {
  history: CheckInRow[];
  isLoading: boolean;
  error: string | null;
  fetchHistory: (userId: string, limitCount?: number) => Promise<void>;
  resetHistory: () => void;
}

export const useMabraHistoryStore = create<MabraHistoryState>()((set) => ({
  history: [],
  isLoading: false,
  error: null,

  fetchHistory: async (userId: string, limitCount = 30) => {
    set({ isLoading: true, error: null });
    try {
      const history = await getMabraHistory(userId, limitCount);
      set({ history, isLoading: false });
    } catch {
      set({ error: getMabraRsdErrorCopy(), isLoading: false });
    }
  },

  resetHistory: () => set({ history: [], isLoading: false, error: null }),
}));
