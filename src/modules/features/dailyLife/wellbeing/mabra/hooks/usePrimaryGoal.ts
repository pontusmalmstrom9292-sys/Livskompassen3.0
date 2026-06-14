import { useCallback, useEffect, useState } from 'react';
import { useStore } from '@/core/store';
import {
  clearPrimaryGoal,
  confirmPrimaryGoal,
  fetchPrimaryGoal,
  type ConfirmPrimaryGoalInput,
  type PrimaryGoal,
} from '../api/goalFocusService';

export type UsePrimaryGoalState = {
  primaryGoal: PrimaryGoal | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  confirmGoal: (input: ConfirmPrimaryGoalInput) => Promise<PrimaryGoal | null>;
  clearGoal: () => Promise<void>;
  refresh: () => void;
};

export function usePrimaryGoal(): UsePrimaryGoalState {
  const user = useStore((s) => s.user);
  const [primaryGoal, setPrimaryGoal] = useState<PrimaryGoal | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((key) => key + 1);
  }, []);

  useEffect(() => {
    if (!user?.uid) {
      setPrimaryGoal(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchPrimaryGoal(user.uid)
      .then((goal) => {
        if (!cancelled) {
          setPrimaryGoal(goal);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Kunde inte läsa aktivt mål');
          setPrimaryGoal(null);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user?.uid, refreshKey]);

  const confirmGoal = useCallback(
    async (input: ConfirmPrimaryGoalInput): Promise<PrimaryGoal | null> => {
      if (!user?.uid) return null;
      setSaving(true);
      setError(null);
      try {
        const saved = await confirmPrimaryGoal(user.uid, input);
        setPrimaryGoal(saved);
        setSaving(false);
        return saved;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Kunde inte spara målet';
        setError(message);
        setSaving(false);
        throw err;
      }
    },
    [user?.uid],
  );

  const clearGoal = useCallback(async () => {
    if (!user?.uid) return;
    setSaving(true);
    setError(null);
    try {
      await clearPrimaryGoal(user.uid);
      setPrimaryGoal(null);
      setSaving(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Kunde inte ta bort målet');
      setSaving(false);
      throw err;
    }
  }, [user?.uid]);

  return {
    primaryGoal,
    loading,
    saving,
    error,
    confirmGoal,
    clearGoal,
    refresh,
  };
}
