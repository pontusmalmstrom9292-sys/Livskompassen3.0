import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { getDefaultCompassByTime, type CompassFlow } from '@/features/dailyLife/wellbeing/compasses/utils/compassTime';
import { NAV_PATHS } from '@/core/navigation/navTruth';

const FLOW_LABELS: Record<CompassFlow, string> = {
  morning: 'Morgon',
  day: 'Dag',
  evening: 'Kväll',
};

const FLOW_LEAD: Record<CompassFlow, string> = {
  morning: 'Starta dagen med intention.',
  day: 'Fokus och framsteg.',
  evening: 'Reflektera och varva ner.',
};

/** Kompakt visuell kompass-widget för dashboard. */
export function VisualCompassWidget() {
  const flow = getDefaultCompassByTime();
  const label = FLOW_LABELS[flow];
  const lead = FLOW_LEAD[flow];

  return (
    <Link
      to={NAV_PATHS.VARDAGEN}
      className="visual-compass-widget bento-card bento-card--gold group block rounded-2xl p-4 transition-opacity hover:opacity-90"
      aria-label={`Kompass — ${label}`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <Compass className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-text-dim">Kompass</p>
          <p className="truncate font-medium text-text">{label}</p>
          <p className="mt-0.5 text-xs text-text-muted">{lead}</p>
        </div>
      </div>
    </Link>
  );
}
