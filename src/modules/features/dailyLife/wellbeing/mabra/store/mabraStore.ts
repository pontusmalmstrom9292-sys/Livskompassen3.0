import { create } from 'zustand';
import { DEFAULT_MABRA_DURATION } from '../constants';
import type {
  MabraDurationMinutes,
  MabraExerciseType,
  MabraSymptomHub,
} from '../types';
import type { MabraHubCategory } from '../mabraHubRegistry';
import type { MabraPlanKind } from '../constants/mabraProjects';
import { readAllVitProjectLastSeen } from '../lib/vitProjectLastSeen';
import { hasSeenMabraModulValjare } from '../lib/mabraModulValjareStorage';
import { saveMabraCheckIn, getLatestMabraCheckIn, type CheckInRow } from '@/core/firebase/firestore';

export interface MabraState {
  // State
  hub: MabraSymptomHub | null;
  durationMinutes: MabraDurationMinutes;
  saveError: string | null;
  completedExerciseType: MabraExerciseType;
  addonBreathing: boolean;
  valuesSavedHint: boolean;
  selectedPlan: MabraPlanKind | null;
  hubOpenCategory: MabraHubCategory | null;
  hubFocusToken: number;
  lowEnergyMode: boolean;
  vitLastSeen: Record<string, any>;
  showHubPicker: boolean;

  // Setters
  setHub: (hub: MabraSymptomHub | null) => void;
  setDurationMinutes: (duration: MabraDurationMinutes) => void;
  setSaveError: (error: string | null) => void;
  setCompletedExerciseType: (type: MabraExerciseType) => void;
  setAddonBreathing: (addon: boolean) => void;
  setValuesSavedHint: (hint: boolean) => void;
  setSelectedPlan: (plan: MabraPlanKind | null) => void;
  setHubOpenCategory: (category: MabraHubCategory | null) => void;
  setHubFocusToken: (token: number | ((prev: number) => number)) => void;
  setLowEnergyMode: (mode: boolean) => void;
  setVitLastSeen: (lastSeen: Record<string, number>) => void;
  setShowHubPicker: (show: boolean) => void;
  latestCheckIn: CheckInRow | null;
  isLoadingCheckIn: boolean;
  
  // Actions
  saveMabraCheckIn: (
    userId: string,
    checkIn: { energy: number; mood: number; notes?: string }
  ) => Promise<void>;
  fetchLatestCheckIn: (userId: string) => Promise<void>;
  
  // Resetter
  reset: () => void;
}

const getInitialState = () => ({
  hub: null,
  durationMinutes: DEFAULT_MABRA_DURATION,
  saveError: null,
  completedExerciseType: 'breathing' as MabraExerciseType,
  addonBreathing: false,
  valuesSavedHint: false,
  selectedPlan: null,
  hubOpenCategory: 'akut' as MabraHubCategory | null,
  hubFocusToken: 0,
  lowEnergyMode: false,
  vitLastSeen: readAllVitProjectLastSeen(),
  /** M3.0-B — 8 pelarkort första gången; sedan hub tills "Byt ingång". */
  showHubPicker: !hasSeenMabraModulValjare(),
  latestCheckIn: null,
  isLoadingCheckIn: false,
});

export const useMabraStore = create<MabraState>()((set) => ({
  ...getInitialState(),
  
  setHub: (hub) => set({ hub }),
  setDurationMinutes: (durationMinutes) => set({ durationMinutes }),
  setSaveError: (saveError) => set({ saveError }),
  setCompletedExerciseType: (completedExerciseType) => set({ completedExerciseType }),
  setAddonBreathing: (addonBreathing) => set({ addonBreathing }),
  setValuesSavedHint: (valuesSavedHint) => set({ valuesSavedHint }),
  setSelectedPlan: (selectedPlan) => set({ selectedPlan }),
  setHubOpenCategory: (hubOpenCategory) => set({ hubOpenCategory }),
  setHubFocusToken: (token) => set((state) => ({ 
    hubFocusToken: typeof token === 'function' ? token(state.hubFocusToken) : token 
  })),
  setLowEnergyMode: (lowEnergyMode) => set({ lowEnergyMode }),
  setVitLastSeen: (vitLastSeen) => set({ vitLastSeen }),
  setShowHubPicker: (showHubPicker) => set({ showHubPicker }),
  
  saveMabraCheckIn: async (userId, checkIn) => {
    set({ saveError: null });
    try {
      const docId = await saveMabraCheckIn(userId, checkIn);
      const today = new Date().toISOString();
      set({
        latestCheckIn: {
          id: docId,
          userId,
          questionId: 'mabra_checkin',
          questionText: 'MåBra Incheckning',
          optionSelected: 'completed',
          taskCategory: 'wellbeing',
          taskNote: checkIn.notes || '',
          energy: checkIn.energy,
          mood: checkIn.mood,
          createdAt: today,
        }
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Misslyckades att spara incheckning.';
      set({ saveError: msg });
      throw err;
    }
  },

  fetchLatestCheckIn: async (userId) => {
    set({ isLoadingCheckIn: true, saveError: null });
    try {
      const checkIn = await getLatestMabraCheckIn(userId);
      set({ latestCheckIn: checkIn, isLoadingCheckIn: false });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Misslyckades att hämta senaste incheckning.';
      set({ saveError: msg, isLoadingCheckIn: false });
    }
  },
  
  reset: () => set(getInitialState()),
}));
