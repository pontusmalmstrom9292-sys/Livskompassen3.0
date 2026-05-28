import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import type { PlaneringHubModule } from '../planeringHubModules';

const toneClass = {
  gold: 'planering-tool-card--gold',
  emerald: 'planering-tool-card--emerald',
  indigo: 'planering-tool-card--indigo',
  lavender: 'planering-tool-card--lavender',
  amber: 'planering-tool-card--amber',
  rose: 'planering-tool-card--rose',
} as const;

type Props = {
  module: PlaneringHubModule;
  className?: string;
  size?: 'default' | 'compact' | 'hero' | 'tile' | 'chip';
};

export function PlaneringHubModuleCard({
  module,
  className,
  size = 'default',
}: Props) {
  const Icon = module.icon;
  const body = (
    <>
      <span className="planering-tool-card__emoji" aria-hidden>
        {module.emoji}
      </span>
      <span className="planering-tool-card__icon-wrap" aria-hidden>
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </span>
      <span className="planering-tool-card__title">{module.title}</span>
      <span className="planering-tool-card__lead">{module.lead}</span>
      {module.badge ? (
        <span className="planering-tool-card__badge">{module.badge}</span>
      ) : null}
    </>
  );

  const cardClass = clsx(
    'planering-tool-card',
    toneClass[module.tone],
    size === 'compact' && 'planering-tool-card--compact',
    size === 'hero' && 'planering-tool-card--hero',
    size === 'tile' && 'planering-tool-card--tile',
    size === 'chip' && 'planering-tool-card--chip',
    module.soon && 'planering-tool-card--soon',
    className,
  );

  if (module.soon) {
    return (
      <div className={cardClass} aria-disabled>
        {body}
      </div>
    );
  }

  return (
    <Link to={module.to} className={cardClass}>
      {body}
    </Link>
  );
}
