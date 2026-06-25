import { useNavigate } from 'react-router-dom';
import { ChevronRight, Target } from 'lucide-react';
import { clsx } from 'clsx';
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
            className={clsx(
              'btn-pill--ghost px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider',
              pill.active && 'border-accent/40 bg-accent/10 text-accent',
            )}
            onClick={() => navigate('/familjen?tab=reflektion')}
          >
            {pill.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="exec-home-card__footer-link mt-auto pt-3"
        onClick={() => navigate('/familjen?tab=barnfokus')}
      >
        Lär känna
        <ChevronRight className="h-3 w-3" strokeWidth={2} aria-hidden />
      </button>
    </article>
  );
}
