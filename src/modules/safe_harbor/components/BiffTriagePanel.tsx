import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import type { GransAnalysis } from '../api/biffService';

type BiffTriagePanelProps = {
  grans: GransAnalysis;
};

export function BiffTriagePanel({ grans }: BiffTriagePanelProps) {
  const [showBait, setShowBait] = useState(false);
  const hasBait = grans.emotionalBait.length > 0;

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
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[10px] uppercase tracking-widest text-text-dim">
              Känslomässiga beten (90%) — ignorera
            </p>
            {hasBait && (
              <button
                type="button"
                onClick={() => setShowBait((v) => !v)}
                className="btn-pill--ghost flex items-center gap-1 text-[10px] uppercase tracking-widest"
                aria-pressed={showBait}
              >
                {showBait ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {showBait ? 'Dölj brus' : 'Visa brus'}
              </button>
            )}
          </div>
          {hasBait ? (
            <ul className="space-y-2">
              {grans.emotionalBait.map((bait) => (
                <li
                  key={bait}
                  className={showBait ? 'biff-triage-bait--revealed' : 'biff-triage-bait'}
                  title={showBait ? undefined : 'Maskerat — kopiera inte'}
                >
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
