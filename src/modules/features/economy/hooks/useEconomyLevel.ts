import { useEffect, useMemo, useState } from 'react';
import { collection, doc, onSnapshot, query, where, type QuerySnapshot } from 'firebase/firestore';
import { SAFETY_THRESHOLD } from '@/core/config/constants';
import { db } from '@/core/firebase/firestore';
import {
  useCapacityGate,
  useIsCapacityLoading,
  useListenToCapacityState,
} from '@/core/store/useCapacityGate';
import { useEvolutionStore } from '@/core/store/useEvolutionStore';
import { FIRESTORE_COLLECTIONS, type CheckIn, type UserEconomyStatus } from '@/core/types/firestore';
import type { EconomyCapacityLevel } from '@/features/dailyLife/wellbeing/economy/supermodule/capacityResolver';

export type EconomyLevelState = {
  level: EconomyCapacityLevel;
  isEconomyAdvancedUnlocked: boolean;
  circuitBreakerActive: boolean;
  isLoading: boolean;
};

type Checkins48h = {
  count: number;
  averageMoodEnergy: number;
};

function normalizeCapacityScore(raw: number | undefined): number {
  if (typeof raw !== 'number' || Number.isNaN(raw)) return 0;
  return Math.min(1, Math.max(0, raw));
}

function parseCheckins48h(snapshot: QuerySnapshot): Checkins48h {
  let totalScore = 0;
  let count = 0;

  snapshot.forEach((docSnap) => {
    const data = docSnap.data() as CheckIn;
    let docScore = 0;
    let validFields = 0;

    if (typeof data.mood === 'number') {
      docScore += data.mood;
      validFields += 1;
    }
    if (typeof data.energy === 'number') {
      docScore += data.energy;
      validFields += 1;
    }

    if (validFields > 0) {
      totalScore += docScore / validFields;
      count += 1;
    }
  });

  return {
    count,
    averageMoodEnergy: count > 0 ? totalScore / count : 0,
  };
}

function resolveCircuitBreaker(checkins48h: Checkins48h): boolean {
  return checkins48h.count > 0 && checkins48h.averageMoodEnergy < SAFETY_THRESHOLD;
}

function resolveTriGateUnlocked(
  circuitBreakerActive: boolean,
  capabilityAdvanced: boolean,
  economyStatusAdvanced: boolean,
  evolutionFlags: readonly string[],
): boolean {
  if (circuitBreakerActive) return false;
  return (
    capabilityAdvanced &&
    economyStatusAdvanced &&
    evolutionFlags.includes('economy_advanced')
  );
}

function resolveLevel(
  circuitBreakerActive: boolean,
  economyAdvancedUnlocked: boolean,
  capacityScore: number,
): EconomyCapacityLevel {
  if (circuitBreakerActive) return 'critical';
  if (!economyAdvancedUnlocked) return 1;
  if (capacityScore >= 0.5) return 3;
  return 2;
}

/**
 * Kanonisk hook — tri-gate (user_capability_state + user_economy_status + evolution_hub)
 * och nivåupplösning med circuit breaker via MåBra-checkins senaste 48h.
 */
export function useEconomyLevel(userId: string | undefined): EconomyLevelState {
  const listenToCapacityState = useListenToCapacityState();
  const isCapacityLoading = useIsCapacityLoading();
  const capabilityAdvanced = useCapacityGate((s) => s.isEconomyAdvancedUnlocked);
  const capacityScore = useCapacityGate((s) => s.capacityScore);
  const evolutionFlags = useEvolutionStore((s) => s.doc?.unlockedFeatureFlags ?? []);
  const evolutionLoading = useEvolutionStore((s) => s.isLoading);

  const [economyStatusAdvanced, setEconomyStatusAdvanced] = useState(false);
  const [economyStatusLoading, setEconomyStatusLoading] = useState(Boolean(userId));
  const [checkins48h, setCheckins48h] = useState<Checkins48h>({ count: 0, averageMoodEnergy: 0 });
  const [checkinsLoading, setCheckinsLoading] = useState(Boolean(userId));

  useEffect(() => {
    if (!userId) return;
    return listenToCapacityState(userId);
  }, [userId, listenToCapacityState]);

  useEffect(() => {
    if (!userId) {
      setEconomyStatusAdvanced(false);
      setEconomyStatusLoading(false);
      return;
    }

    setEconomyStatusLoading(true);
    const economyRef = doc(db, FIRESTORE_COLLECTIONS.user_economy_status, userId);
    return onSnapshot(
      economyRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as UserEconomyStatus;
          setEconomyStatusAdvanced(data.economy_advanced === true);
        } else {
          setEconomyStatusAdvanced(false);
        }
        setEconomyStatusLoading(false);
      },
      () => {
        setEconomyStatusAdvanced(false);
        setEconomyStatusLoading(false);
      },
    );
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setCheckins48h({ count: 0, averageMoodEnergy: 0 });
      setCheckinsLoading(false);
      return;
    }

    setCheckinsLoading(true);
    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

    const checkinsQuery = query(
      collection(db, FIRESTORE_COLLECTIONS.checkins),
      where('userId', '==', userId),
      where('questionId', '==', 'mabra_checkin'),
      where('createdAt', '>=', fortyEightHoursAgo.toISOString()),
    );

    return onSnapshot(
      checkinsQuery,
      (snapshot) => {
        setCheckins48h(parseCheckins48h(snapshot));
        setCheckinsLoading(false);
      },
      () => {
        setCheckins48h({ count: 0, averageMoodEnergy: 0 });
        setCheckinsLoading(false);
      },
    );
  }, [userId]);

  return useMemo(() => {
    const isLoading =
      isCapacityLoading || evolutionLoading || economyStatusLoading || checkinsLoading;

    const circuitBreakerActive = resolveCircuitBreaker(checkins48h);
    const normalizedScore = normalizeCapacityScore(capacityScore);
    const isEconomyAdvancedUnlocked = resolveTriGateUnlocked(
      circuitBreakerActive,
      capabilityAdvanced,
      economyStatusAdvanced,
      evolutionFlags,
    );
    const level = resolveLevel(circuitBreakerActive, isEconomyAdvancedUnlocked, normalizedScore);

    return {
      level,
      isEconomyAdvancedUnlocked,
      circuitBreakerActive,
      isLoading,
    };
  }, [
    isCapacityLoading,
    evolutionLoading,
    economyStatusLoading,
    checkinsLoading,
    checkins48h,
    capabilityAdvanced,
    capacityScore,
    economyStatusAdvanced,
    evolutionFlags,
  ]);
}
