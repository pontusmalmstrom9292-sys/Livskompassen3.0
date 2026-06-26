import { create } from 'zustand';

export type PansarTriggerSource = 'manual' | 'biometric' | 'biochemical' | null;
export type PansarLevel = 1 | 2 | 3;

interface PansarState {
  isPansarActive: boolean;
  triggerSource: PansarTriggerSource;
  pansarLevel: PansarLevel;
  activatedAt: Date | null;
  activate: (source?: PansarTriggerSource, level?: PansarLevel) => void;
  deactivate: () => void;
}

export const usePansarStore = create<PansarState>((set) => ({
  isPansarActive: false,
  triggerSource: null,
  pansarLevel: 1,
  activatedAt: null,
  activate: (source = 'manual', level = 1) =>
    set({
      isPansarActive: true,
      triggerSource: source,
      pansarLevel: level,
      activatedAt: new Date(),
    }),
  deactivate: () =>
    set({
      isPansarActive: false,
      triggerSource: null,
      activatedAt: null,
    }),
}));
