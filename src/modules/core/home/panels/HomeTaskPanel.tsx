import { ClipboardList, Zap } from 'lucide-react';
import { ButtonLink } from '@/design-system';
import { ParalysPanel } from '@/features/dailyLife/wellbeing/compasses/components/ParalysPanel';
import { MICRO_STEP_PANEL_TITLE } from '@/core/copy/compassWidgetLabels';
import { HOME_SUPERHUB_ROUTES } from '../homeSuperhubRoutes';

export function HomeTaskPanel() {
  return (
    <div className="home-module-panel home-module-panel--fokus space-y-4">
      <p className="home-module-panel__lead">
        Ett steg i taget — antingen en snabb uppgift i Planering eller {MICRO_STEP_PANEL_TITLE.toLowerCase()} här.
      </p>
      <ButtonLink
        to={HOME_SUPERHUB_ROUTES.planeringTask}
        className="inline-flex w-full items-center justify-center gap-2 sm:w-auto min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        <ClipboardList className="h-4 w-4" aria-hidden />
        Snabb uppgift i Planering
      </ButtonLink>
      <div className="home-module-panel__well rounded-xl border border-border/30 bg-surface-2/50 p-3">
        <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-wider text-text-muted">
          <Zap className="h-3.5 w-3.5 text-accent/70" aria-hidden />
          {MICRO_STEP_PANEL_TITLE}
        </p>
        <ParalysPanel onDone={() => undefined} />
      </div>
    </div>
  );
}
