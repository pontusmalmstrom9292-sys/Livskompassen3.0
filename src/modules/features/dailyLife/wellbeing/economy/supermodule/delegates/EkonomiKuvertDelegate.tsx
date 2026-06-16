import { Check, Loader2, Wallet } from 'lucide-react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useCapacityScore } from '@/core/store/useCapacityGate';
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

/** Normaliserad kapacitet 0–1 — SPEC §4.3 / §4.5 */
const STABILITY_THRESHOLD = 0.5;

/**
 * Fas 8D — Kuvertbudget.
 * Mutable `budgets` via useEconomyKuvertWrite; utgifter → `transactions` via WORM hook.
 */
export function EkonomiKuvertDelegate({ userId }: EkonomiKuvertDelegateProps) {
  const capacityScore = useCapacityScore();
  const isLowCapacity = capacityScore < STABILITY_THRESHOLD;
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
      <header className="space-y-1">
        <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
          Kuvert
        </p>
        <p className="text-xs leading-relaxed text-text-muted">
          Manuella kategoribudgetar — logga utgifter till rätt kuvert utan bankkoppling.
        </p>
      </header>

      {!hasUser ? (
        <p className="text-sm text-text-dim">Logga in för att hantera kuvert.</p>
      ) : loading ? (
        <p className="flex items-center gap-2 text-sm text-text-dim" aria-busy="true">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Laddar kuvert…
        </p>
      ) : (
        <>
          <form
            className="space-y-3 rounded-xl border border-accent/20 bg-accent/5 p-4 shadow-[0_0_15px_rgba(212,175,55,0.05)]"
            onSubmit={(event) => void handleLogExpense(event)}
            aria-label="Logga kuvertutgift"
          >
            <p className="text-[10px] uppercase tracking-wider text-text-dim">Logga utgift</p>

            <label className="flex flex-col gap-1">
              <span className="text-[10px] text-text-dim">Kuvert</span>
              <select
                value={selectedEnvelopeId}
                disabled={inputsDisabled || envelopes.length === 0}
                onChange={(event) => {
                  setSelectedEnvelopeId(event.target.value);
                  clearErrors();
                }}
                className="input-glass w-full text-sm disabled:opacity-60"
                aria-label="Välj kuvert"
              >
                {envelopes.length === 0 ? (
                  <option value="">Skapa kuvert först</option>
                ) : (
                  envelopes.map((env) => (
                    <option key={env.id} value={env.id}>
                      {env.title}
                    </option>
                  ))
                )}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[10px] text-text-dim">Belopp (kr)</span>
              <input
                type="text"
                inputMode="decimal"
                value={expenseAmount}
                disabled={inputsDisabled || envelopes.length === 0}
                onChange={(event) => {
                  setExpenseAmount(event.target.value);
                  clearErrors();
                }}
                placeholder="T.ex. 120"
                className="input-glass w-full tabular-nums disabled:opacity-60"
                aria-label="Utgiftsbelopp i kronor"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[10px] text-text-dim">Etikett (valfritt)</span>
              <input
                type="text"
                value={expenseLabel}
                disabled={inputsDisabled || envelopes.length === 0}
                onChange={(event) => {
                  setExpenseLabel(event.target.value);
                  clearErrors();
                }}
                placeholder="T.ex. matbutik"
                className="input-glass w-full disabled:opacity-60"
                aria-label="Etikett för utgiften"
              />
            </label>

            <button
              type="submit"
              disabled={inputsDisabled || envelopes.length === 0 || !expenseAmount.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-accent/20 bg-accent/10 py-2.5 text-xs text-accent transition-colors hover:bg-accent/20 disabled:opacity-60"
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

          <div className="mt-6">
            <EconomyEnvelopeSection disabled={isLowCapacity} />
          </div>
        </>
      )}

      {offlineQueued ? (
        <p className="text-xs text-text-muted">Sparas när nätet är tillbaka.</p>
      ) : null}

      {displayError ? <p className="text-sm text-danger">{displayError}</p> : null}

      {savedFlash && !saving ? (
        <p className="flex items-center gap-2 text-sm text-emerald-400" role="status">
          <Check className="h-4 w-4 shrink-0" aria-hidden />
          Sparat.
        </p>
      ) : null}
    </div>
  );
}
