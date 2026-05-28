import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { PLANERING_TOOLS } from '../planeringHubConfig';

const toneClass = {
  gold: 'planering-tool-card--gold',
  emerald: 'planering-tool-card--emerald',
  indigo: 'planering-tool-card--indigo',
  lavender: 'planering-tool-card--lavender',
} as const;

/** Verktygsväljare — default på /planering (inte låst till kanban). */
export function PlaneringHub() {
  return (
    <div className="planering-hub">
      <p className="planering-hub__hint">
        Tänk som en låda med verktyg: lista i affären, uppgifter, projekt — du väljer.
      </p>
      <div className="planering-hub__grid">
        {PLANERING_TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isExternal =
            tool.id === 'projekt' || tool.id === 'nytt-projekt';
          const className = clsx(
            'planering-tool-card',
            toneClass[tool.tone],
          );

          const inner = (
            <>
              <span className="planering-tool-card__emoji" aria-hidden>
                {tool.emoji}
              </span>
              <span className="planering-tool-card__icon-wrap" aria-hidden>
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <span className="planering-tool-card__title">{tool.title}</span>
              <span className="planering-tool-card__lead">{tool.lead}</span>
              {tool.badge && (
                <span className="planering-tool-card__badge">{tool.badge}</span>
              )}
            </>
          );

          if (isExternal) {
            return (
              <Link key={tool.id} to={tool.to} className={className}>
                {inner}
              </Link>
            );
          }

          return (
            <Link key={tool.id} to={tool.to} className={className}>
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
