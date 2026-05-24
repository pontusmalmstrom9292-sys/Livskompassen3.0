import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Anchor, Compass, Heart, Sparkles } from 'lucide-react';
import { TabBar } from '../../core/ui/TabBar';
import { KompassradPanel } from '../../kompasser/components/KompassradPanel';
import { CognitiveLoadStrip } from '../../core/ui/CognitiveLoadStrip';

type HamnTab = 'oversikt' | 'biff' | 'speglar' | 'barn';

const TABS = [
  { id: 'oversikt' as const, label: 'Översikt', icon: <Compass className="h-3 w-3" /> },
  { id: 'biff' as const, label: 'BIFF', icon: <Anchor className="h-3 w-3" /> },
  { id: 'speglar' as const, label: 'Speglar', icon: <Sparkles className="h-3 w-3" /> },
  { id: 'barn' as const, label: 'Barnfokus', icon: <Heart className="h-3 w-3" /> },
];

type Props = {
  biffPanel: ReactNode;
};

/** D6 — Trygg Hamn hub med progressive disclosure (4 flikar). */
export function TryggHamnHub({ biffPanel }: Props) {
  const [tab, setTab] = useState<HamnTab>('biff');

  return (
    <div className="space-y-4">
      <TabBar<HamnTab> tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'oversikt' && (
        <div className="space-y-4">
          <CognitiveLoadStrip />
          <KompassradPanel />
          <p className="text-xs text-text-dim">
            BIFF och Grey Rock finns under fliken BIFF. Ett steg i taget.
          </p>
        </div>
      )}

      {tab === 'biff' && biffPanel}

      {tab === 'speglar' && (
        <div className="elongated-module p-4 text-sm text-text-muted">
          <p>Validering och VIVIR — separat känsla från fakta.</p>
          <Link to="/dagbok?tab=speglar" className="btn-pill--accent mt-3 inline-flex text-xs">
            Öppna Speglar
          </Link>
        </div>
      )}

      {tab === 'barn' && (
        <div className="elongated-module p-4 text-sm text-text-muted">
          <p>Barnfokus och minnesankare — Familjen-silon.</p>
          <Link to="/familjen?tab=reflektion" className="btn-pill--accent mt-3 inline-flex text-xs">
            Öppna Familjen
          </Link>
        </div>
      )}
    </div>
  );
}
