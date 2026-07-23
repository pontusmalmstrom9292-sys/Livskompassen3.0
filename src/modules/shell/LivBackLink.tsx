import { ChevronLeft } from 'lucide-react';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import { ButtonLink } from '@/design-system';

/** Tillbaka till Liv-launchern från fullsid-moduler. */
export function LivBackLink() {
  return (
    <ButtonLink to={NAV_PATHS.VARDAGEN} variant="ghost" className="--ghost inline-flex shrink-0 items-center gap-1 text-xs text-text-muted hover:text-accent min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
      <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
      Liv och göra
    </ButtonLink>
  );
}
