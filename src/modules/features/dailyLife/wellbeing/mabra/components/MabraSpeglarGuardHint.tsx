import { Sparkles } from 'lucide-react';
import { Button, ButtonLink } from '@/design-system';
import { hjartatTabHref } from '@/core/navigation/appNavigation';
import { MABRA_SPEGLAR_GUARD_COPY } from '../constants';

type Props = {
  className?: string;
  onStay: () => void;
};

/** Guld hint — Speglar erbjuds utan auto-redirect (Fas 2 §5). */
export function MabraSpeglarGuardHint({ className = '', onStay }: Props) {
  return (
    <aside
      className={`rounded-xl border border-accent/35 bg-accent/8 p-3 ${className}`.trim()}
      role="note"
      aria-label={MABRA_SPEGLAR_GUARD_COPY.ariaLabel}
    >
      <div className="flex items-start gap-2">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
        <p className="text-sm leading-relaxed text-text-muted">{MABRA_SPEGLAR_GUARD_COPY.message}</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          autoFocus
          variant="secondary"
          className="min-h-11 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          onClick={onStay}
        >
          {MABRA_SPEGLAR_GUARD_COPY.stayLabel}
        </Button>
        <ButtonLink
          to={hjartatTabHref('speglar')}
          variant="ghost"
          className="min-h-11 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          {MABRA_SPEGLAR_GUARD_COPY.goLabel}
        </ButtonLink>
      </div>
    </aside>
  );
}
