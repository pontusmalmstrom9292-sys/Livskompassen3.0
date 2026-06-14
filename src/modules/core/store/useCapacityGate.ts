import { create } from 'zustand';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { FIRESTORE_COLLECTIONS, type UserCapabilityState } from '../types/firestore';

export interface CapacityGateState {
  isEconomyAdvancedUnlocked: boolean;
  capacityScore: number;
  isLoading: boolean;
  error: string | null;

  listenToCapacityState: (uid: string) => () => void;
  reset: () => void;
}

export const useCapacityGate = create<CapacityGateState>((set, get) => ({
  isEconomyAdvancedUnlocked: false,
  capacityScore: 0,
  isLoading: true,
  error: null,

  reset: () => set({
    isEconomyAdvancedUnlocked: false,
    capacityScore: 0,
    isLoading: true,
    error: null,
  }),

  listenToCapacityState: (uid: string) => {
    set({ isLoading: true, error: null });
    
    if (!uid) {
      get().reset();
      return () => {};
    }

    const docRef = doc(db, FIRESTORE_COLLECTIONS.user_capability_state, uid);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as UserCapabilityState;
          set({
            isEconomyAdvancedUnlocked: data.economy_advanced,
            capacityScore: data.capacityScore,
            isLoading: false,
            error: null,
          });
        } else {
          // Document might not exist yet if Orkestern hasn't run or user is new
          set({
            isEconomyAdvancedUnlocked: false,
            capacityScore: 0,
            isLoading: false,
            error: null,
          });
        }
      },
      (err) => {
        console.error('[CapacityGate] Error listening to user_capability_state:', err);
        set({ error: 'Kunde inte läsa user_capability_state', isLoading: false });
      }
    );

    return unsubscribe;
  },
}));
