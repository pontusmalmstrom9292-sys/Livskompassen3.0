import { Check, Loader2 } from 'lucide-react';
import { useEffect, type FormEvent } from 'react';
import { useEconomyProfilWrite } from '../hooks/useEconomyProfilWrite';

export type EkonomiProfilDelegateProps = {
  userId: string;
};

/**
 * Fas 8D — Veckobudget + matlåda-preset.
 * Writes `economy_profiles` via setEconomyProfile — not economy_ledger.
 */
export function EkonomiProfilDelegate({ userId }: EkonomiProfilDelegateProps) {
  const hasUser = Boolean(userId);

  const {
    weeklyBudget,
    setWeeklyBudget,
    mealPreset,
    setMealPreset,
    loading,
    saving,
    savedFlash,
    offlineQueued,
    error,
    clearError,
    persistProfile,
  } = useEconomyProfilWrite(hasUser ? userId : undefined);

  useEffect(
    () => () => {
      clearError();
    },
    [clearError],
  );

  const inputsDisabled = loading || saving || !hasUser;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputsDisabled) return;
    clearError();
    await persistProfile();
  };

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
          Veckobudget
        </p>
        <p className="text-xs leading-relaxed text-text-muted">
          Fasta parametrar för saldo och snabbtillägg. Sparas till din ekonomiprofil.
        </p>
      </header>

      {!hasUser ? (
        <p className="text-sm text-text-dim">Logga in för att ställa in profil.</p>
      ) : loading ? (
        <p className="flex items-center gap-2 text-sm text-text-dim" aria-busy="true">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Laddar profil…
        </p>
      ) : (
        <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)} aria-label="Ekonomiprofil">
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
                disabled={inputsDisabled}
                onChange={(event) => {
                  setWeeklyBudget(event.target.value);
                  clearError();
                }}
                className="input-glass w-full tabular-nums disabled:opacity-60"
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
                disabled={inputsDisabled}
                onChange={(event) => {
                  setMealPreset(event.target.value);
                  clearError();
                }}
                className="input-glass w-full tabular-nums disabled:opacity-60"
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
            disabled={inputsDisabled}
            className="btn-pill--primary w-full text-sm disabled:opacity-60"
          >
            {saving ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Sparar…
              </span>
            ) : (
              'Spara profil'
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
          Profil sparad.
        </p>
      ) : null}
    </div>
  );
}
