import { Check, Loader2, Trash2, Wallet } from 'lucide-react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { envelopeRemaining } from '@/modules/features/dailyLife/wellbeing/economy/rules/budgetTemplates';
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

/**
 * Fas 8D — Kuvertbudget.
 * Mutable `budgets` via useEconomyKuvertWrite; utgifter → `transactions` via WORM hook.
 */
export function EkonomiKuvertDelegate({ userId }: EkonomiKuvertDelegateProps) {
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
    createEnvelope,
    recordEnvelopeSpend,
    removeEnvelope,
  } = useEconomyKuvertWrite(hasUser ? userId : undefined);

  const {
    saveTransaction,
    saving: txSaving,
    savedFlash: txSavedFlash,
    offlineQueued: txOfflineQueued,
    error: txError,
    clearError: clearTxError,
  } = useEconomyTransactionWORM(hasUser ? userId : undefined, reloadEnvelopes);

  const [newTitle, setNewTitle] = useState('');
  const [newAllocated, setNewAllocated] = useState('500');
  const [selectedEnvelopeId, setSelectedEnvelopeId] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseLabel, setExpenseLabel] = useState('');

  useEffect(
    () => () => {
      setNewTitle('');
      setNewAllocated('500');
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

  const inputsDisabled = loading || envelopeSaving || txSaving || !hasUser;
  const selectedEnvelope = envelopes.find((env) => env.id === selectedEnvelopeId);
  const displayError = txError ?? envelopeError;
  const savedFlash = txSavedFlash || envelopeSavedFlash;
  const offlineQueued = txOfflineQueued || envelopeOfflineQueued;
  const saving = envelopeSaving || txSaving;

  const clearErrors = useCallback(() => {
    clearEnvelopeError();
    clearTxError();
  }, [clearEnvelopeError, clearTxError]);

  const handleCreateEnvelope = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (inputsDisabled || !newTitle.trim()) return;

      const allocatedSek = parseAmountSek(newAllocated);
      if (allocatedSek === null) {
        clearErrors();
        return;
      }

      clearErrors();
      const ok = await createEnvelope(newTitle, allocatedSek);
      if (ok) {
        setNewTitle('');
        setNewAllocated('500');
      }
    },
    [clearErrors, createEnvelope, inputsDisabled, newAllocated, newTitle],
  );

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
          {envelopes.length === 0 ? (
            <p className="rounded-xl border border-border/30 bg-surface-3/30 px-3 py-4 text-xs text-text-muted">
              Inga kuvert ännu. Skapa ett nedan.
            </p>
          ) : (
            <ul className="space-y-2.5" aria-label="Aktiva kuvert">
              {envelopes.map((env) => {
                const left = envelopeRemaining(env);
                return (
                  <li
                    key={env.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-border/30 bg-surface-3/30 px-3 py-3"
                  >
                    <div>
                      <p className="text-sm text-text">{env.title}</p>
                      <p className="text-xs text-text-dim">
                        Kvar {left} kr av {env.allocatedSek} kr
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={inputsDisabled}
                      onClick={() => void removeEnvelope(env.id)}
                      className="btn-pill--ghost p-2 text-text-dim disabled:opacity-60"
                      aria-label={`Ta bort ${env.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <form
            className="space-y-3 rounded-xl border border-border/30 bg-surface-3/20 p-3"
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

          <form
            className="space-y-3 border-t border-border/30 pt-4"
            onSubmit={(event) => void handleCreateEnvelope(event)}
            aria-label="Skapa kuvert"
          >
            <p className="text-[10px] uppercase tracking-wider text-text-dim">Nytt kuvert</p>

            <label className="flex flex-col gap-1">
              <span className="text-[10px] text-text-dim">Namn</span>
              <input
                type="text"
                value={newTitle}
                disabled={inputsDisabled}
                onChange={(event) => {
                  setNewTitle(event.target.value);
                  clearErrors();
                }}
                placeholder="T.ex. Mat"
                className="input-glass w-full disabled:opacity-60"
                aria-label="Kuvertnamn"
                required
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[10px] text-text-dim">Budget (kr)</span>
              <input
                type="text"
                inputMode="decimal"
                value={newAllocated}
                disabled={inputsDisabled}
                onChange={(event) => {
                  setNewAllocated(event.target.value);
                  clearErrors();
                }}
                className="input-glass w-full tabular-nums disabled:opacity-60"
                aria-label="Allokerad budget i kronor"
              />
            </label>

            <button
              type="submit"
              disabled={inputsDisabled || !newTitle.trim()}
              className="btn-pill--secondary w-full text-sm disabled:opacity-60"
            >
              {envelopeSaving ? 'Sparar…' : 'Skapa kuvert'}
            </button>
          </form>
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
