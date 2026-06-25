import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { usePlanningTasks } from '@/features/admin/planning/hooks/usePlanningTasks';
import { homeStepLabel, pickHomeDaySteps } from '@/features/admin/planning/utils/pickHomeDaySteps';
import { HOME_SUPERHUB_ROUTES } from '../homeSuperhubRoutes';

type TabId = 'handling' | 'projekt' | 'inkorg';

const TABS: { id: TabId; label: string }[] = [
  { id: 'handling', label: 'Handling' },
  { id: 'projekt', label: 'Projekt' },
  { id: 'inkorg', label: 'Inkorg' },
];

export function ExecutivePlaneringCard() {
  const [tab, setTab] = useState<TabId>('handling');
  const { tasks, loading } = usePlanningTasks();
  const steps = useMemo(() => pickHomeDaySteps(tasks, 3), [tasks]);

  return (
    <article className="exec-home-card exec-home-card--planering">
      <header className="exec-home-card__head">
        <CalendarDays className="h-4 w-4 text-accent" strokeWidth={1.5} />
        <p className="exec-home-label mb-0">PLANERING</p>
      </header>

      <div className="exec-planering-tabs mt-3" role="tablist" aria-label="Planering">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={clsx('exec-planering-tabs__tab', tab === t.id && 'exec-planering-tabs__tab--active')}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4 min-h-[4.5rem]">
        {tab === 'handling' ? (
          <>
            <p className="mb-2 text-[10px] uppercase tracking-wider text-text-dim">Dagens uppgifter</p>
            {loading ? (
              <p className="flex items-center gap-2 text-xs text-text-muted">
                <Loader2 className="h-3 w-3 animate-spin" />
                Laddar…
              </p>
            ) : steps.length === 0 ? (
              <p className="text-xs text-text-dim">Inga öppna uppgifter idag.</p>
            ) : (
              <ul className="space-y-2">
                {steps.map((task) => (
                  <li key={task.id} className="text-xs text-text-muted">
                    {homeStepLabel(task)}
                  </li>
                ))}
              </ul>
            )}
            <Link
              to={HOME_SUPERHUB_ROUTES.planeringHub}
              className="mt-3 inline-block text-[10px] font-semibold uppercase tracking-wider text-accent"
            >
              Visa allt i Planering
            </Link>
          </>
        ) : null}

        {tab === 'projekt' ? (
          <div className="space-y-2">
            <p className="text-xs text-text-muted">Projektlistor, anteckningar och bilder.</p>
            <Link to="/projekt" className="exec-home-btn exec-home-btn--primary inline-flex">
              Öppna Projekt
            </Link>
          </div>
        ) : null}

        {tab === 'inkorg' ? (
          <div className="space-y-2">
            <p className="text-xs text-text-muted">Fånga tankar och inkast till Planering.</p>
            <Link
              to={HOME_SUPERHUB_ROUTES.planeringInkast}
              className="exec-home-btn exec-home-btn--primary inline-flex"
            >
              Öppna Inkorg
            </Link>
          </div>
        ) : null}
      </div>
    </article>
  );
}
