import { AlertTriangle, Shield } from 'lucide-react';
import type { GransAnalysis } from '../api/biffService';

type Props = {
  grans: GransAnalysis | null;
  riskScore: number | null;
  hitlRequired: boolean;
  agentName: string | null;
};

function riskTone(score: number | null): string {
  if (score == null) return 'text-text-dim';
  if (score >= 0.7) return 'text-danger';
  if (score >= 0.4) return 'text-accent';
  return 'text-text-muted';
}

/** D15 — BIFF-triage (logistik vs känslomässigt bete). */
export function BiffTriagePanel({ grans, riskScore, hitlRequired, agentName }: Props) {
  if (!grans && riskScore == null) return null;

  const factCount = grans?.cleanFacts?.length ?? 0;
  const baitCount = grans?.emotionalBait?.length ?? 0;
  const total = factCount + baitCount || 1;
  const logisticsPct = Math.round((factCount / total) * 100) || 10;
  const baitPct = 100 - logisticsPct;

  return (
    <div className="elongated-module elongated-module--gold space-y-3 p-4">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-accent" aria-hidden />
        <p className="text-sm font-medium text-text">BIFF-triage</p>
        {agentName && (
          <span className="ml-auto text-[10px] uppercase tracking-widest text-text-dim">
            {agentName}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 text-center text-xs">
        <div className="glass-card p-2">
          <p className="text-text-dim">Ren logistik (~)</p>
          <p className="text-lg font-display text-accent">{logisticsPct}%</p>
        </div>
        <div className="glass-card p-2">
          <p className="text-text-dim">Känslomässigt bete (~)</p>
          <p className="text-lg font-display text-text-muted">{baitPct}%</p>
        </div>
      </div>
      {riskScore != null && (
        <p className={`text-xs ${riskTone(riskScore)}`}>
          Riskindikator (DCAP): {riskScore}%
          {hitlRequired ? ' · granska manuellt innan svar' : ''}
        </p>
      )}
      {hitlRequired && (
        <p className="flex items-start gap-2 text-xs text-danger">
          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
          Hög belastning — svara kort eller vänta. Ingen JADE.
        </p>
      )}
      {grans?.coachingNote && (
        <p className="text-sm text-text-muted whitespace-pre-wrap">{grans.coachingNote}</p>
      )}
    </div>
  );
}
