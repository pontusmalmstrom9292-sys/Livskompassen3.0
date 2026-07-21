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
      className={`valv-worm-stamp${compact ? ' valv-worm-stamp--compact' : ''}`}
      role="note"
      aria-label="Oföränderligt WORM-bevis"
    >
      <Lock className="valv-worm-stamp__icon" size={compact ? 11 : 12} aria-hidden />
      <div className="min-w-0">
        <p className="valv-log-stamp">
          WORM · SERVER-TIDSSTÄMPEL · {formatStampDate(createdAt)}
        </p>
        {!compact ? (
          <p className="valv-worm-stamp__disclaimer">{VALV_WORM_EVIDENCE_DISCLAIMER}</p>
        ) : null}
      </div>
    </div>
  );
}
