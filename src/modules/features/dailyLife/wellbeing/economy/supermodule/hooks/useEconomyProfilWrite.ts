import { useCallback, useEffect, useRef, useState } from 'react';
import { getEconomyProfile, setEconomyProfile } from '@/core/firebase/firestore';
import { isBrowserOffline } from '@/core/firebase/offlineWritePolicy';
import { resolveEconomySaveError } from './resolveEconomySaveError';

export const DEFAULT_WEEKLY_BUDGET = 500;
export const DEFAULT_MEAL_PRESET = 85;

function resolveSaveError(err: unknown): string {
  return resolveEconomySaveError(err, 'Kunde inte spara profil.');
}

function parseProfileAmount(raw: string, fallback: number): number {
  const value = Number(raw.trim());
  if (!Number.isFinite(value) || value < 0) return fallback;
  return Math.round(value);
}

/**
 * Read/write `economy_profiles` — veckobudget + matlåda-preset.
 * MUST NOT write to `economy_ledger` or `user_economy_status`.
 */
export function useEconomyProfilWrite(userId: string | undefined) {
  const [weeklyBudget, setWeeklyBudget] = useState(String(DEFAULT_WEEKLY_BUDGET));
  const [mealPreset, setMealPreset] = useState(String(DEFAULT_MEAL_PRESET));
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
      const profile = await getEconomyProfile(userId);
      if (profile) {
        setWeeklyBudget(String(profile.weeklyBudgetSek || DEFAULT_WEEKLY_BUDGET));
        setMealPreset(String(profile.mealBoxPresetSek || DEFAULT_MEAL_PRESET));
      }
    } catch {
      setError('Kunde inte läsa profil.');
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
      setWeeklyBudget(String(DEFAULT_WEEKLY_BUDGET));
      setMealPreset(String(DEFAULT_MEAL_PRESET));
      setLoading(false);
      setSaving(false);
      setSavedFlash(false);
      setOfflineQueued(false);
      setError(null);
    },
    [],
  );

  const clearError = useCallback(() => setError(null), []);

  const persistProfile = useCallback(async (): Promise<boolean> => {
    if (!userId) return false;

    setSaving(true);
    setError(null);
    setSavedFlash(false);
    setOfflineQueued(false);

    const queuedOffline = isBrowserOffline();
    const weeklyBudgetSek = parseProfileAmount(weeklyBudget, DEFAULT_WEEKLY_BUDGET);
    const mealBoxPresetSek = parseProfileAmount(mealPreset, DEFAULT_MEAL_PRESET);

    try {
      await setEconomyProfile(userId, { weeklyBudgetSek, mealBoxPresetSek });
      setWeeklyBudget(String(weeklyBudgetSek));
      setMealPreset(String(mealBoxPresetSek));
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
  }, [userId, weeklyBudget, mealPreset]);

  return {
    weeklyBudget,
    setWeeklyBudget,
    mealPreset,
    setMealPreset,
    loading,
    saving,
    savedFlash,
    offlineQueued,
    error,
    clearError,
    persistProfile,
    reload,
  };
}
