import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Utensils } from 'lucide-react';
import { clsx } from 'clsx';
import { useStore } from '@/core/store';
import {
  getBudgetSavings,
  getEconomyMealPrep,
  setBudgetSaving,
  setEconomyMealPrep,
} from '@/core/firebase/economyFirestore';
import { saveEconomyTransaction } from '@/core/firebase/firestore';
import type { EconomyMealPrepItem } from '@/core/types/firestore';
import { useEconomyBudget } from '../hooks/useEconomyBudget';

export function EconomyMealPrepPanel() {
  const user = useStore((s) => s.user);
  const { mealPreset, reload: reloadBudget } = useEconomyBudget();
  const [items, setItems] = useState<EconomyMealPrepItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      setItems(await getEconomyMealPrep(user.uid));
    } catch {
      setError('Kunde inte läsa matprepp.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void reload();
    return () => setItems([]);
  }, [reload]);

  const persistItems = async (next: EconomyMealPrepItem[]) => {
    if (!user) return;
    setItems(next);
    setBusy(true);
    try {
      await setEconomyMealPrep(user.uid, next);
    } catch {
      setError('Kunde inte spara checklista.');
    } finally {
      setBusy(false);
    }
  };

  const toggleItem = (id: string) => {
    const next = items.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item,
    );
    void persistItems(next);
  };

  const allDone = items.length > 0 && items.every((item) => item.done);

  const bumpFamilyFund = async (userId: string, bonusSek: number) => {
    const goals = await getBudgetSavings(userId);
    const family = goals.find((g) => g.tag === 'family');
    if (family) {
      await setBudgetSaving(userId, {
        id: family.id,
        title: family.title,
        targetSek: family.targetSek,
        currentSek: family.currentSek + bonusSek,
        tag: 'family',
      });
      return;
    }
    await setBudgetSaving(userId, {
      title: 'Äventyrskassa',
      targetSek: 5000,
      currentSek: bonusSek,
      tag: 'family',
    });
  };

  const handleMealPrepWin = async () => {
    if (!user || !allDone) return;
    setBusy(true);
    setError(null);
    try {
      await saveEconomyTransaction(user.uid, {
        label: 'Matlåda — prepp klar',
        amountSek: -mealPreset,
        category: 'matlada',
      });
      await bumpFamilyFund(user.uid, 100);
      const reset = items.map((item) => ({ ...item, done: false }));
      await setEconomyMealPrep(user.uid, reset);
      setItems(reset);
      setFlash('Matlåda loggad. +100 kr till äventyrskassan.');
      window.setTimeout(() => setFlash(null), 2500);
      await reloadBudget();
    } catch {
      setError('Kunde inte spara matlåda.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-success">Blodsocker- & Energisäkring</h3>
        <p className="mt-1 text-xs leading-relaxed text-text-muted">
          Preppa matlådor för att undvika exekutiva krascher och dyra impulsköp under stressiga
          logistikdagar.
        </p>
      </div>

      {error && (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
      {flash && (
        <p className="text-xs text-success" role="status">
          {flash}
        </p>
      )}

      {loading ? (
        <p className="flex items-center gap-2 text-xs text-text-muted">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Laddar…
        </p>
      ) : (
        <ul className="space-y-2.5">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-3 rounded-lg border border-border/30 bg-surface-2 p-2.5"
            >
              <button
                type="button"
                disabled={busy}
                onClick={() => toggleItem(item.id)}
                className={clsx(
                  'mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-60',
                  item.done
                    ? 'bg-success/20 text-success'
                    : 'border border-border-strong text-transparent hover:border-success/50',
                )}
                aria-label={item.done ? 'Markerad' : 'Ej markerad'}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
              </button>
              <span
                className={clsx(
                  'text-xs leading-relaxed transition-colors',
                  item.done
                    ? 'text-text-muted line-through decoration-text-muted/50'
                    : 'text-text-muted',
                )}
              >
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        disabled={busy || !user || !allDone}
        onClick={() => void handleMealPrepWin()}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-success/30 bg-success/10 py-2.5 text-xs text-success transition-colors hover:bg-success/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-40"
      >
        <Utensils className="h-3.5 w-3.5" />
        Alla steg klara — logga matlåda (−{mealPreset} kr)
      </button>
    </div>
  );
}
