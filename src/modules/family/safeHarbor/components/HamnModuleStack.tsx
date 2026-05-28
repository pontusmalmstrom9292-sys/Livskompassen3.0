import { useState } from 'react';
import { Anchor, Compass } from 'lucide-react';
import { ElongatedModule } from '../../../core/ui/ElongatedModule';
import { getDefaultCompassByTime } from '../../../wellbeing/compasses/utils/compassTime';
import { getFlowConfig, EVENING_HERO } from '../../../wellbeing/compasses/config/compassFlows';
import type { ReactNode } from 'react';

type Props = {
  biffPanel: ReactNode;
};

/** Trygg hamn — moduler staplade (kompassråd · BIFF). */
export function HamnModuleStack({ biffPanel }: Props) {
  const [compassOpen, setCompassOpen] = useState(false);
  const [biffOpen, setBiffOpen] = useState(true);
  const timeFlow = getDefaultCompassByTime();
  const meta =
    timeFlow === 'evening' ? EVENING_HERO : getFlowConfig(timeFlow)!;

  const advice =
    timeFlow === 'morning'
      ? 'Ett mikrosteg räcker. Du behöver inte lösa hela dagen nu.'
      : timeFlow === 'day'
        ? 'Sortera kroppen först — sedan logistik mot ex.'
        : 'Land dagen. Gränser kan vänta till imorgon om det känns tungt.';

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
        <p className="home-module-panel__lead">{meta.heroLead}</p>
        <p className="rounded-lg border border-accent/25 bg-accent/5 px-3 py-2.5 text-sm text-text-muted">
          {advice}
        </p>
        <p className="mt-2 text-[10px] uppercase tracking-widest text-text-dim">
          Full check-in finns på Hem under samma tidskompass.
        </p>
      </ElongatedModule>

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
    </div>
  );
}
