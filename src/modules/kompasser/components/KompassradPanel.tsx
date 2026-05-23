import { getDefaultCompassByTime } from '../utils/compassTime';
import { getFlowConfig, EVENING_HERO } from '../config/compassFlows';

const TAGS = [
  { id: 'biff', label: 'BIFF' },
  { id: 'no-jade', label: 'Ingen JADE' },
  { id: 'parallel', label: 'Parallellt föräldraskap' },
] as const;

/** D3 — dagens kompassråd + taggar (Hamn/Hem). */
export function KompassradPanel() {
  const flow = getDefaultCompassByTime();
  const meta = flow === 'evening' ? EVENING_HERO : getFlowConfig(flow)!;

  const advice =
    flow === 'morning'
      ? 'Ett mikrosteg räcker. Du behöver inte lösa hela dagen nu.'
      : flow === 'day'
        ? 'Sortera kroppen först — sedan logistik mot ex.'
        : 'Land dagen. Gränser kan vänta till imorgon om det känns tungt.';

  return (
    <div className="elongated-module elongated-module--gold p-4">
      <p className="text-[10px] uppercase tracking-widest text-text-dim">Kompassråd · {meta.label}</p>
      <p className="mt-1 font-display text-base text-accent">{advice}</p>
      <p className="mt-2 text-xs text-text-muted">{meta.heroLead}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {TAGS.map((t) => (
          <span
            key={t.id}
            className="rounded-full border border-accent/25 bg-accent/5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-accent/80"
          >
            {t.label}
          </span>
        ))}
      </div>
    </div>
  );
}
