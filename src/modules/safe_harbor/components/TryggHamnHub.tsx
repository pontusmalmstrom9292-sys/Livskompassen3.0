import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Anchor, Compass, Heart, Shield, Sparkles } from 'lucide-react';
import { TabBar } from '../../core/ui/TabBar';
import { KompassradPanel } from '../../kompasser/components/KompassradPanel';
import { CognitiveLoadStrip } from '../../core/ui/CognitiveLoadStrip';
import { VaultZoneGate } from '../../core/security/VaultZoneGate';
import { BiffPublicPanel, HamnForensicPanel } from './BiffPublicPanel';

type HamnTab = 'oversikt' | 'biff' | 'analys' | 'speglar' | 'barn';

const TABS = [
  { id: 'oversikt' as const, label: 'Översikt', icon: <Compass className="h-3 w-3" /> },
  { id: 'biff' as const, label: 'BIFF', icon: <Anchor className="h-3 w-3" /> },
  { id: 'analys' as const, label: 'Analys', icon: <Shield className="h-3 w-3" /> },
  { id: 'speglar' as const, label: 'Speglar', icon: <Sparkles className="h-3 w-3" /> },
  { id: 'barn' as const, label: 'Barnfokus', icon: <Heart className="h-3 w-3" /> },
];

type Props = {
  initialMessage?: string;
};

/** D6 — Trygg Hamn hub med progressive disclosure. BIFF publikt; Analys bakom valv-zon. */
export function TryggHamnHub({ initialMessage = '' }: Props) {
  const [tab, setTab] = useState<HamnTab>('biff');

  return (
    <div className="space-y-4">
      <TabBar<HamnTab> tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'oversikt' && (
        <div className="space-y-4">
          <CognitiveLoadStrip />
          <KompassradPanel />
          <p className="text-xs text-text-dim">
            BIFF och Grey Rock finns under fliken BIFF. Riskanalys och bevis under Analys (Valv-PIN).
          </p>
        </div>
      )}

      {tab === 'biff' && <BiffPublicPanel initialMessage={initialMessage} />}

      {tab === 'analys' && (
        <VaultZoneGate
          zone="hamn_forensic"
          title="Hamn — fördjupad analys"
          description="Risk, agentrouting och spara bevis. Samma PIN som Valv."
        >
          <HamnForensicPanel initialMessage={initialMessage} />
        </VaultZoneGate>
      )}

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
