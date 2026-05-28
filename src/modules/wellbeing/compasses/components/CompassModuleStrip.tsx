import { useState } from 'react';
import { ElongatedModule } from '../../../core/ui/ElongatedModule';
import type { ElongatedModuleTone } from '../../../core/ui/ElongatedModule';
import { COMPASS_FLOWS, EVENING_HERO } from '../config/compassFlows';
import type { CompassFlow } from '../utils/compassTime';
import { getDefaultCompassByTime } from '../utils/compassTime';
import { DashboardPage } from './DashboardPage';

const FLOW_TONE: Record<CompassFlow, ElongatedModuleTone> = {
  morning: 'gold',
  day: 'emerald',
  evening: 'lavender',
};

const ALL_FLOWS: {
  id: CompassFlow;
  label: string;
  lead: string;
  icon: (typeof COMPASS_FLOWS)[0]['icon'];
}[] = [
  ...COMPASS_FLOWS.map((f) => ({
    id: f.id,
    label: f.heroTitle,
    lead: f.heroLead,
    icon: f.icon,
  })),
  {
    id: 'evening',
    label: EVENING_HERO.heroTitle,
    lead: EVENING_HERO.heroLead,
    icon: EVENING_HERO.icon,
  },
];

type Props = {
  onCheckInSaved?: () => void;
};

/** Tre avlånga kompassmoduler — en expanderad i taget. */
export function CompassModuleStrip({ onCheckInSaved }: Props) {
  const timeFlow = getDefaultCompassByTime();
  const [expanded, setExpanded] = useState<CompassFlow | null>(timeFlow);

  const toggle = (id: CompassFlow) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  return (
    <div className="home-module-stack" aria-label="Kompasser">
      {ALL_FLOWS.map((flow) => (
        <ElongatedModule
          key={flow.id}
          id={`compass-module-${flow.id}`}
          title={flow.label}
          lead={flow.lead}
          icon={flow.icon}
          tone={FLOW_TONE[flow.id]}
          recommended={timeFlow === flow.id}
          expanded={expanded === flow.id}
          onToggle={() => toggle(flow.id)}
        >
          <DashboardPage
            variant="module"
            forcedFlow={flow.id}
            onCheckInSaved={onCheckInSaved}
          />
        </ElongatedModule>
      ))}
    </div>
  );
}
