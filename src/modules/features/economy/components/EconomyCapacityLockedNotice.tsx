import { Lock, Sparkles } from 'lucide-react';
import { useCapacityScore } from '@/core/store/useCapacityGate';

type EconomyCapacityLockedNoticeProps = {
  featureLabel?: string;
  compact?: boolean;
};

/** Informerar om att avancerade ekonomiverktyg är låsta p.g.a. kapacitet. */
export function EconomyCapacityLockedNotice({
  featureLabel = 'Avancerade ekonomiverktyg',
  compact = false,
}: EconomyCapacityLockedNoticeProps) {
  const capacityScore = useCapacityScore();
  const scorePercentage = Math.round(capacityScore * 100);

  if (compact) {
    return (
      <div className="rounded-xl border border-border/50 bg-surface-3/50 p-4 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-surface-3 text-accent border border-border/40">
          <Lock className="h-5 w-5" />
        </div>
        <p className="mt-3 text-sm font-medium text-text">{featureLabel} är tillfälligt låsta</p>
        <p className="mt-1 text-xs text-text-muted leading-relaxed">
          Låses upp när din kapacitetsnivå är stabil ({scorePercentage}% nu).
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface-2 p-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-3 text-accent border border-border">
        <Lock className="h-7 w-7" />
      </div>
      <h2 className="mt-5 font-display-serif text-xl text-accent tracking-wide">
        {featureLabel} låsta
      </h2>
      <p className="mt-2 text-sm text-text-muted leading-relaxed">
        Verktygen låses upp automatiskt när din kapacitetsnivå är stabil — för att undvika
        kognitiv överbelastning vid ekonomiska beslut.
      </p>

      <div className="mt-5 rounded-lg bg-surface-3 p-4 border border-border/50 text-left">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-text-muted">
          <span>Aktuell kapacitet</span>
          <span className="text-accent">{scorePercentage}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent/50 to-accent transition-all duration-500"
            style={{ width: `${scorePercentage}%` }}
          />
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-text-muted">
          <Sparkles className="h-3.5 w-3.5 text-accent-secondary shrink-0" />
          Gör dagliga Mabra-incheckningar för att öka din kognitiva kapacitet.
        </p>
      </div>
    </div>
  );
}
