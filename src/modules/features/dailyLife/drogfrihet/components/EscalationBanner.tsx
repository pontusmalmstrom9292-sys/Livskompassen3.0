/** @locked MOD-FAM-DROG — låst modul; unlock via docs/evaluations/*-unlock-MOD-FAM-DROG.md */
import { BentoCard } from '@/shared/ui/BentoCard';
import { ESCALATION_COPY } from '../content/aterfallContent';

const ESCALATION_THRESHOLD = 3;

type Props = {
  sosCount7d: number;
};

export function EscalationBanner({ sosCount7d }: Props) {
  if (sosCount7d < ESCALATION_THRESHOLD) return null;

  return (
    <BentoCard title={ESCALATION_COPY.title} glow="green">
      <p className="text-sm text-text-muted">{ESCALATION_COPY.lead}</p>
      <p className="mt-2 text-xs text-text-muted">{ESCALATION_COPY.hint}</p>
      <div className="mt-3 flex flex-wrap gap-3 text-sm">
        <a href="https://www.1177.se" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-accent underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55">
          1177
        </a>
        <a href="tel:020919191" className="inline-flex min-h-11 items-center text-accent underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55">
          Droghjälpen
        </a>
        <a href="tel:90101" className="inline-flex min-h-11 items-center text-accent underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55">
          90101
        </a>
        <a href="tel:112" className="inline-flex min-h-11 items-center text-danger underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger/55">
          112
        </a>
      </div>
    </BentoCard>
  );
}

export { ESCALATION_THRESHOLD };
