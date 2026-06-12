import { create } from 'zustand';

interface SOSState {
  isSOSActive: boolean;
  activateSOS: () => void;
  deactivateSOS: () => void;
}

export const useSOSStore = create<SOSState>((set) => ({
  isSOSActive: false,
  activateSOS: () => set({ isSOSActive: true }),
  deactivateSOS: () => set({ isSOSActive: false }),
}));
