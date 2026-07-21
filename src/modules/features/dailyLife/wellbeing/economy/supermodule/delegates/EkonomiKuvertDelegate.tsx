import { AlertTriangle, Check, Loader2, Wallet } from 'lucide-react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { EmptyState } from '@/core/ui/EmptyState';
import { Input } from '@/design-system';
import { useEconomyLevel } from '@/features/economy/hooks/useEconomyLevel';
import { EconomyEnvelopeSection } from '../../components/EconomyEnvelopeSection';
import { useEconomyKuvertWrite } from '../hooks/useEconomyKuvertWrite';
import { useEconomyTransactionWORM } from '../hooks/useEconomyTransactionWORM';

export type EkonomiKuvertDelegateProps = {
  userId: string;
};

function parseAmountSek(raw: string): number | null {
  const normalized = raw.trim().replace(',', '.');
  if (!normalized) return null;
  const value = Number(normalized);
  if (!Number.isFinite(value)) return null;
  return Math.round(value);
}

function buildKuvertExpenseLabel(envelopeTitle: string, optionalLabel: string): string {
  const trimmed = optionalLabel.trim();
  return trimmed ? `Kuvert — ${envelopeTitle}: ${trimmed}` : `Kuvert — ${envelopeTitle}`;
}

/** Fas 8D — Kuvertbudget. */
export function EkonomiKuvertDelegate({ userId }: EkonomiKuvertDelegateProps) {
  const { level, circuitBreakerActive } = useEconomyLevel(userId);
  const isLowCapacity = circuitBreakerActive || level === 'critical' || level === 1;
  const hasUser = Boolean(userId);

  const {
    envelopes,
    loading,
    saving: envelopeSaving,
    savedFlash: envelopeSavedFlash,
    offlineQueued: envelopeOfflineQueued,
    error: envelopeError,
    clearError: clearEnvelopeError,
    reload: reloadEnvelopes,
    recordEnvelopeSpend,
  } = useEconomyKuvertWrite(hasUser ? userId : undefined);

  const {
    saveTransaction,
    saving: txSaving,
    savedFlash: txSavedFlash,
    offlineQueued: txOfflineQueued,
    error: txError,
    clearError: clearTxError,
  } = useEconomyTransactionWORM(hasUser ? userId : undefined, reloadEnvelopes);

  const [selectedEnvelopeId, setSelectedEnvelopeId] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseLabel, setExpenseLabel] = useState('');

  useEffect(
    () => () => {
      setSelectedEnvelopeId('');
      setExpenseAmount('');
      setExpenseLabel('');
    },
    [],
  );

  useEffect(() => {
    if (envelopes.length === 0) {
      setSelectedEnvelopeId('');
      return;
    }
    if (!envelopes.some((env) => env.id === selectedEnvelopeId)) {
      setSelectedEnvelopeId(envelopes[0]?.id ?? '');
    }
  }, [envelopes, selectedEnvelopeId]);

  const inputsDisabled = loading || envelopeSaving || txSaving || !hasUser || isLowCapacity;
  const selectedEnvelope = envelopes.find((env) => env.id === selectedEnvelopeId);
  const displayError = txError ?? envelopeError;
  const savedFlash = txSavedFlash || envelopeSavedFlash;
  const offlineQueued = txOfflineQueued || envelopeOfflineQueued;
  const saving = envelopeSaving || txSaving;

  const clearErrors = useCallback(() => {
    clearEnvelopeError();
    clearTxError();
  }, [clearEnvelopeError, clearTxError]);

  const handleLogExpense = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (inputsDisabled || !selectedEnvelope) return;

      const spentSek = parseAmountSek(expenseAmount);
      if (spentSek === null || spentSek <= 0) {
        clearErrors();
        return;
      }

      clearErrors();
      const ok = await saveTransaction({
        label: buildKuvertExpenseLabel(selectedEnvelope.title, expenseLabel),
        amountSek: -spentSek,
        category: 'ovrigt',
      });

      if (!ok) return;

      const envelopeOk = await recordEnvelopeSpend(selectedEnvelope.id, spentSek);
      if (envelopeOk) {
        setExpenseAmount('');
        setExpenseLabel('');
      }
    },
    [
      clearErrors,
      expenseAmount,
      expenseLabel,
      inputsDisabled,
      recordEnvelopeSpend,
      saveTransaction,
      selectedEnvelope,
    ],
  );

  return (
    <div className="space-y-5">
      <header className="space-y-1.5">
        <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
          Kuvert
        </p>
        <p className="text-xs leading-relaxed text-text-muted">
          Manuella kategoribudgetar — logga utgifter till rätt kuvert utan bankkoppling.
        </p>
      </header>

      {!hasUser ? (
        <EmptyState
          title="Kuvert"
          message="Logga in för att skapa kuvert och logga utgifter utan bankkoppling."
        />
      ) : loading ? (
        <p className="flex items-center gap-2 text-sm text-text-dim" aria-busy="true">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Laddar kuvert…
        </p>
      ) : (
        <>
          {envelopes.length === 0 ? (
            <EmptyState
              title="Inga kuvert"
              message="Skapa ett kuvert nedan först — sedan kan du logga utgifter hit."
            />
          ) : (
            <form
              className="space-y-3.5 rounded-xl border border-accent/20 bg-accent/5 p-4"
              onSubmit={(event) => void handleLogExpense(event)}
              aria-label="Logga kuvertutgift"
            >
              <p className="text-[10px] uppercase tracking-wider text-text-dim">Logga utgift</p>

              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] text-text-dim">Kuvert</span>
                <select
                  value={selectedEnvelopeId}
                  disabled={inputsDisabled}
                  onChange={(event) => {
                    setSelectedEnvelopeId(event.target.value);
                    clearErrors();
                  }}
                  className="input-glass min-h-11 w-full text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-60"
                  aria-label="Välj kuvert"
                >
                  {envelopes.map((env) => (
                    <option key={env.id} value={env.id}>
                      {env.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] text-text-dim">Belopp (kr)</span>
                <Input
                  type="text"
                  inputMode="decimal"
                  value={expenseAmount}
                  disabled={inputsDisabled}
                  onChange={(event) => {
                    setExpenseAmount(event.target.value);
                    clearErrors();
                  }}
                  placeholder="T.ex. 120"
                  className="input-glass min-h-11 w-full tabular-nums focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-60"
                  aria-label="Utgiftsbelopp i kronor"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] text-text-dim">Etikett (valfritt)</span>
                <Input
                  type="text"
                  value={expenseLabel}
                  disabled={inputsDisabled}
                  onChange={(event) => {
                    setExpenseLabel(event.target.value);
                    clearErrors();
                  }}
                  placeholder="T.ex. matbutik"
                  className="input-glass min-h-11 w-full focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-60"
                  aria-label="Etikett för utgiften"
                />
              </label>

              <button
                type="submit"
                disabled={inputsDisabled || !expenseAmount.trim()}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-accent/20 bg-accent/10 py-2.5 text-xs text-accent transition-colors hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                    Sparar…
                  </>
                ) : (
                  <>
                    <Wallet className="h-3.5 w-3.5" aria-hidden />
                    Logga utgift
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-2">
            <EconomyEnvelopeSection disabled={isLowCapacity} />
          </div>
        </>
      )}

      {offlineQueued ? (
        <p className="text-xs text-text-muted" role="status">
          Sparas när nätet är tillbaka.
        </p>
      ) : null}

      {displayError ? (
        <p
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
    </div>
  );
}
