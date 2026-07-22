import { useCallback, useEffect, useState } from 'react';
import { Check, PiggyBank, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/design-system';
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
  /** Lås inputs när kapaciteten är låg */
  disabled?: boolean;
};

export function EconomySavingsPanel({
  panelTitle = 'Sparmål',
  description = 'En siffra i taget — inga grafer eller streaks',
  tagFilter,
  compact = false,
  disabled = false,
}: Props) {
  const user = useStore((s) => s.user);
  const [goals, setGoals] = useState<BudgetSavingsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [goalTitle, setGoalTitle] = useState('');
  const [targetSek, setTargetSek] = useState(1000);
  const [currentSek, setCurrentSek] = useState(0);
  const [savedGoalId, setSavedGoalId] = useState<string | null>(null);

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
      setSavedGoalId(goal.id);
      window.setTimeout(() => setSavedGoalId(null), 2800);
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
      {error ? <p id="ekonomi-savings-error" className="mb-2 text-sm text-danger" role="alert">{error}</p> : null}

      {loading ? (
        <p className="flex items-center gap-2 text-sm text-text-muted">
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
              <li key={goal.id}>
                <BentoCard title={goal.title} glow="gold">
                  <p className="text-sm text-text-muted">
                    {goal.currentSek} / {goal.targetSek} kr
                  </p>
                  <div
                    className="mt-3 h-1 overflow-hidden rounded-full bg-surface-3"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${goal.title}: ${pct} procent`}
                  >
                    <div
                      className="h-1 rounded-full bg-accent/50 transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <label htmlFor={`ekonomi-goal-current-${goal.id}`} className="block flex-1 text-xs text-text-muted">
                      Uppdatera sparat belopp (kr)
                      <input
                        id={`ekonomi-goal-current-${goal.id}`}
                        type="number"
                        defaultValue={goal.currentSek}
                        disabled={busy || disabled}
                        onBlur={(e) =>
                          void handleUpdateCurrent(goal, Number(e.target.value) || 0)
                        }
                        className="input-glass mt-1 min-h-11 w-full text-sm"
                        aria-invalid={Boolean(error)}
                      />
                    </label>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={busy || disabled}
                      onClick={() => void handleDelete(goal.id)}
                      className="text-text-muted"
                      aria-label={`Ta bort ${goal.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {savedGoalId === goal.id ? (
                    <p className="mt-2 flex items-center gap-2 text-xs text-success" role="status">
                      <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      Sparat. Ett lugnt steg framåt.
                    </p>
                  ) : null}
                </BentoCard>
              </li>
            );
          })}
        </ul>
      )}

      {(!compact || goals.length === 0) && (
      <form onSubmit={(e) => void handleCreate(e)} className="mt-4 space-y-3 border-t border-border pt-4">
        <p className="text-xs uppercase tracking-wider text-text-muted">Nytt sparmål</p>
        <label htmlFor="ekonomi-goal-title" className="block text-xs text-text-muted">
          Namn
          <input
            id="ekonomi-goal-title"
            type="text"
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
            disabled={busy || disabled}
            className="input-glass mt-1 min-h-11 w-full text-sm"
            placeholder="t.ex. Buffert"
            required
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'ekonomi-savings-error' : undefined}
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label htmlFor="ekonomi-goal-target" className="block text-xs text-text-muted">
            Mål (kr)
            <input
              id="ekonomi-goal-target"
              type="number"
              value={targetSek}
              onChange={(e) => setTargetSek(Number(e.target.value) || 0)}
              disabled={busy || disabled}
              className="input-glass mt-1 min-h-11 w-full text-sm"
              min={0}
              aria-invalid={Boolean(error)}
            />
          </label>
          <label htmlFor="ekonomi-goal-saved" className="block text-xs text-text-muted">
            Redan sparat (kr)
            <input
              id="ekonomi-goal-saved"
              type="number"
              value={currentSek}
              onChange={(e) => setCurrentSek(Number(e.target.value) || 0)}
              disabled={busy || disabled}
              className="input-glass mt-1 min-h-11 w-full text-sm"
              min={0}
              aria-invalid={Boolean(error)}
            />
          </label>
        </div>
        <Button type="submit" variant="secondary" disabled={busy || disabled || !user} className="w-full text-sm">
          {busy ? 'Sparar…' : 'Skapa sparmål'}
        </Button>
      </form>
      )}
    </BentoCard>
  );
}
