import { SaldoHero } from '@/core/ui/SaldoHero';

export type EkonomiSaldoDelegateProps = {
  userId: string;
};

/**
 * Fas 8A/8B — skelett för Snabbsaldo.
 * Wrappar EconomyQuickBalancePanel i senare fas; ingen Firestore-koppling ännu.
 */
export function EkonomiSaldoDelegate({ userId }: EkonomiSaldoDelegateProps) {
  const hasUser = Boolean(userId);

  return (
    <div className="space-y-4">
      <SaldoHero
        label="Snabbsaldo"
        amount="— kr"
        hint={hasUser ? 'Veckobudget och matlåda laddas här' : 'Logga in för att se saldo'}
      />

      <div className="space-y-2">
        <div className="flex justify-between text-xs tabular-nums text-text-dim">
          <span>Förbrukat denna vecka: <strong className="text-text">— kr</strong></span>
          <span>Kvar att leva på: <strong className="text-accent">— kr</strong></span>
        </div>
        <div
          className="h-3 w-full overflow-hidden rounded-full border border-border/50 bg-surface-3"
          aria-hidden
        >
          <div className="h-full w-0 rounded-full bg-accent/30" />
        </div>
      </div>

      <div>
        <p className="mb-2 text-[10px] uppercase tracking-wider text-text-dim">Snabbtillägg</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled
            className="rounded-xl border border-border/50 bg-surface-3/50 px-4 py-3 text-left opacity-60"
          >
            <span className="block text-xs font-medium text-text-muted">Veckopeng</span>
            <span className="block text-[10px] text-text-dim">Kommer i nästa steg</span>
          </button>
          <button
            type="button"
            disabled
            className="rounded-xl border border-border/50 bg-surface-3/50 px-4 py-3 text-left opacity-60"
          >
            <span className="block text-xs font-medium text-text-muted">Matlåda</span>
            <span className="block text-[10px] text-text-dim">Kommer i nästa steg</span>
          </button>
        </div>
      </div>
    </div>
  );
}
