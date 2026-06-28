import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { NAV_PATHS } from '@/core/navigation/navTruth';

/** Tillbaka till Liv-launchern från fullsid-moduler. */
export function LivBackLink() {
  return (
    <Link
      to={NAV_PATHS.VARDAGEN}
      className="ds-btn ds-btn--ghost inline-flex shrink-0 items-center gap-1 text-xs text-text-muted hover:text-accent"
    >
      <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
      Liv och göra
    </Link>
  );
}
