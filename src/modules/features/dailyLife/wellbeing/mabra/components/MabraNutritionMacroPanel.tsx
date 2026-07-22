import { computeDailyMacroTotals } from '../lib/mabraNutritionMacroTotals';

type Props = {
  storageUid: string;
  refreshKey?: number;
};

const PORTION_TIPS = [
  'Handflata protein (fisk, kyckling, ägg, bönor)',
  'Knytnäve kolhydrater (ris, pasta, potatis)',
  'Tumme fett (olja, smör, nötter)',
  'Två nävar grönsaker',
] as const;

export function MabraNutritionMacroPanel({ storageUid }: Props) {
  const totals = computeDailyMacroTotals(storageUid);
  const hasAny = totals.proteinG + totals.fatG + totals.carbsG > 0;

  return (
    <div className="mt-4 space-y-3">
      <div className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wider text-accent">Dagens makron (gram)</p>
        <p className="mt-1 text-xs text-text-muted">Uppskattning — inga mål, inga kalorier.</p>

        <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border border-border bg-surface/50 px-2 py-2">
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">Protein</dt>
            <dd className="font-display-serif text-xl tabular-nums text-text">{totals.proteinG}</dd>
          </div>
          <div className="rounded-lg border border-border bg-surface/50 px-2 py-2">
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">Fett</dt>
            <dd className="font-display-serif text-xl tabular-nums text-text">{totals.fatG}</dd>
          </div>
          <div className="rounded-lg border border-border bg-surface/50 px-2 py-2">
            <dt className="text-[10px] uppercase tracking-wider text-text-muted">Kolhydrat</dt>
            <dd className="font-display-serif text-xl tabular-nums text-text">{totals.carbsG}</dd>
          </div>
        </dl>

        {!hasAny ? (
          <p className="mt-3 text-xs text-text-muted">
            Lägg valfritt P/F/K (g) vid matlogg — fältet är tomt tills du fyller i.
          </p>
        ) : (
          <p className="mt-3 text-xs text-text-muted">
            Summa från {totals.entriesWithMacros} logg{totals.entriesWithMacros === 1 ? '' : 'gar'} idag.
          </p>
        )}
      </div>

      <div className="rounded-xl border border-border bg-surface-2/60 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Portionsguide</p>
        <ul className="mt-2 space-y-1.5">
          {PORTION_TIPS.map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-sm text-text-muted">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-success/70" aria-hidden />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
