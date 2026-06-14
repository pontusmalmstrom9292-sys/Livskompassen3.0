import { useEffect, useState } from 'react';

export type EkonomiProfilDelegateProps = {
  userId: string;
};

const DEFAULT_WEEKLY_BUDGET = 500;
const DEFAULT_MEAL_PRESET = 85;

/**
 * Fas 8D — Veckobudget + matlåda-preset (UI-skelett).
 * Firestore-koppling kommer i senare fas — `economy_profiles` via setEconomyProfile.
 */
export function EkonomiProfilDelegate({ userId }: EkonomiProfilDelegateProps) {
  const hasUser = Boolean(userId);

  const [weeklyBudget, setWeeklyBudget] = useState(String(DEFAULT_WEEKLY_BUDGET));
  const [mealPreset, setMealPreset] = useState(String(DEFAULT_MEAL_PRESET));

  useEffect(
    () => () => {
      setWeeklyBudget(String(DEFAULT_WEEKLY_BUDGET));
      setMealPreset(String(DEFAULT_MEAL_PRESET));
    },
    [],
  );

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
          Veckobudget
        </p>
        <p className="text-xs leading-relaxed text-text-muted">
          Fasta parametrar för saldo och snabbtillägg. Sparas till profil vid nästa fas.
        </p>
      </header>

      {!hasUser ? (
        <p className="text-sm text-text-dim">Logga in för att ställa in profil.</p>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(event) => event.preventDefault()}
          aria-label="Ekonomiprofil"
        >
          <div className="flex flex-wrap gap-4">
            <label className="flex min-w-[8rem] flex-1 flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-text-dim">
                Veckobudget (kr)
              </span>
              <input
                type="number"
                min={0}
                step={50}
                value={weeklyBudget}
                onChange={(event) => setWeeklyBudget(event.target.value)}
                className="input-glass w-full tabular-nums"
                aria-label="Veckobudget i kronor"
              />
            </label>
            <label className="flex min-w-[8rem] flex-1 flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-text-dim">
                Matlåda-preset (kr)
              </span>
              <input
                type="number"
                min={0}
                step={5}
                value={mealPreset}
                onChange={(event) => setMealPreset(event.target.value)}
                className="input-glass w-full tabular-nums"
                aria-label="Standardbelopp matlåda i kronor"
              />
            </label>
          </div>

          <p className="text-[10px] leading-relaxed text-text-dim">
            Matlåda-preset används av Snabbsaldo och Neuro-kost. Veckobudget styr &quot;kvar att leva
            på&quot;-mätaren.
          </p>

          <button
            type="submit"
            disabled
            className="btn-pill--primary w-full text-sm opacity-60"
            title="Firestore-koppling kommer i nästa fas"
          >
            Spara profil — kommer i nästa steg
          </button>
        </form>
      )}
    </div>
  );
}
