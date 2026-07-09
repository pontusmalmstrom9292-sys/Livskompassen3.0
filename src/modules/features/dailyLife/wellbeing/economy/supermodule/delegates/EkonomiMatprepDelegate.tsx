import { Check, CheckCircle2, Loader2, Utensils } from 'lucide-react';
import { clsx } from 'clsx';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Input } from '@/design-system';
import { useEconomyMatprepRead } from '../hooks/useEconomyMatprepRead';
import { useEconomyTransactionWORM } from '../hooks/useEconomyTransactionWORM';

export type EkonomiMatprepDelegateProps = {
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
 * Fas 8D — Neuro-kost / matprep.
 * Checklist → `economy_profiles.mealPrepItems`; besparing → `transactions` via WORM hook.
 */
export function EkonomiMatprepDelegate({ userId }: EkonomiMatprepDelegateProps) {
  const hasUser = Boolean(userId);

  const {
    items,
    loading,
    persisting,
    error: readError,
    reload,
    toggleItem,
    resetChecklist,
  } = useEconomyMatprepRead(hasUser ? userId : undefined);

  const {
    saveTransaction,
    saving,
    savedFlash,
    offlineQueued,
    error: saveError,
    clearError,
  } = useEconomyTransactionWORM(hasUser ? userId : undefined, reload);

  const [estimatedSavings, setEstimatedSavings] = useState('');
  const [prepNote, setPrepNote] = useState('');

  useEffect(
    () => () => {
      setEstimatedSavings('');
      setPrepNote('');
    },
    [],
  );

  const inputsDisabled = loading || saving || persisting || !hasUser;
  const allDone = items.length > 0 && items.every((item) => item.done);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (inputsDisabled || !allDone) return;

      const amountSek = parseAmountSek(estimatedSavings);
      if (amountSek === null || amountSek <= 0) {
        clearError();
        return;
      }

      const note = prepNote.trim();
      const label = note ? `Matprep — ${note}` : 'Matprep — uppskattad besparing';

      clearError();
      const ok = await saveTransaction({
        label,
        amountSek,
        category: 'matlada',
      });

      if (ok) {
        await resetChecklist();
        setEstimatedSavings('');
        setPrepNote('');
      }
    },
    [
      allDone,
      clearError,
      estimatedSavings,
      inputsDisabled,
      prepNote,
      resetChecklist,
      saveTransaction,
    ],
  );

  const displayError = saveError ?? readError;

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
          Neuro-kost
        </p>
        <p className="text-xs leading-relaxed text-text-muted">
          Registrera matprep för att undvika dyra impulsköp. Uppskatta besparingen i kronor.
        </p>
      </header>

      {!hasUser ? (
        <p className="text-sm text-text-dim">Logga in för att registrera matprep.</p>
      ) : loading ? (
        <p className="flex items-center gap-2 text-sm text-text-dim" aria-busy="true">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Laddar checklista…
        </p>
      ) : (
        <>
          <ul className="space-y-2.5" aria-label="Matprep-checklista">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-3 rounded-xl border border-border/30 bg-surface-3/30 p-2.5"
              >
                <button
                  type="button"
                  disabled={inputsDisabled}
                  onClick={() => void toggleItem(item.id)}
                  className={clsx(
                    'mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-sm transition-colors disabled:opacity-60',
                    item.done
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'border border-border-strong text-transparent hover:border-emerald-500/50',
                  )}
                  aria-label={item.done ? 'Markerad' : 'Ej markerad'}
                  aria-pressed={item.done}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </button>
                <span
                  className={clsx(
                    'text-xs leading-relaxed transition-colors',
                    item.done
                      ? 'text-text-dim line-through decoration-text-dim/50'
                      : 'text-text-muted',
                  )}
                >
                  {item.text}
                </span>
              </li>
            ))}
          </ul>

          <form
            className="space-y-4"
            onSubmit={(event) => void handleSubmit(event)}
            aria-label="Registrera matprep"
          >
            <label className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-text-dim">
                Uppskattad besparing (kr)
              </span>
              <Input
                type="text"
                inputMode="decimal"
                value={estimatedSavings}
                disabled={inputsDisabled}
                onChange={(event) => {
                  setEstimatedSavings(event.target.value);
                  clearError();
                }}
                placeholder="T.ex. 120"
                className="input-glass w-full tabular-nums disabled:opacity-60"
                aria-label="Uppskattad besparing i kronor"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-text-dim">
                Anteckning (valfritt)
              </span>
              <Input
                type="text"
                value={prepNote}
                disabled={inputsDisabled}
                onChange={(event) => {
                  setPrepNote(event.target.value);
                  clearError();
                }}
                placeholder="T.ex. tre lunchlådor till veckan"
                className="input-glass w-full disabled:opacity-60"
                aria-label="Anteckning om matpreppen"
              />
            </label>

            <button
              type="submit"
              disabled={inputsDisabled || !allDone || !estimatedSavings.trim()}
              className={clsx(
                'flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs transition-colors disabled:opacity-60',
                allDone
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                  : 'border-border/50 bg-surface-3/50 text-text-dim',
              )}
            >
              {saving || persisting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                  Sparar…
                </>
              ) : (
                <>
                  <Utensils className="h-3.5 w-3.5" aria-hidden />
                  Registrera matprep
                </>
              )}
            </button>
          </form>
        </>
      )}

      {!allDone && hasUser && !loading ? (
        <p className="text-[10px] text-text-dim">Bocka av alla steg innan du registrerar.</p>
      ) : null}

      {offlineQueued ? (
        <p className="text-xs text-text-muted">Sparas när nätet är tillbaka.</p>
      ) : null}

      {displayError ? <p className="text-sm text-danger">{displayError}</p> : null}

      {savedFlash && !saving ? (
        <p className="flex items-center gap-2 text-sm text-emerald-400" role="status">
          <Check className="h-4 w-4 shrink-0" aria-hidden />
          Matprep registrerad.
        </p>
      ) : null}
    </div>
  );
}
