import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Anchor, Compass, Heart, Sparkles } from 'lucide-react';
import { TabBar } from '../../core/ui/TabBar';
import { KompassradPanel } from '../../kompasser/components/KompassradPanel';
import { CognitiveLoadStrip } from '../../core/ui/CognitiveLoadStrip';
import { BiffPublicPanel } from './BiffPublicPanel';
import { vaultDrawerPath } from '../../core/navigation/navTruth';
import { MaterialPackShortcuts, useLifeHubPreset } from '../../core/lifeOs';

type HamnTab = 'oversikt' | 'biff' | 'speglar' | 'barn';

const TABS = [
  { id: 'oversikt' as const, label: 'Översikt', icon: <Compass className="h-3 w-3" /> },
  { id: 'biff' as const, label: 'BIFF', icon: <Anchor className="h-3 w-3" /> },
  { id: 'speglar' as const, label: 'Speglar', icon: <Sparkles className="h-3 w-3" /> },
  { id: 'barn' as const, label: 'Barnfokus', icon: <Heart className="h-3 w-3" /> },
];

type Props = {
  initialMessage?: string;
  initialTab?: string | null;
};

function defaultHamnTab(initialTab: string | null | undefined): HamnTab {
  if (initialTab === 'biff' || initialTab === 'oversikt' || initialTab === 'speglar' || initialTab === 'barn') {
    return initialTab;
  }
  return 'biff';
}

/** D6 — Trygg Hamn hub. BIFF publikt; Analys via Valv-menyn. */
export function TryggHamnHub({ initialMessage = '', initialTab = null }: Props) {
  const [tab, setTab] = useState<HamnTab>(() => defaultHamnTab(initialTab));
  const { preset } = useLifeHubPreset();

  if (initialTab === 'analys') {
    const vaultPath = vaultDrawerPath('hamn_analys');
    const qIndex = vaultPath.indexOf('?');
    const search = qIndex >= 0 ? vaultPath.slice(qIndex) : '';
    return <Navigate to={{ pathname: '/dagbok', search }} replace />;
  }

  return (
    <div className="space-y-4">
      <MaterialPackShortcuts preset={preset} hub="hamn" />
      <TabBar<HamnTab> tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'oversikt' && (
        <div className="space-y-4">
          <CognitiveLoadStrip />
          <KompassradPanel />
          <p className="text-xs text-text-dim">
            BIFF och Grey Rock finns under fliken BIFF. Riskanalys och bevis under Valv → Hamn · Analys.
          </p>
        </div>
      )}

      {tab === 'biff' && <BiffPublicPanel initialMessage={initialMessage} />}

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
