import { BentoCard } from '@/shared/ui/BentoCard';
import { getCompassAdvice, getCompassFlowMeta } from '../utils/compassAdvice';

const TAGS = [
  { id: 'biff', label: 'BIFF' },
  { id: 'no-jade', label: 'Ingen JADE' },
  { id: 'parallel', label: 'Parallellt föräldraskap' },
] as const;

/** D3 — dagens kompassråd + taggar (Hamn/Hem). */
export function KompassradPanel() {
  const meta = getCompassFlowMeta();
  const advice = getCompassAdvice(meta.flow);

  return (
    <BentoCard
      glow="gold"
      depth
      noHover
      className="rounded-[14px] border-[2px] border-accent/30 !p-4"
    >
      <p className="font-display-serif text-[10px] uppercase tracking-[0.2em] text-text-dim">
        Kompassråd · {meta.label}
      </p>
      <p className="mt-1 font-display-serif text-base tracking-wide text-accent">{advice}</p>
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
    </BentoCard>
  );
}
