import { useCallback, useEffect, useState } from 'react';
import { Loader2, Trash2, Wallet } from 'lucide-react';
import { Button } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import { EmptyState } from '@/core/ui/EmptyState';
import { useStore } from '@/core/store';
import {
  deleteBudgetEnvelope,
  getBudgetEnvelopes,
  setBudgetEnvelope,
} from '@/core/firebase/economyFirestore';
import type { BudgetEnvelopeRow } from '@/core/types/firestore';
import { envelopeRemaining } from '../rules/budgetTemplates';

export function EconomyEnvelopeSection({ disabled = false }: { disabled?: boolean } = {}) {
  const user = useStore((s) => s.user);
  const [envelopes, setEnvelopes] = useState<BudgetEnvelopeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [allocatedSek, setAllocatedSek] = useState(500);

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      setEnvelopes(await getBudgetEnvelopes(user.uid));
    } catch {
      setError('Kunde inte läsa kuvert.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void reload();
    return () => setEnvelopes([]);
  }, [reload]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !title.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await setBudgetEnvelope(user.uid, {
        title: title.trim(),
        allocatedSek: Math.max(0, allocatedSek),
        spentSek: 0,
      });
      setTitle('');
      setAllocatedSek(500);
      await reload();
    } catch {
      setError('Kunde inte skapa kuvert.');
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateSpent = async (env: BudgetEnvelopeRow, spentSek: number) => {
    if (!user) return;
    setBusy(true);
    try {
      await setBudgetEnvelope(user.uid, {
        id: env.id,
        title: env.title,
        allocatedSek: env.allocatedSek,
        spentSek: Math.max(0, spentSek),
      });
      await reload();
    } catch {
      setError('Kunde inte uppdatera kuvert.');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    setBusy(true);
    try {
      await deleteBudgetEnvelope(user.uid, id);
      await reload();
    } catch {
      setError('Kunde inte ta bort kuvert.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <BentoCard
      title="Kuvert"
      icon={<Wallet className="h-4 w-4" />}
      description="Manuella kategoribudgetar — inga bankkopplingar"
    >
      {error ? <p id="ekonomi-envelope-error" className="mb-2 text-sm text-danger" role="alert">{error}</p> : null}

      {loading ? (
        <p className="flex items-center gap-2 text-sm text-text-muted">
          <Loader2 className="h-4 w-4 animate-spin" /> Laddar…
        </p>
      ) : envelopes.length === 0 ? (
        <EmptyState message="Inga kuvert ännu. Skapa ett nedan." />
      ) : (
        <ul className="space-y-3">
          {envelopes.map((env) => {
            const left = envelopeRemaining(env);
            return (
              <li
                key={env.id}
                className="rounded-2xl border border-border-strong bg-surface/30 px-3 py-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-text">{env.title}</p>
                    <p className="text-sm text-text-muted">
                      Kvar {left} kr av {env.allocatedSek} kr
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={busy || disabled}
                    onClick={() => void handleDelete(env.id)}
                    className="min-h-11 text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                    aria-label={`Ta bort ${env.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <label htmlFor={`ekonomi-envelope-spent-${env.id}`} className="mt-2 block text-xs text-text-muted">
                  Förbrukat (kr)
                  <input
                    id={`ekonomi-envelope-spent-${env.id}`}
                    type="number"
                    defaultValue={env.spentSek}
                    disabled={busy || disabled}
                    onBlur={(e) =>
                      void handleUpdateSpent(env, Number(e.target.value) || 0)
                    }
                    className="input-glass mt-1 min-h-11 w-full text-sm"
                    min={0}
                    aria-invalid={Boolean(error)}
                  />
                </label>
              </li>
            );
          })}
        </ul>
      )}

      <form onSubmit={(e) => void handleCreate(e)} className="mt-4 space-y-3 border-t border-border pt-4">
        <p className="text-xs uppercase tracking-wider text-text-muted">Nytt kuvert</p>
        <label htmlFor="ekonomi-envelope-title" className="block text-xs text-text-muted">
          Namn
          <input
            id="ekonomi-envelope-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={busy || disabled}
            className="input-glass mt-1 min-h-11 w-full text-sm"
            placeholder="t.ex. Mat"
            required
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'ekonomi-envelope-error' : undefined}
          />
        </label>
        <label htmlFor="ekonomi-envelope-budget" className="block text-xs text-text-muted">
          Budget (kr)
          <input
            id="ekonomi-envelope-budget"
            type="number"
            value={allocatedSek}
            onChange={(e) => setAllocatedSek(Number(e.target.value) || 0)}
            disabled={busy || disabled}
            className="input-glass mt-1 min-h-11 w-full text-sm"
            min={0}
            aria-invalid={Boolean(error)}
          />
        </label>
        <Button type="submit" variant="secondary" disabled={busy || disabled || !user} className="min-h-11 w-full text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
          {busy ? 'Sparar…' : 'Skapa kuvert'}
        </Button>
      </form>
    </BentoCard>
  );
}
