import { Link } from 'react-router-dom';
import type { CompassFlow } from '../utils/compassTime';
import { getCompassWidgets } from '../config/compassWidgetCatalog';
import './compasses.css';

type Props = {
  flow: CompassFlow;
  /** Kompakt rad även när modulen är collapsed */
  compact?: boolean;
  className?: string;
};

/** Horisontell snabbstart under respektive Morgon / Dag / Kväll. */
export function CompassQuickWidgetRail({ flow, compact = false, className }: Props) {
  const widgets = getCompassWidgets(flow);

  if (widgets.length === 0) {
    return null;
  }

  return (
    <div
      className={['compass-quick-widget-rail', compact && 'compass-quick-widget-rail--compact', className]
        .filter(Boolean)
        .join(' ')}
      aria-label={`Snabbstart ${flow}`}
    >
      <p className="compass-quick-widget-rail__label">Snabbstart</p>
      <div className="compass-quick-widget-rail__scroll" role="list">
        {widgets.map((w) => (
          <Link
            key={w.id}
            to={w.href}
            className="compass-quick-widget-rail__chip min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            role="listitem"
            title={w.siloNote}
          >
            {w.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
