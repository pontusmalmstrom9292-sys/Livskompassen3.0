import { useCallback, useEffect, useState } from 'react';
import { Clock, Loader2 } from 'lucide-react';
import { useStore } from '@/core/store';
import {
  deleteEconomyImpulse,
  getEconomyImpulseQueue,
  parkEconomyImpulse,
  resolveEconomyImpulse,
} from '@/core/firebase/timeEconomyFirestore';
import { EKONOMI_IMPULS_LEAD } from '../ekonomiCopy';

export function EconomyImpulsePanel() {
  const user = useStore((s) => s.user);
  const [items, setItems] = useState<
    { id: string; label: string; parkedAt: string; remindAt: string }[]
  >([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const rows = await getEconomyImpulseQueue(user.uid);
      setItems(
        rows.map((r) => ({
          id: r.id,
          label: r.label,
          parkedAt: r.parkedAt,
          remindAt: r.remindAt,
        })),
      );
    } catch {
      setError('Kunde inte läsa impulsparkering.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void reload();
    return () => setItems([]);
  }, [reload]);

  const handlePark = async () => {
    if (!user || !draft.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await parkEconomyImpulse(user.uid, draft.trim());
      setDraft('');
      await reload();
    } catch {
      setError('Kunde inte parkera köpet.');
    } finally {
      setBusy(false);
    }
  };

  const handleResolve = async (id: string, status: 'bought' | 'skipped') => {
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      await resolveEconomyImpulse(user.uid, id, status);
      await reload();
    } catch {
      setError('Kunde inte uppdatera parkering.');
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!user) return;
    setBusy(true);
    try {
      await deleteEconomyImpulse(user.uid, id);
      await reload();
    } catch {
      setError('Kunde inte ta bort parkering.');
    } finally {
      setBusy(false);
    }
  };

  const readyItems = items.filter((item) => Date.parse(item.remindAt) <= Date.now());

  return (
    <div className="rounded-xl border border-border bg-surface-2 p-4">
      <h4 className="flex items-center gap-1.5 text-xs font-semibold text-text">
        <Clock className="h-3.5 w-3.5 text-text-dim" />
        Impulsparkeringen (24h regel)
      </h4>
      <p className="mb-3 mt-1 text-[10px] leading-relaxed text-text-muted">{EKONOMI_IMPULS_LEAD}</p>

      {error && <p className="mb-2 text-xs text-danger">{error}</p>}

      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="T.ex. Nya hörlurar..."
          className="input-glass flex-1 rounded-lg px-3 py-1.5 text-xs"
          disabled={busy || !user}
        />
        <button
          type="button"
          disabled={busy || !user || !draft.trim()}
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
                className="rounded-lg border border-border/30 bg-surface-3/40 px-3 py-2 text-xs"
              >
                <p className="font-medium text-text">{item.label}</p>
                <p className="text-[10px] text-text-dim">
                  Parkerad {item.parkedAt.slice(0, 10)}
                  {isReady ? ' · Dags att besluta' : ' · Vänta till imorgon'}
                </p>
                {isReady && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleResolve(item.id, 'bought')}
                      className="btn-pill--secondary px-2 py-1 text-[10px]"
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
      ) : null}
    </div>
  );
}
