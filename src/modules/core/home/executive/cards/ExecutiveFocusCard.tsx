import { useNavigate } from 'react-router-dom';
import { Target } from 'lucide-react';
import { useLifeHubPreset } from '@/core/lifeOs';

const FOCUS_PILLS = [
  { id: 'barnfokus', label: 'Barnfokus', active: true },
  { id: 'ny-stund', label: 'Ny stund', active: false },
  { id: 'fysiologi', label: 'Fysiologi', active: false },
] as const;

export function ExecutiveFocusCard() {
  const navigate = useNavigate();
  const { preset } = useLifeHubPreset();

  return (
    <article className="exec-home-card exec-home-card--focus">
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
            className={
              pill.active
                ? 'exec-home-pill exec-home-pill--active'
                : 'exec-home-pill'
            }
            onClick={() => navigate('/familjen?tab=reflektion')}
          >
            {pill.label}
          </button>
        ))}
      </div>
    </article>
  );
}
