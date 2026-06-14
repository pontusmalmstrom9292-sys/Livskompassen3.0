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

/** Ref-counted singleton — flera komponenter kan säkert prenumerera utan dubbla onSnapshot. */
let activeUid: string | null = null;
let refCount = 0;
let firestoreUnsubscribe: (() => void) | null = null;

function startFirestoreListener(uid: string, set: (partial: Partial<CapacityGateState>) => void): void {
  const docRef = doc(db, FIRESTORE_COLLECTIONS.user_capability_state, uid);

  firestoreUnsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as UserCapabilityState;
        set({
          isEconomyAdvancedUnlocked: data.economy_advanced === true,
          capacityScore: typeof data.capacityScore === 'number' ? data.capacityScore : 0,
          isLoading: false,
          error: null,
        });
      } else {
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
    },
  );
}

function releaseListener(): void {
  refCount = Math.max(0, refCount - 1);
  if (refCount === 0) {
    firestoreUnsubscribe?.();
    firestoreUnsubscribe = null;
    activeUid = null;
  }
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
    if (!uid) {
      if (firestoreUnsubscribe) {
        firestoreUnsubscribe();
        firestoreUnsubscribe = null;
        activeUid = null;
        refCount = 0;
      }
      get().reset();
      return () => {};
    }

    if (activeUid === uid && firestoreUnsubscribe) {
      refCount += 1;
      return releaseListener;
    }

    if (firestoreUnsubscribe) {
      firestoreUnsubscribe();
      firestoreUnsubscribe = null;
    }

    activeUid = uid;
    refCount = 1;
    set({ isLoading: true, error: null });
    startFirestoreListener(uid, set);

    return releaseListener;
  },
}));

// Fine-grained stable selector hooks to eliminate unnecessary re-renders
export const useIsEconomyAdvancedUnlocked = () => useCapacityGate((s) => s.isEconomyAdvancedUnlocked);
export const useCapacityScore = () => useCapacityGate((s) => s.capacityScore);
export const useIsCapacityLoading = () => useCapacityGate((s) => s.isLoading);
export const useCapacityError = () => useCapacityGate((s) => s.error);
export const useListenToCapacityState = () => useCapacityGate((s) => s.listenToCapacityState);
