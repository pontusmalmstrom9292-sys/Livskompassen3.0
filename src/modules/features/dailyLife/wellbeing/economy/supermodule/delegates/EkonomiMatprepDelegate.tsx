import { CheckCircle2, Utensils } from 'lucide-react';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';

export type EkonomiMatprepDelegateProps = {
  userId: string;
};

type PrepCheckItem = {
  id: string;
  text: string;
  done: boolean;
};

const PLACEHOLDER_ITEMS: PrepCheckItem[] = [
  { id: 'plan', text: 'Planera veckans rätter', done: false },
  { id: 'shop', text: 'Handla basvaror', done: false },
  { id: 'prep', text: 'Förbered matlådor', done: false },
];

/**
 * Fas 8D — Neuro-kost / matprep (UI-skelett).
 * Firestore-koppling kommer i senare fas — meal prep doc + ev. transactions.
 */
export function EkonomiMatprepDelegate({ userId }: EkonomiMatprepDelegateProps) {
  const hasUser = Boolean(userId);

  const [items, setItems] = useState<PrepCheckItem[]>(PLACEHOLDER_ITEMS);
  const [estimatedSavings, setEstimatedSavings] = useState('');
  const [prepNote, setPrepNote] = useState('');

  useEffect(
    () => () => {
      setItems(PLACEHOLDER_ITEMS.map((item) => ({ ...item, done: false })));
      setEstimatedSavings('');
      setPrepNote('');
    },
    [],
  );

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
    );
  };

  const allDone = items.length > 0 && items.every((item) => item.done);

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
                  onClick={() => toggleItem(item.id)}
                  className={clsx(
                    'mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-sm transition-colors',
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
            onSubmit={(event) => event.preventDefault()}
            aria-label="Registrera matprep"
          >
            <label className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-text-dim">
                Uppskattad besparing (kr)
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={estimatedSavings}
                onChange={(event) => setEstimatedSavings(event.target.value)}
                placeholder="T.ex. 120"
                className="input-glass w-full tabular-nums"
                aria-label="Uppskattad besparing i kronor"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-text-dim">
                Anteckning (valfritt)
              </span>
              <input
                type="text"
                value={prepNote}
                onChange={(event) => setPrepNote(event.target.value)}
                placeholder="T.ex. tre lunchlådor till veckan"
                className="input-glass w-full"
                aria-label="Anteckning om matpreppen"
              />
            </label>

            <button
              type="submit"
              disabled
              className={clsx(
                'flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs transition-colors',
                allDone
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-border/50 bg-surface-3/50 text-text-dim',
                'opacity-60',
              )}
              title="Firestore-koppling kommer i nästa fas"
            >
              <Utensils className="h-3.5 w-3.5" aria-hidden />
              Registrera matprep — kommer i nästa steg
            </button>
          </form>
        </>
      )}
    </div>
  );
}
