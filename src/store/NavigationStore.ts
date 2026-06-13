import { create } from 'zustand';

export enum NavView {
  ORACLE = 'ORACLE',
  COMPASS = 'COMPASS',
  VAULT = 'VAULT',
}

interface NavigationState {
  activeView: NavView;
  setActiveView: (view: NavView) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeView: NavView.COMPASS,
  setActiveView: (view) => set({ activeView: view }),
}));
