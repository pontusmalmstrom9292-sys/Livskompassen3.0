import { AlertTriangle, Check, Clock, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/design-system';
import { useEconomyLevel } from '@/features/economy/hooks/useEconomyLevel';
import { EKONOMI_IMPULS_LEAD } from '@/modules/features/dailyLife/wellbeing/economy/ekonomiCopy';
import { useEconomyImpulsWrite } from '../hooks/useEconomyImpulsWrite';
import { useEconomyTransactionWORM } from '../hooks/useEconomyTransactionWORM';

export type EkonomiImpulsDelegateProps = {
  userId: string;
};

const READY_TICK_MS = 60_000;

function parseAmountSek(raw: string): number | null {
  const normalized = raw.trim().replace(',', '.');
  if (!normalized) return null;
  const value = Number(normalized);
  if (!Number.isFinite(value)) return null;
  return Math.round(value);
}

function isImpulseReady(remindAt: string, nowMs: number): boolean {
  return Date.parse(remindAt) <= nowMs;
}

/** Fas 8E — Impulspaus (24h-regeln). */
export function EkonomiImpulsDelegate({ userId }: EkonomiImpulsDelegateProps) {
  const hasUser = Boolean(userId);
  const { level, circuitBreakerActive } = useEconomyLevel(userId);
  const isLowCapacity = circuitBreakerActive || level !== 3;

  const {
    items,
    loading,
    saving: queueSaving,
    savedFlash: queueSavedFlash,
    offlineQueued: queueOfflineQueued,
    error: queueError,
    clearError: clearQueueError,
    parkImpulse,
    resolveImpulse,
    removeImpulse,
  } = useEconomyImpulsWrite(hasUser ? userId : undefined);

  const {
    saveTransaction,
    saving: txSaving,
    savedFlash: txSavedFlash,
    offlineQueued: txOfflineQueued,
    error: txError,
    clearError: clearTxError,
  } = useEconomyTransactionWORM(hasUser ? userId : undefined);

  const [draft, setDraft] = useState('');
  const [purchaseAmounts, setPurchaseAmounts] = useState<Record<string, string>>({});
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(
    () => () => {
      setDraft('');
      setPurchaseAmounts({});
    },
    [],
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
    }, READY_TICK_MS);
    return () => window.clearInterval(intervalId);
  }, []);

  const readyItems = useMemo(
    () => items.filter((item) => isImpulseReady(item.remindAt, nowMs)),
    [items, nowMs],
  );

  const inputsDisabled = loading || queueSaving || txSaving || !hasUser;
  const displayError = txError ?? queueError;
  const savedFlash = txSavedFlash || queueSavedFlash;
  const offlineQueued = txOfflineQueued || queueOfflineQueued;
  const saving = queueSaving || txSaving;

  const clearErrors = useCallback(() => {
    clearQueueError();
    clearTxError();
  }, [clearQueueError, clearTxError]);

  const handlePark = useCallback(async () => {
    if (inputsDisabled || !draft.trim()) return;
    clearErrors();
    const ok = await parkImpulse(draft);
    if (ok) {
      setDraft('');
    }
  }, [clearErrors, draft, inputsDisabled, parkImpulse]);

  const handleBuy = useCallback(
    async (itemId: string, label: string) => {
      if (inputsDisabled || isLowCapacity) return;

      const amountSek = parseAmountSek(purchaseAmounts[itemId] ?? '');
      if (amountSek === null || amountSek <= 0) {
        clearErrors();
        return;
      }

      clearErrors();
      const txOk = await saveTransaction({
        label: `Impuls — ${label}`,
        amountSek: -amountSek,
        category: 'ovrigt',
      });
      if (!txOk) return;

      const resolved = await resolveImpulse(itemId, 'bought');
      if (resolved) {
        setPurchaseAmounts((prev) => {
          const next = { ...prev };
          delete next[itemId];
          return next;
        });
      }
    },
    [
      clearErrors,
      inputsDisabled,
      isLowCapacity,
      purchaseAmounts,
      resolveImpulse,
      saveTransaction,
    ],
  );

  const handleSkip = useCallback(
    async (itemId: string) => {
      if (inputsDisabled) return;
      clearErrors();
      const ok = await resolveImpulse(itemId, 'skipped');
      if (ok) {
        setPurchaseAmounts((prev) => {
          const next = { ...prev };
          delete next[itemId];
          return next;
        });
      }
    },
    [clearErrors, inputsDisabled, resolveImpulse],
  );

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <p className="flex items-center gap-1.5 font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          Impulspaus
        </p>
        <p className="text-xs leading-relaxed text-text-muted">{EKONOMI_IMPULS_LEAD}</p>
      </header>

      {!hasUser ? (
        <p className="text-sm text-text-dim">Logga in för impulsparkering.</p>
      ) : (
        <>
          <div className="flex gap-2">
            <input
              type="text"
              value={draft}
              disabled={inputsDisabled}
              onChange={(event) => {
                setDraft(event.target.value);
                clearErrors();
              }}
              placeholder="T.ex. nya hörlurar…"
              className="input-glass flex-1 rounded-lg px-3 py-2 text-xs disabled:opacity-60"
              aria-label="Beskriv impulsköpet"
            />
            <Button
              variant="ghost"
              disabled={inputsDisabled || !draft.trim()}
              onClick={() => void handlePark()}
              className="rounded-lg border border-border/50 bg-surface-3 px-3 py-2 text-xs disabled:opacity-60"
            >
              {queueSaving && !txSaving ? 'Sparar…' : 'Parkera'}
            </Button>
          </div>

          {loading ? (
            <p className="flex items-center gap-2 text-sm text-text-dim" aria-busy="true">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Laddar kö…
            </p>
          ) : items.length === 0 ? (
            <p className="text-xs text-text-dim">Inget parkerat — skriv ovan när impulsen kommer.</p>
          ) : (
            <ul className="space-y-2.5" aria-label="Impulskö">
              {items.map((item) => {
                const isReady = readyItems.some((row) => row.id === item.id);
                return (
                  <li
                    key={item.id}
                    className={`rounded-xl border px-3 py-3 text-xs ${
                      isReady
                        ? 'border-accent/30 bg-accent/5'
                        : 'border-border/30 bg-surface-3/40'
                    }`}
                  >
                    <p className="font-medium text-text">{item.label}</p>
                    <p className={`text-[10px] ${isReady ? 'text-accent/80' : 'text-text-dim'}`}>
                      Parkerad {item.parkedAt.slice(0, 10)}
                      {isReady ? ' · Dags att besluta' : ' · Vänta till imorgon'}
                    </p>

                    {isReady ? (
                      <div className="mt-3 space-y-2">
                        <label className="flex flex-col gap-1">
                          <span className="text-[10px] text-text-dim">Belopp om du köper (kr)</span>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={purchaseAmounts[item.id] ?? ''}
                            disabled={inputsDisabled}
                            onChange={(event) => {
                              setPurchaseAmounts((prev) => ({
                                ...prev,
                                [item.id]: event.target.value,
                              }));
                              clearErrors();
                            }}
                            placeholder="T.ex. 499"
                            className="input-glass w-full tabular-nums disabled:opacity-60"
                            aria-label={`Belopp för ${item.label}`}
                          />
                        </label>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="secondary"
                            disabled={
                              inputsDisabled ||
                              isLowCapacity ||
                              !(purchaseAmounts[item.id] ?? '').trim()
                            }
                            onClick={() => void handleBuy(item.id, item.label)}
                            className="px-2 py-1 text-[10px] disabled:opacity-50"
                          >
                            Fortfarande ja
                          </Button>
                          <Button
                            variant="ghost"
                            disabled={inputsDisabled}
                            onClick={() => void handleSkip(item.id)}
                            className="px-2 py-1 text-[10px] disabled:opacity-60"
                          >
                            Strunt i det
                          </Button>
                        </div>
                        {isLowCapacity ? (
                          <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-danger/90">
                            <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
                            Kapaciteten är för låg för att godkänna köp just nu. Låt beslutet vila
                            lite till.
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={inputsDisabled}
                        onClick={() => void removeImpulse(item.id)}
                        className="mt-2 text-[10px] text-text-dim hover:text-text disabled:opacity-60"
                      >
                        Ta bort
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
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
