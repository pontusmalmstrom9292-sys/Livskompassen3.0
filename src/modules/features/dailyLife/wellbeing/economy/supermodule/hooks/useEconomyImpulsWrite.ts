import { useCallback, useEffect, useRef, useState } from 'react';
import {
  deleteEconomyImpulse,
  getEconomyImpulseQueue,
  parkEconomyImpulse,
  resolveEconomyImpulse,
} from '@/core/firebase/economyFirestore';
import { isBrowserOffline } from '@/core/firebase/offlineWritePolicy';
import type { EconomyImpulseRow } from '@/core/types/firestore';
import { resolveEconomySaveError } from './resolveEconomySaveError';

function resolveSaveError(err: unknown): string {
  return resolveEconomySaveError(err, 'Kunde inte uppdatera impulskö.');
}

/**
 * Read/write `economy_impulse_queue` — thin mapping for EkonomiImpulsDelegate.
 * Purchases → `transactions` via useEconomyTransactionWORM in delegate.
 */
export function useEconomyImpulsWrite(userId: string | undefined) {
  const [items, setItems] = useState<EconomyImpulseRow[]>([]);
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
      setItems(await getEconomyImpulseQueue(userId));
    } catch {
      setError('Kunde inte läsa impulskö.');
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
      setItems([]);
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

  const parkImpulse = useCallback(
    async (label: string): Promise<boolean> => {
      if (!userId || !label.trim()) return false;

      setSaving(true);
      setError(null);
      setSavedFlash(false);
      setOfflineQueued(false);

      const queuedOffline = isBrowserOffline();

      try {
        await parkEconomyImpulse(userId, label);
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

  const resolveImpulse = useCallback(
    async (impulseId: string, status: 'bought' | 'skipped'): Promise<boolean> => {
      if (!userId) return false;

      setSaving(true);
      setError(null);

      const queuedOffline = isBrowserOffline();

      try {
        await resolveEconomyImpulse(userId, impulseId, status);
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

  const removeImpulse = useCallback(
    async (impulseId: string): Promise<boolean> => {
      if (!userId) return false;

      setSaving(true);
      setError(null);

      const queuedOffline = isBrowserOffline();

      try {
        await deleteEconomyImpulse(userId, impulseId);
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
    items,
    loading,
    saving,
    savedFlash,
    offlineQueued,
    error,
    clearError,
    reload,
    parkImpulse,
    resolveImpulse,
    removeImpulse,
  };
}
