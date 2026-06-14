import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, PenLine } from 'lucide-react';
import { HOME_SUPERHUB_ROUTES } from '../homeSuperhubRoutes';

/** Hem — bro till Superdagbok (ingen duplicerad journal-form). */
export function HomeDagbokPanel() {
  return (
    <div className="home-module-panel space-y-4">
      <p className="home-module-panel__lead">
        Skriv i Superdagbok — reflektion, snabb spegling eller minneslista på ett ställe.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Link
          to={HOME_SUPERHUB_ROUTES.hjartatQuickMirror}
          className="btn-pill--accent inline-flex items-center justify-center gap-2"
        >
          <PenLine className="h-4 w-4" aria-hidden />
          Snabb spegling
        </Link>
        <Link
          to={HOME_SUPERHUB_ROUTES.hjartatReflektion}
          className="btn-pill--ghost inline-flex items-center justify-center gap-2"
        >
          <BookOpen className="h-4 w-4" aria-hidden />
          Reflektera steg för steg
        </Link>
      </div>
      <Link
        to={HOME_SUPERHUB_ROUTES.hjartatArkiv}
        className="inline-flex items-center gap-1 text-xs text-text-dim hover:text-accent"
      >
        Minneslista
        <ArrowRight className="h-3 w-3" aria-hidden />
      </Link>
    </div>
  );
}
