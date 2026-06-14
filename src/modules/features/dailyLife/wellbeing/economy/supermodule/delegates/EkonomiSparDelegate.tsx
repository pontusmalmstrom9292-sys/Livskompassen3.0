import { Check, Loader2, PiggyBank } from 'lucide-react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useEconomyTransactionWORM } from '../hooks/useEconomyTransactionWORM';

export type EkonomiSparDelegateProps = {
  userId: string;
};

function parseAmountSek(raw: string): number | null {
  const normalized = raw.trim().replace(',', '.');
  if (!normalized) return null;
  const value = Number(normalized);
  if (!Number.isFinite(value)) return null;
  return Math.round(value);
}

function buildSparandeLabel(optionalLabel: string): string {
  const trimmed = optionalLabel.trim();
  return trimmed ? `Sparande — ${trimmed}` : 'Sparande';
}

/**
 * Fas 8D — Logga besparing.
 * WORM write → `transactions` via useEconomyTransactionWORM (category `ovrigt`, semantik sparande i etikett).
 */
export function EkonomiSparDelegate({ userId }: EkonomiSparDelegateProps) {
  const hasUser = Boolean(userId);

  const {
    saveTransaction,
    saving,
    savedFlash,
    offlineQueued,
    error,
    clearError,
  } = useEconomyTransactionWORM(hasUser ? userId : undefined);

  const [amount, setAmount] = useState('');
  const [label, setLabel] = useState('');

  useEffect(
    () => () => {
      setAmount('');
      setLabel('');
    },
    [],
  );

  const inputsDisabled = saving || !hasUser;

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (inputsDisabled) return;

      const amountSek = parseAmountSek(amount);
      if (amountSek === null || amountSek <= 0) {
        clearError();
        return;
      }

      clearError();
      const ok = await saveTransaction({
        label: buildSparandeLabel(label),
        amountSek,
        category: 'ovrigt',
      });

      if (ok) {
        setAmount('');
        setLabel('');
      }
    },
    [amount, clearError, inputsDisabled, label, saveTransaction],
  );

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
          Sparmål
        </p>
        <p className="text-xs leading-relaxed text-text-muted">
          Logga en besparing i kronor — en siffra i taget, utan grafer eller streaks.
        </p>
      </header>

      {!hasUser ? (
        <p className="text-sm text-text-dim">Logga in för att logga besparing.</p>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(event) => void handleSubmit(event)}
          aria-label="Logga besparing"
        >
          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-text-dim">
              Besparing (kr)
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              disabled={inputsDisabled}
              onChange={(event) => {
                setAmount(event.target.value);
                clearError();
              }}
              placeholder="T.ex. 200"
              className="input-glass w-full tabular-nums disabled:opacity-60"
              aria-label="Besparat belopp i kronor"
              required
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-text-dim">
              Etikett (valfritt)
            </span>
            <input
              type="text"
              value={label}
              disabled={inputsDisabled}
              onChange={(event) => {
                setLabel(event.target.value);
                clearError();
              }}
              placeholder="T.ex. buffert eller nödfond"
              className="input-glass w-full disabled:opacity-60"
              aria-label="Etikett för besparingen"
            />
          </label>

          <button
            type="submit"
            disabled={inputsDisabled || !amount.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-accent/20 bg-accent/10 py-2.5 text-xs text-accent transition-colors hover:bg-accent/20 disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                Sparar…
              </>
            ) : (
              <>
                <PiggyBank className="h-3.5 w-3.5" aria-hidden />
                Logga besparing
              </>
            )}
          </button>
        </form>
      )}

      {offlineQueued ? (
        <p className="text-xs text-text-muted">Sparas när nätet är tillbaka.</p>
      ) : null}

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      {savedFlash && !saving ? (
        <p className="flex items-center gap-2 text-sm text-emerald-400" role="status">
          <Check className="h-4 w-4 shrink-0" aria-hidden />
          Besparing loggad.
        </p>
      ) : null}
    </div>
  );
}
