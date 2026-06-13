import { create } from 'zustand';

export const NavView = {
  ORACLE: 'ORACLE',
  COMPASS: 'COMPASS',
  VAULT: 'VAULT',
} as const;

export type NavView = typeof NavView[keyof typeof NavView];

interface NavigationState {
  activeView: NavView;
  setActiveView: (view: NavView) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeView: NavView.COMPASS,
  setActiveView: (view) => set({ activeView: view }),
}));
