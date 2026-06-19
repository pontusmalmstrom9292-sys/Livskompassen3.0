import { create } from 'zustand';
import {
  ADAPTATION_LAYER_FLAG,
  ADAPTATION_SEMANTIC_FLAG,
  DEFAULT_ADAPTATION_PREFS,
  type AdaptationPrefsDoc,
  type CoachTone,
  type UiDensity,
} from '../types/adaptation';
import { fetchAdaptationProfile, recordAdaptationSignal } from '../adaptation/adaptationService';
import type { RecordAdaptationSignalPayload } from '../adaptation/adaptationService';

export interface AdaptationState {
  prefs: AdaptationPrefsDoc | null;
  layerEnabled: boolean;
  semanticEnabled: boolean;
  semanticSummary: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  setPrefs: (prefs: AdaptationPrefsDoc | null) => void;
  setLayerEnabled: (enabled: boolean) => void;
  setSemanticEnabled: (enabled: boolean) => void;
  setSemanticSummary: (summary: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  getUiDensity: () => UiDensity;
  getCoachTone: () => CoachTone;
  isParalysMode: () => boolean;

  refreshProfile: () => Promise<void>;
  recordSignal: (payload: RecordAdaptationSignalPayload) => Promise<void>;
}

export { ADAPTATION_LAYER_FLAG, ADAPTATION_SEMANTIC_FLAG };

const INITIAL_STATE = {
  prefs: null,
  layerEnabled: false,
  semanticEnabled: false,
  semanticSummary: null,
  isLoading: false,
  isInitialized: false,
  error: null,
} satisfies Pick<
  AdaptationState,
  | 'prefs'
  | 'layerEnabled'
  | 'semanticEnabled'
  | 'semanticSummary'
  | 'isLoading'
  | 'isInitialized'
  | 'error'
>;

export const useAdaptationStore = create<AdaptationState>((set, get) => ({
  ...INITIAL_STATE,

  setPrefs: (prefs) => {
    set({
      prefs,
      isLoading: false,
      isInitialized: true,
      error: null,
    });
  },

  setLayerEnabled: (layerEnabled) => {
    if (!layerEnabled) {
      set({ ...INITIAL_STATE, isInitialized: true });
      return;
    }
    set({ layerEnabled });
  },

  setSemanticEnabled: (semanticEnabled) => {
    if (!semanticEnabled) {
      set({ semanticEnabled: false, semanticSummary: null });
      return;
    }
    set({ semanticEnabled });
  },

  setSemanticSummary: (semanticSummary) => set({ semanticSummary }),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),

  reset: () => set({ ...INITIAL_STATE, isInitialized: true }),

  getUiDensity: () => get().prefs?.uiDensity ?? DEFAULT_ADAPTATION_PREFS.uiDensity,
  getCoachTone: () => get().prefs?.coachTone ?? DEFAULT_ADAPTATION_PREFS.coachTone,

  isParalysMode: () => {
    const { layerEnabled, prefs } = get();
    if (!layerEnabled) return false;
    return (prefs?.uiDensity ?? DEFAULT_ADAPTATION_PREFS.uiDensity) === 'paralys';
  },

  refreshProfile: async () => {
    const { layerEnabled } = get();
    if (!layerEnabled) {
      set({ prefs: null, isLoading: false, isInitialized: true });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const result = await fetchAdaptationProfile();
      set({
        layerEnabled: result.enabled,
        prefs: result.prefs,
        isLoading: false,
        isInitialized: true,
        error: null,
      });
    } catch (err) {
      console.error('[AdaptationStore] refreshProfile:', err);
      set({
        isLoading: false,
        isInitialized: true,
        error: 'Kunde inte läsa adaptation-profil',
      });
    }
  },

  recordSignal: async (payload) => {
    const { layerEnabled } = get();
    if (!layerEnabled) return;

    try {
      const result = await recordAdaptationSignal(payload);
      set({ prefs: result.prefs, error: null });
    } catch (err) {
      console.error('[AdaptationStore] recordSignal:', err);
      set({ error: 'Kunde inte spara adaptationssignal' });
      throw err;
    }
  },
}));
