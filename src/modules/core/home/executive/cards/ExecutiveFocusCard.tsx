import { useNavigate } from 'react-router-dom';
import { ChevronRight, Target } from 'lucide-react';
import { useLifeHubPreset } from '@/core/lifeOs';

const FOCUS_PILLS = [
  { id: 'barnfokus', label: 'Barnfokus', active: true },
  { id: 'ny-stund', label: 'Ny stund', active: false },
  { id: 'fysiologi', label: 'Fysiologi', active: false },
  { id: 'mer', label: 'Mer…', active: false },
] as const;

export function ExecutiveFocusCard() {
  const navigate = useNavigate();
  const { preset } = useLifeHubPreset();

  return (
    <article className="calm-card exec-home-card exec-home-card--focus">
      <header className="exec-home-card__head">
        <Target className="h-4 w-4 text-accent" strokeWidth={1.5} />
        <p className="exec-home-label mb-0">DAGENS FOKUS</p>
      </header>
      <h3 className="mt-2 font-display-serif text-base tracking-wide text-accent-light">
        {preset.label.includes('Barn') ? 'Barnfokus' : preset.label}
      </h3>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {FOCUS_PILLS.map((pill) => (
          <button
            key={pill.id}
            type="button"
            aria-selected={pill.active}
            className={
              pill.active
                ? 'exec-home-pill exec-home-pill--active min-h-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55'
                : 'exec-home-pill min-h-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55'
            }
            onClick={() => navigate('/familjen?tab=reflektion')}
          >
            {pill.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="exec-home-card__footer-link mt-auto min-h-11 pt-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
        onClick={() => navigate('/familjen?tab=barnfokus')}
        aria-label="Lär känna — öppna Barnfokus"
      >
        Lär känna
        <ChevronRight className="h-3 w-3" strokeWidth={2} aria-hidden />
      </button>
    </article>
  );
}
