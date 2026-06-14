import { useCallback, useEffect, useState } from 'react';
import {
  getEconomyMealPrep,
  setEconomyMealPrep,
} from '@/core/firebase/economyFirestore';
import type { EconomyMealPrepItem } from '@/core/types/firestore';

/**
 * Read/write meal prep checklist on `economy_profiles.mealPrepItems`.
 * Transaction writes stay in useEconomyTransactionWORM (delegate).
 */
export function useEconomyMatprepRead(userId: string | undefined) {
  const [items, setItems] = useState<EconomyMealPrepItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [persisting, setPersisting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      setItems(await getEconomyMealPrep(userId));
    } catch {
      setError('Kunde inte läsa matprepp.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(
    () => () => {
      setItems([]);
      setLoading(false);
      setPersisting(false);
      setError(null);
    },
    [],
  );

  const persistItems = useCallback(
    async (next: EconomyMealPrepItem[]): Promise<boolean> => {
      if (!userId) return false;
      setPersisting(true);
      setError(null);
      try {
        await setEconomyMealPrep(userId, next);
        setItems(next);
        return true;
      } catch {
        setError('Kunde inte spara checklista.');
        return false;
      } finally {
        setPersisting(false);
      }
    },
    [userId],
  );

  const toggleItem = useCallback(
    async (id: string) => {
      const next = items.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      );
      await persistItems(next);
    },
    [items, persistItems],
  );

  const resetChecklist = useCallback(async (): Promise<boolean> => {
    const reset = items.map((item) => ({ ...item, done: false }));
    return persistItems(reset);
  }, [items, persistItems]);

  return {
    items,
    loading,
    persisting,
    error,
    reload,
    toggleItem,
    resetChecklist,
  };
}
