/** Makron/våg — stub tills Fas 22.3+ full wire. Endast vägledning, ingen kaloriräkning. */

const PORTION_TIPS = [
  'Handflata protein (fisk, kyckling, ägg, bönor)',
  'Knytnäve kolhydrater (ris, pasta, potatis)',
  'Tumme fett (olja, smör, nötter)',
  'Två nävar grönsaker',
] as const;

export function MabraNutritionMacroStub() {
  return (
    <div className="mt-4 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wider text-accent">Portionsguide (enkel)</p>
      <p className="mt-1 text-xs text-text-dim">
        Ingen våg än — använd handen som mått. Kalorier och makron kommer i nästa våg.
      </p>
      <ul className="mt-3 space-y-1.5">
        {PORTION_TIPS.map((tip) => (
          <li key={tip} className="flex items-start gap-2 text-sm text-text-muted">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/70" aria-hidden />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
