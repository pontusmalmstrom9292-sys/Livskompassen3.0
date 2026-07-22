import { useState } from 'react';
import { Anchor, Compass } from 'lucide-react';
import { ElongatedModule } from '@/core/ui/ElongatedModule';
import { CompassQuickWidgetRail } from '@/features/dailyLife/wellbeing/compasses/components/CompassQuickWidgetRail';
import { getDefaultCompassByTime } from '@/features/dailyLife/wellbeing/compasses/utils/compassTime';
import { getCompassAdvice } from '@/features/dailyLife/wellbeing/compasses/utils/compassAdvice';
import { getFlowConfig, EVENING_HERO } from '@/features/dailyLife/wellbeing/compasses/config/compassFlows';
import type { ReactNode } from 'react';

type Props = {
  biffPanel: ReactNode;
  /** B2 — visa endast kompassråd i CalmCollapsible (BIFF primärt utanför stack). */
  compassOnly?: boolean;
};

/** Trygg hamn — moduler staplade (kompassråd · BIFF). */
export function HamnModuleStack({ biffPanel, compassOnly = false }: Props) {
  const [compassOpen, setCompassOpen] = useState(false);
  const [biffOpen, setBiffOpen] = useState(true);
  const timeFlow = getDefaultCompassByTime();
  const meta =
    timeFlow === 'evening' ? EVENING_HERO : getFlowConfig(timeFlow)!;

  const advice = getCompassAdvice(timeFlow);

  const compassBody = (
    <>
      <p className="home-module-panel__lead">{meta.heroLead}</p>
      <CompassQuickWidgetRail flow={timeFlow} className="compass-quick-widget-rail--in-module" />
      <p className="rounded-lg border border-accent/25 bg-accent/5 px-3 py-2.5 text-sm text-text-muted">
        {advice}
      </p>
      <p className="mt-2 text-[10px] uppercase tracking-widest text-text-muted">
        Full check-in finns på Hem under samma tidskompass.
      </p>
    </>
  );

  if (compassOnly) {
    return <div className="space-y-3">{compassBody}</div>;
  }

  return (
    <div className="home-module-stack">
      <ElongatedModule
        id="hamn-compass-advice"
        title="Kompassråd"
        lead={meta.heroTitle}
        icon={Compass}
        tone="gold"
        expanded={compassOpen}
        recommended
        onToggle={() => setCompassOpen((o) => !o)}
      >
        {compassBody}
      </ElongatedModule>

      {!compassOnly ? (
        <ElongatedModule
          id="hamn-biff"
          title="BIFF · Grey Rock"
          lead="Klistra in meddelande — få kort, affärsmässigt svar"
          icon={Anchor}
          tone="gold"
          expanded={biffOpen}
          onToggle={() => setBiffOpen((o) => !o)}
        >
          {biffPanel}
        </ElongatedModule>
      ) : null}
    </div>
  );
}
