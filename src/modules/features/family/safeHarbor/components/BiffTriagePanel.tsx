import { useState } from 'react';
import { AlertTriangle, Eye, EyeOff, Shield } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import type { GransAnalysis } from '../api/biffService';
import { TheoryWithoutEvidenceBadge } from '@/shared/ui/TheoryWithoutEvidenceBadge';

type Props = {
  grans: GransAnalysis | null;
  riskScore: number | null;
  hitlRequired: boolean;
  agentName: string | null;
  theoryWithoutEvidence?: boolean;
};

function riskTone(score: number | null): string {
  if (score == null) return 'text-text-dim';
  const normalized = score > 1 ? score / 100 : score;
  if (normalized >= 0.7) return 'text-danger';
  if (normalized >= 0.4) return 'text-accent';
  return 'text-text-muted';
}

/** D15 — BIFF-triage (logistik vs känslomässigt bete) + Visa brus (I2, archive/inkorg-broar). */
export function BiffTriagePanel({
  grans,
  riskScore,
  hitlRequired,
  agentName,
  theoryWithoutEvidence = false,
}: Props) {
  const [showBait, setShowBait] = useState(false);

  if (!grans && riskScore == null) return null;

  const factCount = grans?.cleanFacts?.length ?? 0;
  const baitCount = grans?.emotionalBait?.length ?? 0;
  const total = factCount + baitCount || 1;
  const logisticsPct = Math.round((factCount / total) * 100) || 10;
  const baitPct = 100 - logisticsPct;
  const hasBait = baitCount > 0;

  return (
    <BentoCard glow="indigo" title="BIFF-triage" icon={<Shield className="h-4 w-4" />} className="!p-4">
      {agentName && (
        <p className="-mt-2 mb-3 text-right text-[10px] uppercase tracking-widest text-text-dim">
          {agentName}
        </p>
      )}
      {theoryWithoutEvidence && <TheoryWithoutEvidenceBadge className="mb-3" variant="hamn" />}
      <div className="grid grid-cols-2 gap-2 text-center text-xs">
        <div className="rounded-xl border border-border/30 bg-surface-2/40 p-2">
          <p className="text-text-dim">Ren logistik (~)</p>
          <p className="text-lg font-display text-accent">{logisticsPct}%</p>
        </div>
        <div className="rounded-xl border border-border/30 bg-surface-2/40 p-2">
          <p className="text-text-dim">Känslomässigt bete (~)</p>
          <p className="text-lg font-display text-text-muted">{baitPct}%</p>
        </div>
      </div>

      {grans && (factCount > 0 || hasBait) && (
        <div className="mt-3 grid gap-3 border-t border-border/30 pt-3 md:grid-cols-2">
          <section aria-label="Logistik">
            <p className="mb-2 text-[10px] uppercase tracking-widest text-success">Logistik</p>
            {factCount > 0 ? (
              <ul className="space-y-2">
                {grans.cleanFacts.map((fact) => (
                  <li key={fact} className="biff-triage-fact">
                    {fact}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-dim">Ingen ren logistik extraherad.</p>
            )}
          </section>
          <section aria-label="Känslomässiga beten">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[10px] uppercase tracking-widest text-text-dim">Beten — ignorera</p>
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
      )}

      {riskScore != null && (
        <p className={`mt-3 text-xs ${riskTone(riskScore)}`}>
          Riskindikator (DCAP): {riskScore}%
          {hitlRequired ? ' · granska manuellt innan svar' : ''}
        </p>
      )}
      {hitlRequired && (
        <p className="mt-2 flex items-start gap-2 text-xs text-text-muted">
          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-accent" aria-hidden />
          Hög belastning — svara kort eller vänta. Ingen JADE.
        </p>
      )}
      {grans?.coachingNote && (
        <p className="mt-2 text-sm text-text-muted whitespace-pre-wrap">{grans.coachingNote}</p>
      )}
    </BentoCard>
  );
}
