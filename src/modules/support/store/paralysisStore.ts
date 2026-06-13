import { create } from 'zustand';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../core/firebase/init';

interface ParalysisState {
  isZenModeActive: boolean;
  isLoading: boolean;
  currentMicroTasks: string[];
  setZenMode: (active: boolean) => void;
  setMicroTasks: (tasks: string[]) => void;
  setIsLoading: (loading: boolean) => void;
  breakDownTask: (task: string) => Promise<void>;
}

export const useParalysisStore = create<ParalysisState>((set) => ({
  isZenModeActive: false,
  isLoading: false,
  currentMicroTasks: [],
  setZenMode: (active) => set({ isZenModeActive: active }),
  setMicroTasks: (tasks) => set({ currentMicroTasks: tasks }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  breakDownTask: async (task) => {
    if (!task.trim()) {
      set({ currentMicroTasks: [] });
      return;
    }
    
    set({ isLoading: true, currentMicroTasks: [] });
    
    try {
      const crushTask = httpsCallable<{ task: string }, { atoms: string[] }>(functions, 'crushTask');
      const response = await crushTask({ task });
      
      if (response.data && response.data.atoms) {
        set({ currentMicroTasks: response.data.atoms });
      } else {
        throw new Error('Inga mikrosteg returnerades');
      }
    } catch (error) {
      console.error('[ParalysisBreaker] Fel vid uppdelning:', error);
      // Fallback
      set({ 
        currentMicroTasks: [
          `1. Gör dig redo att: ${task}`,
          `2. Utför det absolut minsta steget av uppgiften.`,
        ] 
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
