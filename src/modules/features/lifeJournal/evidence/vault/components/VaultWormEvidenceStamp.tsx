import { Lock } from 'lucide-react';
import { VALV_WORM_EVIDENCE_DISCLAIMER } from '../constants/valvEvidenceCopy';

type Props = {
  createdAt?: string | null;
  /** Dölj förklarande rad (t.ex. i kompakt listrad). */
  compact?: boolean;
};

function formatStampDate(createdAt: string | null | undefined): string {
  if (typeof createdAt === 'string') return createdAt.slice(0, 19).replace('T', ' ');
  if (createdAt == null) return '—';
  return String(createdAt).slice(0, 19).replace('T', ' ');
}

/** WORM evidence stamp — server-tidsstämpel + oföränderlighetsmarkör. */
export function VaultWormEvidenceStamp({ createdAt, compact = false }: Props) {
  return (
    <div
      className={`valv-worm-stamp${compact ? ' valv-worm-stamp--compact' : ''} rounded-lg border border-accent/25 bg-accent/5 px-2.5 py-1.5`}
      role="note"
      aria-label="Oföränderligt WORM-bevis"
    >
      <Lock className="valv-worm-stamp__icon shrink-0 text-accent" size={compact ? 12 : 14} aria-hidden />
      <div className="min-w-0">
        <p className="valv-log-stamp text-[11px] font-medium tracking-wide text-accent-light">
          WORM · SERVER-TIDSSTÄMPEL · {formatStampDate(createdAt)}
        </p>
        {!compact ? (
          <p className="valv-worm-stamp__disclaimer mt-0.5 text-[10px] leading-snug text-text-dim">
            {VALV_WORM_EVIDENCE_DISCLAIMER}
          </p>
        ) : null}
      </div>
    </div>
  );
}
