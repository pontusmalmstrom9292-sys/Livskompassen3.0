import { create } from 'zustand';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { FIRESTORE_COLLECTIONS, type EvolutionHubDoc } from '../types/firestore';

export interface EvolutionState {
  // State
  doc: EvolutionHubDoc | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  barnportenLevel: number;
  unlockedPacks: string[];
  hasSeenLevel2Animation: boolean;

  // Actions
  setDoc: (doc: EvolutionHubDoc | null, options?: { userId?: string }) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  listenToEvolutionHub: (uid: string) => () => void;
  setHasSeenLevel2Animation: (seen: boolean) => void;

  // Helpers / Selectors
  hasFeature: (flag: string) => boolean;
  hasUnlockedPack: (packId: string) => boolean;
  getChildBracket: (alias: string) => 'toddler_preschool' | 'early_school' | 'pre_teen' | 'teen';
}

export const useEvolutionStore = create<EvolutionState>((set, get) => ({
  doc: null,
  isLoading: true,
  isInitialized: false,
  error: null,
  barnportenLevel: 1,
  unlockedPacks: [],
  hasSeenLevel2Animation: false,

  setHasSeenLevel2Animation: (seen) => set({ hasSeenLevel2Animation: seen }),

  setDoc: (docData, _options) => {
    if (!docData) {
      set({
        doc: null,
        barnportenLevel: 1,
        unlockedPacks: [],
        isLoading: false,
        isInitialized: true,
        error: null,
      });
      return;
    }

    // Determine the barnportenLevel.
    // In our evaluator, it is placed under childrenAgeState.[childAlias].barnportenLevel.
    // If the root document has it or if we can extract the maximum from childrenAgeState, we do that.
    let level = 1;
    if (docData.childrenAgeState) {
      const levels = Object.values(docData.childrenAgeState)
        .map((child: any) => child?.barnportenLevel)
        .filter((l): l is number => typeof l === 'number');
      
      if (levels.length > 0) {
        level = Math.max(...levels);
      }
    }

    // Also allow root level override if written directly there
    if ((docData as any).barnportenLevel !== undefined) {
      level = (docData as any).barnportenLevel;
    }

    set({
      doc: docData,
      barnportenLevel: level,
      unlockedPacks: docData.unlockedPacks || [],
      isLoading: false,
      isInitialized: true,
      error: null,
    });
    // evolution_ledger: server-only via onEvolutionHubWrite (P0.1 / P2.4)
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),

  listenToEvolutionHub: (uid: string) => {
    set({ isLoading: true, error: null });
    const docRef = doc(db, FIRESTORE_COLLECTIONS.evolution_hub, uid);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as EvolutionHubDoc;
          get().setDoc(
            { ...data, userId: uid, ownerId: uid },
            { userId: uid },
          );
        } else {
          get().setDoc(null);
        }
      },
      (err) => {
        console.error('[EvolutionStore] Error listening to evolution_hub:', err);
        get().setError('Kunde inte läsa evolution_hub');
      }
    );

    return unsubscribe;
  },

  hasFeature: (flag: string) => {
    const { doc } = get();
    if (!doc) return false;
    return doc.unlockedFeatureFlags?.includes(flag) || false;
  },

  hasUnlockedPack: (packId: string) => {
    return get().unlockedPacks.includes(packId);
  },

  getChildBracket: (alias: string) => {
    const { doc } = get();
    if (!doc) return 'toddler_preschool';
    
    // Antar att alias är små bokstäver som i mock/types ('kasper', 'arvid')
    const key = alias.toLowerCase() as keyof EvolutionHubDoc['childrenAgeState'];
    const childState = doc.childrenAgeState?.[key];
    
    if (childState) {
      return childState.currentBracket;
    }
    
    return 'toddler_preschool';
  },
}));
