import { create } from 'zustand';
import { getVaultLogs, saveVaultLog, type VaultLogsCursor } from '../firebase/firestore';
import type { VaultLog } from '../types/firestore';
import type { VaultLogInput } from '../../features/lifeJournal/evidence/vault/types/vaultEntry';
import { OfflineWriteBlockedError } from '../firebase/offlineWritePolicy';

export interface VaultState {
  logs: (VaultLog & { id: string })[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  nextCursor: VaultLogsCursor | null;
  error: string | null;
  saving: boolean;

  loadFirstLogsPage: (userId: string) => Promise<void>;
  loadMoreLogs: (userId: string) => Promise<void>;
  saveLog: (userId: string, input: VaultLogInput) => Promise<void>;
}

export const useVaultStore = create<VaultState>((set, get) => ({
  logs: [],
  loading: false,
  loadingMore: false,
  hasMore: false,
  nextCursor: null,
  error: null,
  saving: false,

  loadFirstLogsPage: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const page = await getVaultLogs(userId);
      set({
        logs: page.logs,
        nextCursor: page.nextCursor,
        hasMore: page.hasMore,
        loading: false,
      });
    } catch (err: any) {
      set({ error: 'Kunde inte hämta loggar från valvet.', loading: false });
    }
  },

  loadMoreLogs: async (userId: string) => {
    const { nextCursor, loadingMore, hasMore } = get();
    if (!nextCursor || loadingMore || !hasMore) return;
    
    set({ loadingMore: true });
    try {
      const page = await getVaultLogs(userId, { cursor: nextCursor });
      set((state) => ({
        logs: [...state.logs, ...page.logs],
        nextCursor: page.nextCursor,
        hasMore: page.hasMore,
        loadingMore: false,
      }));
    } catch (err) {
      set({ loadingMore: false });
    }
  },

  saveLog: async (userId: string, input: VaultLogInput) => {
    set({ saving: true, error: null });
    try {
      await saveVaultLog(userId, input);
      const page = await getVaultLogs(userId);
      set({
        logs: page.logs,
        nextCursor: page.nextCursor,
        hasMore: page.hasMore,
        saving: false,
      });
    } catch (err: any) {
      const errorMessage = err instanceof OfflineWriteBlockedError 
        ? err.message 
        : 'Kunde inte spara till valvet.';
      set({ error: errorMessage, saving: false });
      throw new Error('vault-save-failed');
    }
  }
}));
