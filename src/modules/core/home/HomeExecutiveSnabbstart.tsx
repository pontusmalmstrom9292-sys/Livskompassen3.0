import { useNavigate } from 'react-router-dom';
import { ChevronDown, Inbox, Mic, PenLine } from 'lucide-react';
import { clsx } from 'clsx';
import { ExecutiveDecorCompass } from '../ui/executive';
import { useExecutiveHomeChrome } from './ExecutiveHomeChromeContext';
import { HOME_SUPERHUB_ROUTES } from './homeSuperhubRoutes';

const SATELLITES = [
  {
    id: 'note',
    label: 'Anteckning',
    icon: PenLine,
    to: HOME_SUPERHUB_ROUTES.hjartatReflektion,
    side: 'left' as const,
  },
  {
    id: 'voice',
    label: 'Inspelning',
    icon: Mic,
    to: HOME_SUPERHUB_ROUTES.hjartatQuickMirror,
    side: 'right' as const,
  },
];

type Props = {
  className?: string;
};

/** Snabbstart — ihopfällbar; stor kompass i centrum när öppen. */
export function HomeExecutiveSnabbstart({ className }: Props) {
  const navigate = useNavigate();
  const { snabbstartOpen, toggleSnabbstart } = useExecutiveHomeChrome();

  return (
    <section
      className={clsx(
        'exec-snabbstart-hub',
        snabbstartOpen && 'exec-snabbstart-hub--open',
        className,
      )}
      aria-label="Snabbstart"
    >
      <button
        type="button"
        className="exec-snabbstart-hub__toggle min-h-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
        aria-expanded={snabbstartOpen}
        onClick={toggleSnabbstart}
      >
        <span className="exec-snabbstart-hub__toggle-label">Snabbstart</span>
        <ChevronDown
          className={clsx(
            'exec-snabbstart-hub__toggle-chevron',
            snabbstartOpen && 'exec-snabbstart-hub__toggle-chevron--open',
          )}
          strokeWidth={2.25}
          aria-hidden
        />
      </button>

      {snabbstartOpen ? (
        <>
          <div className="exec-snabbstart-hub__stage">
            <div className="exec-snabbstart-hub__glow" aria-hidden />

            {SATELLITES.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={clsx(
                    'exec-snabbstart-hub__satellite min-h-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55',
                    item.side === 'left'
                      ? 'exec-snabbstart-hub__satellite--left'
                      : 'exec-snabbstart-hub__satellite--right',
                  )}
                  onClick={() => navigate(item.to)}
                >
                  <span className="exec-snabbstart-hub__satellite-icon" aria-hidden>
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                  </span>
                  <span className="exec-snabbstart-hub__satellite-label">{item.label}</span>
                </button>
              );
            })}

            <div className="exec-snabbstart-hub__core" aria-hidden>
              <ExecutiveDecorCompass size="lg" className="exec-snabbstart-hub__compass" />
            </div>
          </div>

          <button
            type="button"
            className="exec-snabbstart-hub__inkast min-h-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
            onClick={() => navigate(HOME_SUPERHUB_ROUTES.planeringInkast)}
          >
            <Inbox className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            <span>Inkast</span>
          </button>
        </>
      ) : null}
    </section>
  );
}
