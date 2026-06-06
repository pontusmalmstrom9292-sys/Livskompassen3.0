import { Link } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import { VALV_SAMLA_GRANSKA_LINK } from '../api/inkastService';

type Props = {
  compact?: boolean;
  className?: string;
};

/** Canonical länk till granskningskö — EN mount i VaultSamlaHub. */
export function InboxReviewQueueLink({ compact = false, className = '' }: Props) {
  return (
    <div
      className={`rounded-xl border border-border/30 bg-surface-2/50 px-4 py-3 ${compact ? 'text-xs' : 'text-sm'} ${className}`}
    >
      <p className="flex items-center gap-2 text-text-muted">
        <Inbox className="h-3.5 w-3.5 shrink-0 text-accent/80" aria-hidden />
        <span>
          G10-granskning sker i{' '}
          <Link
            to={VALV_SAMLA_GRANSKA_LINK}
            className="font-medium text-accent underline-offset-2 hover:underline"
          >
            Valv → Samla → granskningskö
          </Link>
          .
        </span>
      </p>
    </div>
  );
}
