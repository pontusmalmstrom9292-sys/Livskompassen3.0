import { BentoCard } from '../../core/ui/BentoCard';
import type { GransAnalysis } from '../api/biffService';

type BiffTriagePanelProps = {
  grans: GransAnalysis;
};

export function BiffTriagePanel({ grans }: BiffTriagePanelProps) {
  return (
    <BentoCard title="Brusfiltret — triage">
      <div className="grid gap-4 md:grid-cols-2">
        <section aria-label="Logistik tio procent">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-success">
            Logistik (10%)
          </p>
          {grans.cleanFacts.length > 0 ? (
            <ul className="space-y-2">
              {grans.cleanFacts.map((fact) => (
                <li key={fact} className="biff-triage-fact">
                  {fact}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-dim">Ingen ren logistik extraherad — svara kort ändå.</p>
          )}
        </section>

        <section aria-label="Beten nittio procent">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-text-dim">
            Känslomässiga beten (90%) — ignorera
          </p>
          {grans.emotionalBait.length > 0 ? (
            <ul className="space-y-2">
              {grans.emotionalBait.map((bait) => (
                <li key={bait} className="biff-triage-bait" title="Maskerat — kopiera inte">
                  {bait}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-dim">Inga tydliga beten flaggade.</p>
          )}
        </section>
      </div>

      {grans.techniques.length > 0 && (
        <p className="mt-4 text-[10px] uppercase tracking-widest text-text-dim">
          Tekniker: {grans.techniques.join(', ')}
        </p>
      )}
      {grans.coachingNote && (
        <p className="mt-2 text-sm text-text-muted">{grans.coachingNote}</p>
      )}
    </BentoCard>
  );
}
