import { AlertTriangle, Check, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Button } from '@/design-system';
import { EmptyState } from '@/core/ui/EmptyState';
import { MetricTile } from '@/core/ui/MetricTile';
import { SaldoHero } from '@/core/ui/SaldoHero';
import { TimelineEntry } from '@/core/ui/TimelineEntry';
import { useEconomySaldoRead } from '../hooks/useEconomySaldoRead';
import { useEconomyTransactionWORM } from '../hooks/useEconomyTransactionWORM';

export type EkonomiSaldoDelegateProps = {
  userId: string;
};

function parseAmountSek(raw: string): number | null {
  const normalized = raw.trim().replace(',', '.');
  if (!normalized) return null;
  const value = Number(normalized);
  if (!Number.isFinite(value)) return null;
  return Math.round(value);
}

/**
 * Fas 8C — Snabbsaldo delegate.
 * Reads via useEconomySaldoRead; WORM writes via useEconomyTransactionWORM → `transactions` only.
 */
export function EkonomiSaldoDelegate({ userId }: EkonomiSaldoDelegateProps) {
  const hasUser = Boolean(userId);

  const {
    loading,
    error: readError,
    balance,
    spentThisWeek,
    leftThisWeek,
    progressPercent,
    weeklyBudget,
    mealPreset,
    transactions,
    reload,
  } = useEconomySaldoRead(hasUser ? userId : undefined);

  const {
    saveTransaction,
    saving,
    savedFlash,
    offlineQueued,
    error: saveError,
    clearError,
  } = useEconomyTransactionWORM(hasUser ? userId : undefined, reload);

  const [customAmount, setCustomAmount] = useState('');
  const [customLabel, setCustomLabel] = useState('');

  useEffect(
    () => () => {
      setCustomAmount('');
      setCustomLabel('');
    },
    [],
  );

  const inputsDisabled = saving || !hasUser;

  const saldoLabel =
    loading || !hasUser
      ? '— kr'
      : balance >= 0
        ? `${balance} kr kvar`
        : `${Math.abs(balance)} kr under noll`;

  const handleQuickAdd = useCallback(
    async (label: string, amountSek: number, category: 'veckopeng' | 'matlada') => {
      clearError();
      await saveTransaction({ label, amountSek, category });
    },
    [clearError, saveTransaction],
  );

  const handleCustomSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (inputsDisabled) return;

      const amountSek = parseAmountSek(customAmount);
      if (amountSek === null || amountSek === 0) {
        clearError();
        return;
      }

      const label = customLabel.trim() || (amountSek > 0 ? 'Inkomst' : 'Utgift');
      clearError();
      const ok = await saveTransaction({ label, amountSek, category: 'ovrigt' });
      if (ok) {
        setCustomAmount('');
        setCustomLabel('');
      }
    },
    [clearError, customAmount, customLabel, inputsDisabled, saveTransaction],
  );

  const displayError = saveError ?? readError;

  return (
    <div className="space-y-5">
      <SaldoHero
        label="Snabbsaldo"
        amount={saldoLabel}
        hint={
          hasUser
            ? `Veckobudget ${weeklyBudget} kr · matlåda ${mealPreset} kr`
            : 'Logga in för att se saldo'
        }
      />

      <div className="space-y-2">
        <div className="flex justify-between gap-3 text-xs tabular-nums text-text-dim">
          <span>
            Förbrukat denna vecka:{' '}
            <strong className="text-text">{loading ? '—' : `${spentThisWeek} kr`}</strong>
          </span>
          <span>
            Kvar att leva på:{' '}
            <strong className="text-accent">{loading ? '—' : `${leftThisWeek} kr`}</strong>
          </span>
        </div>
        <div
          className="h-3 w-full overflow-hidden rounded-full border border-border/50 bg-surface-3"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={loading ? 0 : progressPercent}
          aria-label="Andel av veckobudget förbrukad"
        >
          <div
            className="h-full rounded-full bg-accent/80 shadow-accent-glow transition-all duration-700 motion-reduce:transition-none"
            style={{ width: loading ? '0%' : `${progressPercent}%` }}
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-[10px] uppercase tracking-wider text-text-dim">Snabbtillägg</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={inputsDisabled}
            onClick={() => void handleQuickAdd('Veckopeng', weeklyBudget, 'veckopeng')}
            className="min-h-11 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-60"
          >
            <MetricTile label="Veckopeng" value={`+${weeklyBudget} kr`} hint="Lägg till" />
          </button>
          <button
            type="button"
            disabled={inputsDisabled}
            onClick={() => void handleQuickAdd('Matlåda', -mealPreset, 'matlada')}
            className="min-h-11 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-60"
          >
            <MetricTile label="Matlåda" value={`−${mealPreset} kr`} hint="Lägg till" />
          </button>
        </div>
      </div>

      <form onSubmit={(event) => void handleCustomSubmit(event)} className="space-y-3.5">
        <p className="text-[10px] uppercase tracking-wider text-text-dim">Eget belopp</p>
        <div className="flex flex-wrap gap-3">
          <label className="flex min-w-[7rem] flex-1 flex-col gap-1.5">
            <span className="text-[10px] text-text-dim">Belopp (kr)</span>
            <input
              type="text"
              inputMode="decimal"
              value={customAmount}
              disabled={inputsDisabled}
              placeholder="−120 eller 500"
              onChange={(event) => {
                setCustomAmount(event.target.value);
                clearError();
              }}
              className="input-glass min-h-11 w-full tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-60"
              aria-label="Belopp i kronor"
              aria-invalid={Boolean(displayError)}
              aria-describedby={displayError ? 'ekonomi-saldo-error' : undefined}
            />
          </label>
          <label className="flex min-w-[10rem] flex-[2] flex-col gap-1.5">
            <span className="text-[10px] text-text-dim">Etikett (valfritt)</span>
            <input
              type="text"
              value={customLabel}
              disabled={inputsDisabled}
              placeholder="T.ex. busskort"
              onChange={(event) => {
                setCustomLabel(event.target.value);
                clearError();
              }}
              className="input-glass min-h-11 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-60"
              aria-label="Etikett för transaktionen"
              aria-invalid={Boolean(displayError)}
            />
          </label>
        </div>
        <Button
          type="submit"
          disabled={inputsDisabled || !customAmount.trim()}
          className="min-h-11 w-full text-sm focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-60"
        >
          {saving ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Sparar…
            </span>
          ) : (
            'Spara belopp'
          )}
        </Button>
      </form>

      {offlineQueued ? (
        <p className="text-xs text-text-muted" role="status">
          Sparas när nätet är tillbaka.
        </p>
      ) : null}

      {displayError ? (
        <p
          id="ekonomi-saldo-error"
          className="flex items-start gap-2 rounded-xl border border-danger/25 bg-danger/5 px-3 py-2.5 text-sm leading-relaxed text-danger"
          role="alert"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>{displayError}</span>
        </p>
      ) : null}

      {savedFlash && !saving ? (
        <p className="flex items-center gap-2 text-sm text-success" role="status">
          <Check className="h-4 w-4 shrink-0" aria-hidden />
          Sparat.
        </p>
      ) : null}

      <div className="border-t border-border/30 pt-4">
        <p className="mb-3 text-[10px] uppercase tracking-wider text-text-dim">
          Senaste transaktioner
        </p>
        {transactions.length === 0 ? (
          <EmptyState
            title="Inga poster"
            message="Inga transaktioner ännu. Använd snabbtillägg eller eget belopp ovan."
          />
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((t) => (
              <TimelineEntry
                key={t.id}
                meta={`${t.createdAt.slice(0, 10)} · ${t.category}`}
                body={`${t.label} — ${t.amountSek >= 0 ? '+' : ''}${t.amountSek} kr`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
