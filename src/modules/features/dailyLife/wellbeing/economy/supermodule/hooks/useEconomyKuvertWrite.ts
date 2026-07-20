import { useCallback, useEffect, useRef, useState } from 'react';
import {
  deleteBudgetEnvelope,
  getBudgetEnvelopes,
  setBudgetEnvelope,
} from '@/core/firebase/economyFirestore';
import { isBrowserOffline } from '@/core/firebase/offlineWritePolicy';
import type { BudgetEnvelopeRow } from '@/core/types/firestore';
import { resolveEconomySaveError } from './resolveEconomySaveError';

function resolveSaveError(err: unknown): string {
  return resolveEconomySaveError(err, 'Kunde inte spara kuvert.');
}

/**
 * Read/write `budgets` — kuvert CRUD for EkonomiKuvertDelegate.
 * Expense transactions stay in useEconomyTransactionWORM (delegate).
 */
export function useEconomyKuvertWrite(userId: string | undefined) {
  const [envelopes, setEnvelopes] = useState<BudgetEnvelopeRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [offlineQueued, setOfflineQueued] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const flashTimerRef = useRef<number | null>(null);

  const reload = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      setEnvelopes(await getBudgetEnvelopes(userId));
    } catch {
      setError('Kunde inte läsa kuvert.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(
    () => () => {
      if (flashTimerRef.current !== null) {
        window.clearTimeout(flashTimerRef.current);
      }
      setEnvelopes([]);
      setLoading(false);
      setSaving(false);
      setSavedFlash(false);
      setOfflineQueued(false);
      setError(null);
    },
    [],
  );

  const clearError = useCallback(() => setError(null), []);

  const flashSaved = useCallback((queuedOffline: boolean) => {
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
  }, []);

  const createEnvelope = useCallback(
    async (title: string, allocatedSek: number): Promise<boolean> => {
      if (!userId || !title.trim()) return false;

      setSaving(true);
      setError(null);
      setSavedFlash(false);
      setOfflineQueued(false);

      const queuedOffline = isBrowserOffline();

      try {
        await setBudgetEnvelope(userId, {
          title: title.trim(),
          allocatedSek: Math.max(0, Math.round(allocatedSek)),
          spentSek: 0,
        });
        await reload();
        flashSaved(queuedOffline);
        return true;
      } catch (err: unknown) {
        setError(resolveSaveError(err));
        return false;
      } finally {
        setSaving(false);
      }
    },
    [flashSaved, reload, userId],
  );

  const recordEnvelopeSpend = useCallback(
    async (envelopeId: string, additionalSpentSek: number): Promise<boolean> => {
      if (!userId) return false;

      const envelope = envelopes.find((row) => row.id === envelopeId);
      if (!envelope) return false;

      setSaving(true);
      setError(null);

      const queuedOffline = isBrowserOffline();
      const nextSpent = Math.max(0, envelope.spentSek + Math.max(0, Math.round(additionalSpentSek)));

      try {
        await setBudgetEnvelope(userId, {
          id: envelope.id,
          title: envelope.title,
          allocatedSek: envelope.allocatedSek,
          spentSek: nextSpent,
        });
        await reload();
        flashSaved(queuedOffline);
        return true;
      } catch (err: unknown) {
        setError(resolveSaveError(err));
        return false;
      } finally {
        setSaving(false);
      }
    },
    [envelopes, flashSaved, reload, userId],
  );

  const removeEnvelope = useCallback(
    async (envelopeId: string): Promise<boolean> => {
      if (!userId) return false;

      setSaving(true);
      setError(null);

      const queuedOffline = isBrowserOffline();

      try {
        await deleteBudgetEnvelope(userId, envelopeId);
        await reload();
        flashSaved(queuedOffline);
        return true;
      } catch (err: unknown) {
        setError(resolveSaveError(err));
        return false;
      } finally {
        setSaving(false);
      }
    },
    [flashSaved, reload, userId],
  );

  return {
    envelopes,
    loading,
    saving,
    savedFlash,
    offlineQueued,
    error,
    clearError,
    reload,
    createEnvelope,
    recordEnvelopeSpend,
    removeEnvelope,
  };
}
