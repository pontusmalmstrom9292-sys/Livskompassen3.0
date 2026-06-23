import { create } from 'zustand';

interface PansarState {
  isPansarActive: boolean;
  activate: () => void;
  deactivate: () => void;
}

export const usePansarStore = create<PansarState>((set) => ({
  isPansarActive: false,
  activate: () => set({ isPansarActive: true }),
  deactivate: () => set({ isPansarActive: false }),
}));
