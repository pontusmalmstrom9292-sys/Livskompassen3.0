import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getEconomyProfile,
  getEconomyTransactions,
} from '@/core/firebase/firestore';
import {
  weeklyBudgetLeft,
  weeklyProgressPercent,
  weeklySpentSek,
} from '@/features/dailyLife/wellbeing/economy/rules/budgetTemplates';

const DEFAULT_WEEKLY = 500;
const DEFAULT_MEAL = 85;

export type EconomySaldoTransactionRow = {
  id: string;
  label: string;
  amountSek: number;
  category: string;
  createdAt: string;
};

/**
 * Read-only saldo data for EkonomiSaldoDelegate — no writes, no economy_ledger.
 * Zero Footprint: clears local state on unmount.
 */
export function useEconomySaldoRead(userId: string | undefined) {
  const [transactions, setTransactions] = useState<EconomySaldoTransactionRow[]>([]);
  const [weeklyBudget, setWeeklyBudget] = useState(DEFAULT_WEEKLY);
  const [mealPreset, setMealPreset] = useState(DEFAULT_MEAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const [txs, profile] = await Promise.all([
        getEconomyTransactions(userId),
        getEconomyProfile(userId),
      ]);
      setTransactions(txs);
      if (profile) {
        setWeeklyBudget(profile.weeklyBudgetSek || DEFAULT_WEEKLY);
        setMealPreset(profile.mealBoxPresetSek || DEFAULT_MEAL);
      }
    } catch {
      setError('Kunde inte läsa ekonomi.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(
    () => () => {
      setTransactions([]);
      setWeeklyBudget(DEFAULT_WEEKLY);
      setMealPreset(DEFAULT_MEAL);
      setError(null);
    },
    [],
  );

  const balance = useMemo(
    () => transactions.reduce((sum, t) => sum + t.amountSek, 0),
    [transactions],
  );

  const spentThisWeek = useMemo(() => weeklySpentSek(transactions), [transactions]);
  const leftThisWeek = useMemo(
    () => weeklyBudgetLeft(weeklyBudget, spentThisWeek),
    [weeklyBudget, spentThisWeek],
  );
  const progressPercent = useMemo(
    () => weeklyProgressPercent(weeklyBudget, spentThisWeek),
    [weeklyBudget, spentThisWeek],
  );

  return {
    loading,
    error,
    balance,
    spentThisWeek,
    leftThisWeek,
    progressPercent,
    weeklyBudget,
    mealPreset,
    reload,
  };
}
