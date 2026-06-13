import { useState } from 'react';
import { ElongatedModule } from '@/core/ui/ElongatedModule';
import type { ElongatedModuleTone } from '@/core/ui/ElongatedModule';
import { COMPASS_FLOWS, EVENING_HERO } from '../config/compassFlows';
import type { CompassFlow } from '../utils/compassTime';
import { getDefaultCompassByTime } from '../utils/compassTime';
import {
  COMPASS_FLOW_TIME_ICON,
  COMPASS_TIME_ICON_SRC,
} from '../config/compassTimeIcons';
import { DashboardPage } from './DashboardPage';
import { CompassQuickWidgetRail } from './CompassQuickWidgetRail';

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
      {ALL_FLOWS.map((flow) => {
        const isExpanded = expanded === flow.id;
        const showRail = isExpanded || timeFlow === flow.id;
        const { iconId } = COMPASS_FLOW_TIME_ICON[flow.id];
        const timeIconSrc = COMPASS_TIME_ICON_SRC[iconId];
        return (
          <div key={flow.id} className="compass-module-block">
            <ElongatedModule
              id={`compass-module-${flow.id}`}
              title={flow.label}
              lead={flow.lead}
              icon={flow.icon}
              timeIconSrc={timeIconSrc}
              tone={FLOW_TONE[flow.id]}
              recommended={timeFlow === flow.id}
              expanded={isExpanded}
              onToggle={() => toggle(flow.id)}
            >
              {showRail ? <CompassQuickWidgetRail flow={flow.id} className="compass-quick-widget-rail--in-module" /> : null}
              <DashboardPage
                variant="module"
                forcedFlow={flow.id}
                onCheckInSaved={onCheckInSaved}
              />
            </ElongatedModule>
            {showRail && !isExpanded ? (
              <CompassQuickWidgetRail flow={flow.id} compact className="compass-quick-widget-rail--below" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
