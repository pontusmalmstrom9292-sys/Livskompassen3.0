import { create } from 'zustand';
import { VaultService, VaultRecord } from '../services/VaultService';

export interface VaultState {
  vaultEntries: VaultRecord[];
  loading: boolean;
  error: string | null;
  saveEntry: (entry: VaultRecord) => Promise<void>;
  fetchVault: (id: string) => Promise<void>;
}

export const useVaultStore = create<VaultState>((set, get) => ({
  vaultEntries: [],
  loading: false,
  error: null,

  saveEntry: async (entry: VaultRecord) => {
    set({ loading: true, error: null });
    try {
      await VaultService.saveVaultEntry(entry);
      
      set((state) => ({
        vaultEntries: [...state.vaultEntries, entry],
        loading: false,
      }));
    } catch (err: any) {
      const errorMessage = err?.message || '';
      
      // Vi matchar både den exakta felkoden från servicen och den från prompt-instruktionen
      if (
        errorMessage.includes('Dataintegritetsbrott') || 
        errorMessage.includes('Dataintegritetsöverträdelse') ||
        errorMessage.includes('redan finns')
      ) {
        set({ 
          error: 'Denna post är redan förseglad i valvet',
          loading: false 
        });
      } else {
        set({ 
          error: errorMessage || 'Ett okänt fel inträffade',
          loading: false 
        });
      }
    }
  },

  fetchVault: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const entry = await VaultService.getVaultEntry(id);
      
      if (entry) {
        set((state) => {
          const exists = state.vaultEntries.some((e) => e.id === entry.id);
          if (exists) {
            // Uppdatera befintlig post
            return {
              vaultEntries: state.vaultEntries.map((e) => e.id === entry.id ? entry : e),
              loading: false
            };
          }
          // Lägg till ny post
          return {
            vaultEntries: [...state.vaultEntries, entry],
            loading: false
          };
        });
      } else {
        set({ loading: false });
      }
    } catch (err: any) {
      set({ 
        error: err?.message || 'Kunde inte hämta data från valvet',
        loading: false 
      });
    }
  }
}));
