import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, PenLine } from 'lucide-react';
import { ButtonLink } from '@/design-system';
import { HOME_SUPERHUB_ROUTES } from '../homeSuperhubRoutes';

/** Hem — bro till Superdagbok (ingen duplicerad journal-form). */
export function HomeDagbokPanel() {
  return (
    <div className="home-module-panel home-module-panel--dagbok space-y-4">
      <p className="home-module-panel__lead">
        Skriv i Superdagbok — reflektion, snabb spegling eller minneslista på ett ställe.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <ButtonLink
          to={HOME_SUPERHUB_ROUTES.hjartatQuickMirror}
          className="inline-flex items-center justify-center gap-2 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          <PenLine className="h-4 w-4" aria-hidden />
          Snabb spegling
        </ButtonLink>
        <ButtonLink
          to={HOME_SUPERHUB_ROUTES.hjartatReflektion}
          variant="ghost"
          className="inline-flex items-center justify-center gap-2 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          <BookOpen className="h-4 w-4" aria-hidden />
          Reflektera steg för steg
        </ButtonLink>
      </div>
      <Link
        to={HOME_SUPERHUB_ROUTES.hjartatArkiv}
        className="inline-flex min-h-11 items-center gap-1 text-xs text-text-muted transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50"
      >
        Minneslista
        <ArrowRight className="h-3 w-3" aria-hidden />
      </Link>
    </div>
  );
}
