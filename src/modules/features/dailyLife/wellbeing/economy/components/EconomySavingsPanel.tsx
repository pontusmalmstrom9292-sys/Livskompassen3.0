import { useCallback, useEffect, useState } from 'react';
import { PiggyBank, Loader2, Trash2 } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { EmptyState } from '@/core/ui/EmptyState';
import { useStore } from '@/core/store';
import {
  deleteBudgetSaving,
  getBudgetSavings,
  setBudgetSaving,
} from '@/core/firebase/economyFirestore';
import type { BudgetSavingsRow } from '@/core/types/firestore';

type Props = {
  panelTitle?: string;
  description?: string;
  tagFilter?: 'family' | 'general';
  /** Hide create form when showing filtered family fund only */
  compact?: boolean;
};

export function EconomySavingsPanel({
  panelTitle = 'Sparmål',
  description = 'En siffra i taget — inga grafer eller streaks',
  tagFilter,
  compact = false,
}: Props) {
  const user = useStore((s) => s.user);
  const [goals, setGoals] = useState<BudgetSavingsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [goalTitle, setGoalTitle] = useState('');
  const [targetSek, setTargetSek] = useState(1000);
  const [currentSek, setCurrentSek] = useState(0);

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const rows = await getBudgetSavings(user.uid);
      setGoals(
        tagFilter
          ? rows.filter((g) => (g.tag ?? 'general') === tagFilter)
          : rows.filter((g) => (g.tag ?? 'general') !== 'family'),
      );
    } catch {
      setError('Kunde inte läsa sparmål.');
    } finally {
      setLoading(false);
    }
  }, [user, tagFilter]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !goalTitle.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await setBudgetSaving(user.uid, {
        title: goalTitle.trim(),
        targetSek: Math.max(0, targetSek),
        currentSek: Math.max(0, currentSek),
        ...(tagFilter ? { tag: tagFilter } : {}),
      });
      setGoalTitle('');
      setTargetSek(1000);
      setCurrentSek(0);
      await reload();
    } catch {
      setError('Kunde inte spara sparmål.');
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateCurrent = async (goal: BudgetSavingsRow, nextCurrent: number) => {
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      await setBudgetSaving(user.uid, {
        id: goal.id,
        title: goal.title,
        targetSek: goal.targetSek,
        currentSek: Math.max(0, nextCurrent),
      });
      await reload();
    } catch {
      setError('Kunde inte uppdatera sparmål.');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (goalId: string) => {
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      await deleteBudgetSaving(user.uid, goalId);
      await reload();
    } catch {
      setError('Kunde inte ta bort sparmål.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <BentoCard
      title={panelTitle}
      icon={<PiggyBank className="h-4 w-4" />}
      description={description}
    >
      {error && <p className="mb-2 text-sm text-danger">{error}</p>}

      {loading ? (
        <p className="flex items-center gap-2 text-sm text-text-dim">
          <Loader2 className="h-4 w-4 animate-spin" /> Laddar…
        </p>
      ) : goals.length === 0 ? (
        <EmptyState message="Inga sparmål ännu. Skapa ett nedan." />
      ) : (
        <ul className="space-y-3">
          {goals.map((goal) => {
            const pct =
              goal.targetSek > 0
                ? Math.min(100, Math.round((goal.currentSek / goal.targetSek) * 100))
                : 0;
            return (
              <li
                key={goal.id}
                className="rounded-2xl border border-border-strong bg-surface/30 px-3 py-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-text">{goal.title}</p>
                    <p className="text-sm text-text-dim">
                      {goal.currentSek} / {goal.targetSek} kr ({pct}%)
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void handleDelete(goal.id)}
                    className="btn-pill--ghost p-2 text-text-dim"
                    aria-label={`Ta bort ${goal.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <label className="mt-2 block text-xs text-text-muted">
                  Uppdatera sparat belopp (kr)
                  <input
                    type="number"
                    defaultValue={goal.currentSek}
                    disabled={busy}
                    onBlur={(e) =>
                      void handleUpdateCurrent(goal, Number(e.target.value) || 0)
                    }
                    className="input-glass mt-1 w-full text-sm"
                  />
                </label>
              </li>
            );
          })}
        </ul>
      )}

      {(!compact || goals.length === 0) && (
      <form onSubmit={(e) => void handleCreate(e)} className="mt-4 space-y-3 border-t border-border pt-4">
        <p className="text-xs uppercase tracking-wider text-text-dim">Nytt sparmål</p>
        <label className="block text-xs text-text-muted">
          Namn
          <input
            type="text"
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
            className="input-glass mt-1 w-full text-sm"
            placeholder="t.ex. Buffert"
            required
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs text-text-muted">
            Mål (kr)
            <input
              type="number"
              value={targetSek}
              onChange={(e) => setTargetSek(Number(e.target.value) || 0)}
              className="input-glass mt-1 w-full text-sm"
              min={0}
            />
          </label>
          <label className="block text-xs text-text-muted">
            Redan sparat (kr)
            <input
              type="number"
              value={currentSek}
              onChange={(e) => setCurrentSek(Number(e.target.value) || 0)}
              className="input-glass mt-1 w-full text-sm"
              min={0}
            />
          </label>
        </div>
        <button type="submit" disabled={busy || !user} className="btn-pill--secondary w-full text-sm">
          {busy ? 'Sparar…' : 'Skapa sparmål'}
        </button>
      </form>
      )}
    </BentoCard>
  );
}
