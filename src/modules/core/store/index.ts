import { create } from 'zustand';
import { clearAllVaultZones } from '../auth/sessionService';

export type User = {
  uid: string;
  email?: string;
  isAnonymous?: boolean;
};

export type UiState = {
  activeDrawer: 'biff' | 'vault' | 'emotion' | 'kompis' | null;
  compassFilter: 'all' | 'morning' | 'day' | 'evening';
  isVaultUnlocked: boolean;
  moduleHubOpen: boolean;
  isMenuOpen: boolean;
};

export type SystemState = {
  isLoading: boolean;
  error: string | null;
  kompisAuraActive: boolean;
};

export type AppState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  ui: UiState;
  setActiveDrawer: (drawer: UiState['activeDrawer']) => void;
  setCompassFilter: (filter: UiState['compassFilter']) => void;
  setVaultUnlocked: (unlocked: boolean) => void;
  setModuleHubOpen: (open: boolean) => void;
  setMenuOpen: (isOpen: boolean) => void;
  toggleMenu: () => void;
  system: SystemState;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setKompisAura: (active: boolean) => void;
  resetState: () => void;
};

const initialUiState: UiState = {
  activeDrawer: null,
  compassFilter: 'all',
  isVaultUnlocked: false,
  moduleHubOpen: false,
  isMenuOpen: false,
};

const initialSystemState: SystemState = {
  isLoading: false,
  error: null,
  kompisAuraActive: false,
};

export const useStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  ui: initialUiState,
  setActiveDrawer: (drawer) => set((state) => ({ ui: { ...state.ui, activeDrawer: drawer } })),
  setCompassFilter: (filter) => set((state) => ({ ui: { ...state.ui, compassFilter: filter } })),
  setVaultUnlocked: (unlocked) =>
    set((state) => ({ ui: { ...state.ui, isVaultUnlocked: unlocked } })),
  setModuleHubOpen: (open) =>
    set((state) => ({ ui: { ...state.ui, moduleHubOpen: open } })),
  setMenuOpen: (isOpen) =>
    set((state) => ({ ui: { ...state.ui, isMenuOpen: isOpen } })),
  toggleMenu: () =>
    set((state) => ({ ui: { ...state.ui, isMenuOpen: !state.ui.isMenuOpen } })),
  system: initialSystemState,
  setLoading: (isLoading) => set((state) => ({ system: { ...state.system, isLoading } })),
  setError: (error) => set((state) => ({ system: { ...state.system, error } })),
  setKompisAura: (active) => set((state) => ({ system: { ...state.system, kompisAuraActive: active } })),
  resetState: () => {
    clearAllVaultZones();
    set({
      user: null,
      isAuthenticated: false,
      ui: initialUiState,
      system: initialSystemState,
    });
  },
}));
