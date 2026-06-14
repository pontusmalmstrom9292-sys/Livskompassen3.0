import { useCallback, useEffect, useState } from 'react';
import { useStore } from '@/core/store';
import { useEconomyLevel } from '@/features/economy/hooks/useEconomyLevel';
import { runGoalDetection } from '../api/goalDetectionService';
import type { GoalDetectionResult } from '../lib/goalDetection';

export type UseGoalDetectionState = {
  result: GoalDetectionResult | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

/**
 * P5-A — read-only hook för deterministisk mål-detektering.
 * Ingen auto-write; goalCandidate[] lever i RAM tills P5-B HITL.
 */
export function useGoalDetection(): UseGoalDetectionState {
  const user = useStore((s) => s.user);
  const { level: economyLevel, isLoading: economyLoading } = useEconomyLevel(user?.uid);
  const [result, setResult] = useState<GoalDetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((key) => key + 1);
  }, []);

  useEffect(() => {
    if (!user?.uid || economyLoading) {
      if (!user?.uid) {
        setResult(null);
        setLoading(false);
        setError(null);
      }
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    runGoalDetection({ ownerId: user.uid, economyLevel })
      .then((detection) => {
        if (!cancelled) {
          setResult(detection);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Detektering misslyckades');
          setResult(null);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user?.uid, economyLevel, economyLoading, refreshKey]);

  return { result, loading, error, refresh };
}
