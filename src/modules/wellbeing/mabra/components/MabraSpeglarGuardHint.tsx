import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { MABRA_SPEGLAR_GUARD_COPY } from '../constants';

type Props = {
  className?: string;
  onStay: () => void;
};

/** Guld hint — Speglar erbjuds utan auto-redirect (Fas 2 §5). */
export function MabraSpeglarGuardHint({ className = '', onStay }: Props) {
  const stayRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    stayRef.current?.focus();
  }, []);

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
        <button
          ref={stayRef}
          type="button"
          onClick={onStay}
          className="btn-pill--secondary text-sm"
        >
          {MABRA_SPEGLAR_GUARD_COPY.stayLabel}
        </button>
        <Link to="/speglar" className="btn-pill--ghost text-sm">
          {MABRA_SPEGLAR_GUARD_COPY.goLabel}
        </Link>
      </div>
    </aside>
  );
}
