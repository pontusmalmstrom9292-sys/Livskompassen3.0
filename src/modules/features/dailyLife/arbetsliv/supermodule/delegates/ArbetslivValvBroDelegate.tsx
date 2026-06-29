import { Link } from 'react-router-dom';
import { Shield, Wallet } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { vaultDrawerPath } from '@/core/navigation/navTruth';

function formatNextPaydayLabel(reference = new Date()): string {
  const day = reference.getDate();
  const y = reference.getFullYear();
  const m = reference.getMonth();
  const target = day < 16 ? new Date(y, m, 16) : new Date(y, m + 1, 16);
  return new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'long' }).format(target);
}

/** Fas 14A — PIN-ingångar till frånvaro och lönespec (innehåll i Valv). */
export function ArbetslivValvBroDelegate() {
  const nextPayday = formatNextPaydayLabel();

  return (
    <div className="arbetsliv-delegate arbetsliv-delegate--valv-bro space-y-4">
      <BentoCard title="Lönespec & frånvaro" glow="blue" className="overflow-hidden">
        <p className="mb-3 text-sm text-text-muted">
          Nästa lönespec: <span className="text-text">16 {nextPayday.split(' ').slice(1).join(' ')}</span>
        </p>
        <p className="mb-4 text-xs text-text-dim">
          Sjukanmälan, VAB och full lönespec kräver PIN — öppnas i Valv, inte här.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            to={vaultDrawerPath('arbetsliv_lon')}
            className="ds-btn ds-btn--ghost inline-flex items-center gap-2 text-xs"
          >
            <Wallet className="h-3.5 w-3.5 text-accent-secondary" aria-hidden />
            Lönespec i Valv
          </Link>
          <Link
            to={vaultDrawerPath('arbetsliv_franvaro')}
            className="ds-btn ds-btn--ghost inline-flex items-center gap-2 text-xs"
          >
            <Shield className="h-3.5 w-3.5 text-accent-secondary" aria-hidden />
            Frånvaro i Valv
          </Link>
        </div>
      </BentoCard>
    </div>
  );
}
