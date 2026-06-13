import { create } from 'zustand';

interface ParalysisState {
  isZenModeActive: boolean;
  currentMicroTasks: string[];
  setZenMode: (active: boolean) => void;
  setMicroTasks: (tasks: string[]) => void;
  breakDownTask: (task: string) => void;
}

export const useParalysisStore = create<ParalysisState>((set) => ({
  isZenModeActive: false,
  currentMicroTasks: [],
  setZenMode: (active) => set({ isZenModeActive: active }),
  setMicroTasks: (tasks) => set({ currentMicroTasks: tasks }),
  breakDownTask: (task) => {
    // Placeholder logic for simulation
    if (!task.trim()) {
      set({ currentMicroTasks: [] });
      return;
    }
    const simulatedTasks = [
      `1. Gör dig redo att: ${task}`,
      `2. Utför det absolut minsta steget av: ${task}`,
      `3. Belöna dig själv för att du tog första steget.`,
    ];
    set({ currentMicroTasks: simulatedTasks });
  },
}));
