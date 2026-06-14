import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Clock, Loader2, AlertTriangle } from 'lucide-react';
import { useStore } from '@/core/store';
import {
  useCapacityScore,
  useIsEconomyAdvancedUnlocked,
} from '@/core/store/useCapacityGate';
import { useEvolutionStore } from '@/core/store/useEvolutionStore';
import { EconomyGateway } from '@/features/economy/economy_gateway';
import type { EconomyImpulseRow } from '@/core/types/firestore';
import { EKONOMI_IMPULS_LEAD } from '../ekonomiCopy';

const STABILITY_THRESHOLD = 50;
const READY_TICK_MS = 60_000;

function buildRemindAt(parkedAt: Date): string {
  const remind = new Date(parkedAt);
  remind.setDate(remind.getDate() + 1);
  return remind.toISOString();
}

function isImpulseReady(remindAt: string, nowMs: number): boolean {
  return Date.parse(remindAt) <= nowMs;
}

export function EconomyImpulsePanel() {
  const user = useStore((s) => s.user);
  const capacityScore = useCapacityScore();
  const isEconomyAdvancedUnlocked = useIsEconomyAdvancedUnlocked();
  const hasAdvanced = useEvolutionStore((s) => s.hasFeature('economy_advanced'));
  const isGatewayUnlocked = isEconomyAdvancedUnlocked || hasAdvanced;
  const isLowCapacity = capacityScore < STABILITY_THRESHOLD;

  const gateway = useMemo(() => {
    if (!user?.uid) return null;
    return new EconomyGateway(user.uid, isGatewayUnlocked);
  }, [user?.uid, isGatewayUnlocked]);

  const [items, setItems] = useState<EconomyImpulseRow[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const reload = useCallback(async () => {
    if (!gateway) return;
    setLoading(true);
    setError(null);
    try {
      const rows = await gateway.getImpulseQueue();
      if (isMountedRef.current) {
        setItems(rows);
      }
    } catch {
      if (isMountedRef.current) {
        setError('Kunde inte läsa impulsparkering.');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [gateway]);

  useEffect(() => {
    if (!gateway) {
      setItems([]);
      setLoading(false);
      return;
    }

    void reload();
  }, [gateway, reload]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
    }, READY_TICK_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const readyItems = useMemo(
    () => items.filter((item) => isImpulseReady(item.remindAt, nowMs)),
    [items, nowMs],
  );

  const handlePark = async () => {
    if (!gateway || !draft.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const parkedAt = new Date();
      await gateway.addToImpulseQueue({
        label: draft.trim(),
        parkedAt: parkedAt.toISOString(),
        remindAt: buildRemindAt(parkedAt),
      });
      setDraft('');
      await reload();
    } catch {
      setError('Kunde inte parkera köpet.');
    } finally {
      setBusy(false);
    }
  };

  const handleResolve = async (id: string, status: 'bought' | 'skipped') => {
    if (!gateway) return;
    setBusy(true);
    setError(null);
    try {
      await gateway.resolveEconomyImpulse(id, status);
      await reload();
    } catch {
      setError('Kunde inte uppdatera parkering.');
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!gateway) return;
    setBusy(true);
    try {
      await gateway.deleteEconomyImpulse(id);
      await reload();
    } catch {
      setError('Kunde inte ta bort parkering.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <h4 className="flex items-center gap-1.5 font-display-serif text-[10px] font-semibold uppercase tracking-[0.2em] text-text">
          <Clock className="h-3.5 w-3.5 text-accent/70" aria-hidden />
          Impulsparkeringen (24h regel)
        </h4>
        <p className="mt-1 text-xs leading-relaxed text-text-muted">{EKONOMI_IMPULS_LEAD}</p>
      </div>

      {error && <p className="mb-2 text-xs text-danger">{error}</p>}

      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="T.ex. Nya hörlurar..."
          className="input-glass flex-1 rounded-lg px-3 py-1.5 text-xs"
          disabled={busy || !gateway}
        />
        <button
          type="button"
          disabled={busy || !gateway || !draft.trim()}
          onClick={() => void handlePark()}
          className="btn-pill--ghost rounded-lg border border-border/50 bg-surface-3 px-3 py-1.5 text-xs"
        >
          Parkera
        </button>
      </div>

      {loading ? (
        <p className="mt-3 flex items-center gap-2 text-xs text-text-dim">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Laddar…
        </p>
      ) : items.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {items.map((item) => {
            const isReady = readyItems.some((r) => r.id === item.id);
            return (
              <li
                key={item.id}
                className={`rounded-lg border px-3 py-2 text-xs ${
                  isReady ? 'border-accent/30 bg-accent/5' : 'border-border/30 bg-surface-3/40'
                }`}
              >
                <p className="font-medium text-text">{item.label}</p>
                <p className={`text-[10px] ${isReady ? 'text-accent/80' : 'text-text-dim'}`}>
                  Parkerad {item.parkedAt.slice(0, 10)}
                  {isReady ? ' · Dags att besluta' : ' · Vänta till imorgon'}
                </p>
                {isReady && (
                  <div className="mt-2 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={busy || isLowCapacity}
                        onClick={() => void handleResolve(item.id, 'bought')}
                        className="btn-pill--secondary px-2 py-1 text-[10px] disabled:opacity-50"
                      >
                        Fortfarande ja
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void handleResolve(item.id, 'skipped')}
                        className="btn-pill--ghost px-2 py-1 text-[10px]"
                      >
                        Strunt i det
                      </button>
                    </div>
                    {isLowCapacity && (
                      <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-danger/90">
                        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                        <span>
                          Kapaciteten är för låg för att godkänna köp just nu. Låt beslutet vila
                          lite till.
                        </span>
                      </p>
                    )}
                  </div>
                )}
                {!isReady && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void handleRemove(item.id)}
                    className="mt-2 text-[10px] text-text-dim hover:text-text"
                  >
                    Ta bort
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-xs text-text-dim">Inget parkerat — skriv ovan när impulsen kommer.</p>
      )}
    </div>
  );
}
