import { useCallback, useEffect, useRef, useState } from 'react';
import { saveEconomyTransaction } from '@/core/firebase/firestore';
import { isBrowserOffline } from '@/core/firebase/offlineWritePolicy';
import { resolveEconomySaveError } from './resolveEconomySaveError';

/** WORM-safe transaction categories — `transactions` collection only. */
export type EconomyTransactionCategory = 'veckopeng' | 'matlada' | 'vinst' | 'ovrigt';

export type SaveEconomyTransactionInput = {
  label: string;
  amountSek: number;
  category: EconomyTransactionCategory;
};

function resolveSaveError(err: unknown): string {
  return resolveEconomySaveError(err, 'Kunde inte spara transaktion.');
}

/**
 * Superhub WORM write hook — `transactions` via `saveEconomyTransaction` only.
 * MUST NOT import economy_ledger helpers (Arbetsliv zone).
 */
export function useEconomyTransactionWORM(
  userId: string | undefined,
  onSaved?: () => void | Promise<void>,
) {
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [offlineQueued, setOfflineQueued] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const flashTimerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (flashTimerRef.current !== null) {
        window.clearTimeout(flashTimerRef.current);
      }
      setSaving(false);
      setSavedFlash(false);
      setOfflineQueued(false);
      setError(null);
    },
    [],
  );

  const clearError = useCallback(() => setError(null), []);

  const saveTransaction = useCallback(
    async (input: SaveEconomyTransactionInput): Promise<boolean> => {
      if (!userId) return false;

      setSaving(true);
      setError(null);
      setSavedFlash(false);
      setOfflineQueued(false);

      const queuedOffline = isBrowserOffline();

      try {
        await saveEconomyTransaction(userId, input);
        await onSaved?.();
        setSavedFlash(true);
        if (queuedOffline) {
          setOfflineQueued(true);
        }
        if (flashTimerRef.current !== null) {
          window.clearTimeout(flashTimerRef.current);
        }
        flashTimerRef.current = window.setTimeout(() => {
          setSavedFlash(false);
        }, 2000);
        return true;
      } catch (err: unknown) {
        setError(resolveSaveError(err));
        return false;
      } finally {
        setSaving(false);
      }
    },
    [userId, onSaved],
  );

  return {
    saveTransaction,
    saving,
    savedFlash,
    offlineQueued,
    error,
    clearError,
  };
}
