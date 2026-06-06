import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from '@/core/store';
import {
  getEconomyProfile,
  getEconomyTransactions,
  saveEconomyTransaction,
  setEconomyProfile,
} from '@/core/firebase/firestore';
import { weeklyBudgetLeft, weeklyProgressPercent, weeklySpentSek } from '../rules/budgetTemplates';

export type EconomyTransactionRow = {
  id: string;
  label: string;
  amountSek: number;
  category: string;
  createdAt: string;
};

const DEFAULT_WEEKLY = 500;
const DEFAULT_MEAL = 85;

export function useEconomyBudget() {
  const user = useStore((s) => s.user);
  const [transactions, setTransactions] = useState<EconomyTransactionRow[]>([]);
  const [weeklyBudget, setWeeklyBudget] = useState(DEFAULT_WEEKLY);
  const [mealPreset, setMealPreset] = useState(DEFAULT_MEAL);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [txs, profile] = await Promise.all([
        getEconomyTransactions(user.uid),
        getEconomyProfile(user.uid),
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
  }, [user]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(
    () => () => {
      setTransactions([]);
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

  const quickAdd = async (
    label: string,
    amountSek: number,
    category: 'veckopeng' | 'matlada' | 'vinst' | 'ovrigt',
  ) => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await saveEconomyTransaction(user.uid, { label, amountSek, category });
      await reload();
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 2000);
    } catch {
      setError('Kunde inte spara transaktion.');
    } finally {
      setSaving(false);
    }
  };

  const persistProfile = async () => {
    if (!user) return;
    try {
      await setEconomyProfile(user.uid, {
        weeklyBudgetSek: weeklyBudget,
        mealBoxPresetSek: mealPreset,
      });
    } catch {
      setError('Kunde inte spara profil.');
    }
  };

  return {
    user,
    transactions,
    weeklyBudget,
    setWeeklyBudget,
    mealPreset,
    setMealPreset,
    loading,
    saving,
    savedFlash,
    error,
    balance,
    spentThisWeek,
    leftThisWeek,
    progressPercent,
    reload,
    quickAdd,
    persistProfile,
  };
}
