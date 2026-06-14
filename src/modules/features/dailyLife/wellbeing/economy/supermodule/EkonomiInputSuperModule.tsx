import { useCallback, useEffect, useMemo, useState } from 'react';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';
import { db } from '@/core/firebase/firestore';
import { useEvolutionStore } from '@/core/store/useEvolutionStore';
import {
  useCapacityGate,
  useIsCapacityLoading,
  useListenToCapacityState,
} from '@/core/store/useCapacityGate';
import { FIRESTORE_COLLECTIONS, type CheckIn, type UserEconomyStatus } from '@/core/types/firestore';
import { EconomyCapacityLockedNotice } from '@/features/economy/components/EconomyCapacityLockedNotice';
import {
  pickFallbackMode,
  resolveEconomyCapacity,
} from './capacityResolver';
import { EkonomiMatprepDelegate } from './delegates/EkonomiMatprepDelegate';
import { EkonomiProfilDelegate } from './delegates/EkonomiProfilDelegate';
import { EkonomiSaldoDelegate } from './delegates/EkonomiSaldoDelegate';
import {
  DEFAULT_EKONOMI_INPUT_MODE,
  filterModesByAllowed,
  getEkonomiInputModeMeta,
  parseEkonomiInputMode,
  type EkonomiInputMode,
} from './ekonomiInputModes';

export type EkonomiInputSuperModuleProps = {
  userId: string;
};

function EkonomiModePlaceholder({ mode }: { mode: EkonomiInputMode }) {
  const meta = getEkonomiInputModeMeta(mode);
  return (
    <div className="rounded-xl border border-border/50 bg-surface-3/30 p-6 text-center">
      <p className="font-display-serif text-sm uppercase tracking-[0.2em] text-accent">{meta.label}</p>
      <p className="mt-2 text-xs text-text-muted">{meta.description}</p>
      <p className="mt-4 text-[10px] uppercase tracking-wider text-text-dim">
        Delegate kommer i Fas 8B–8D
      </p>
    </div>
  );
}

function EkonomiInputModeDelegate({
  mode,
  userId,
}: {
  mode: EkonomiInputMode;
  userId: string;
}) {
  switch (mode) {
    case 'saldo':
      return <EkonomiSaldoDelegate userId={userId} />;
    case 'profil':
      return <EkonomiProfilDelegate userId={userId} />;
    case 'matprep':
      return <EkonomiMatprepDelegate userId={userId} />;
    default:
      return <EkonomiModePlaceholder mode={mode} />;
  }
}

/**
 * Canonical router for Ekonomi Universal Input Hub (Fas 8A→8E).
 * Thin delegate — no direct Firestore writes in this file.
 */
export function EkonomiInputSuperModule({ userId }: EkonomiInputSuperModuleProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMoreModes, setShowMoreModes] = useState(false);
  const [economyAdvancedFromStatus, setEconomyAdvancedFromStatus] = useState(false);
  const [checkins48h, setCheckins48h] = useState({ count: 0, averageMoodEnergy: 0 });

  const listenToCapacityState = useListenToCapacityState();
  const isCapacityLoading = useIsCapacityLoading();
  const capabilityState = useCapacityGate((s) => ({
    economy_advanced: s.isEconomyAdvancedUnlocked,
    capacityScore: s.capacityScore,
  }));
  const evolutionFlags = useEvolutionStore((s) => s.doc?.unlockedFeatureFlags ?? []);
  const listenToEvolutionHub = useEvolutionStore((s) => s.listenToEvolutionHub);

  useEffect(() => {
    if (!userId) return;
    return listenToCapacityState(userId);
  }, [userId, listenToCapacityState]);

  useEffect(() => {
    if (!userId) return;
    return listenToEvolutionHub(userId);
  }, [userId, listenToEvolutionHub]);

  useEffect(() => {
    if (!userId) {
      setEconomyAdvancedFromStatus(false);
      return;
    }

    const economyRef = doc(db, FIRESTORE_COLLECTIONS.user_economy_status, userId);
    return onSnapshot(economyRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as UserEconomyStatus;
        setEconomyAdvancedFromStatus(data.economy_advanced === true);
      } else {
        setEconomyAdvancedFromStatus(false);
      }
    });
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setCheckins48h({ count: 0, averageMoodEnergy: 0 });
      return;
    }

    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

    const checkinsQuery = query(
      collection(db, FIRESTORE_COLLECTIONS.checkins),
      where('userId', '==', userId),
      where('questionId', '==', 'mabra_checkin'),
      where('createdAt', '>=', fortyEightHoursAgo.toISOString()),
    );

    return onSnapshot(checkinsQuery, (snapshot) => {
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

      setCheckins48h({
        count,
        averageMoodEnergy: count > 0 ? totalScore / count : 0,
      });
    });
  }, [userId]);

  const capacityContext = useMemo(
    () =>
      resolveEconomyCapacity({
        capabilityState: {
          economy_advanced: capabilityState.economy_advanced,
          capacityScore: capabilityState.capacityScore,
        },
        economyStatus: { economy_advanced: economyAdvancedFromStatus },
        evolutionFlags,
        checkins48h,
        isLoading: isCapacityLoading,
      }),
    [
      capabilityState.economy_advanced,
      capabilityState.capacityScore,
      economyAdvancedFromStatus,
      evolutionFlags,
      checkins48h,
      isCapacityLoading,
    ],
  );

  const { primary: visiblePrimary, more: visibleMore } = useMemo(
    () => filterModesByAllowed(capacityContext.allowedModes),
    [capacityContext.allowedModes],
  );

  const rawMode = searchParams.get('inputMode');
  const parsedMode = parseEkonomiInputMode(rawMode);
  const activeMode = capacityContext.allowedModes.includes(parsedMode)
    ? parsedMode
    : pickFallbackMode(capacityContext.allowedModes);

  const setActiveMode = useCallback(
    (mode: EkonomiInputMode) => {
      const next = new URLSearchParams(searchParams);
      if (mode === DEFAULT_EKONOMI_INPUT_MODE) {
        next.delete('inputMode');
      } else {
        next.set('inputMode', mode);
      }
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    if (capacityContext.isLoading) return;
    if (!capacityContext.allowedModes.includes(parsedMode)) {
      setActiveMode(activeMode);
    }
  }, [
    capacityContext.isLoading,
    capacityContext.allowedModes,
    parsedMode,
    activeMode,
    setActiveMode,
  ]);

  const isMoreModeActive = visibleMore.some((mode) => mode.id === activeMode);

  return (
    <section
      className="calm-card glow-bottom-gold overflow-hidden rounded-2xl border border-border/30 bg-surface-2/70 p-4 sm:p-5"
      aria-label="Ekonomi inmatningshub"
    >
      <header className="mb-4 space-y-1">
        <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
          Universal Input
        </p>
        <h2 className="font-display-serif text-base uppercase tracking-[0.2em] text-text">
          Ett läge i taget
        </h2>
        <p className="text-xs text-text-dim">
          Vardagsekonomi utan sidbyte — kapacitetsstyrd progressive disclosure.
        </p>
        {capacityContext.circuitBreakerActive ? (
          <p className="text-xs text-text-muted">Kognitiv paus — endast saldo just nu.</p>
        ) : null}
      </header>

      {!capacityContext.circuitBreakerActive && capacityContext.level === 1 ? (
        <div className="mb-4">
          <EconomyCapacityLockedNotice compact />
        </div>
      ) : null}

      <nav
        className="mb-5 flex flex-wrap gap-2 rounded-xl border border-border bg-surface-2 p-1"
        aria-label="Inmatningslägen"
      >
        {visiblePrimary.map((mode) => {
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => setActiveMode(mode.id)}
              aria-pressed={isActive}
              className={`rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                isActive
                  ? 'border border-accent/20 bg-accent/10 text-accent'
                  : 'border border-transparent text-text-muted hover:border-border hover:bg-surface-3 hover:text-text'
              }`}
            >
              <span className="block font-medium">{mode.label}</span>
              <span className="block text-[10px] text-text-dim">{mode.description}</span>
            </button>
          );
        })}

        {visibleMore.length > 0 ? (
          <button
            type="button"
            onClick={() => setShowMoreModes((open) => !open)}
            aria-expanded={showMoreModes || isMoreModeActive}
            className={`rounded-lg px-3 py-2 text-left text-xs transition-colors ${
              isMoreModeActive
                ? 'border border-accent/20 bg-accent/10 text-accent'
                : 'border border-transparent text-text-muted hover:border-border hover:bg-surface-3 hover:text-text'
            }`}
          >
            <span className="block font-medium">Mer…</span>
            <span className="block text-[10px] text-text-dim">Kuvert, spar, inkast</span>
          </button>
        ) : null}

        {(showMoreModes || isMoreModeActive) &&
          visibleMore.map((mode) => {
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setActiveMode(mode.id)}
                aria-pressed={isActive}
                className={`rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                  isActive
                    ? 'border border-accent/20 bg-accent/10 text-accent'
                    : 'border border-transparent text-text-muted hover:border-border hover:bg-surface-3 hover:text-text'
                }`}
              >
                <span className="block font-medium">{mode.label}</span>
                <span className="block text-[10px] text-text-dim">{mode.description}</span>
              </button>
            );
          })}
      </nav>

      <div className="calm-scroll-island max-h-[min(70vh,640px)] overflow-y-auto pr-1">
        <EkonomiInputModeDelegate mode={activeMode} userId={userId} />
      </div>
    </section>
  );
}
