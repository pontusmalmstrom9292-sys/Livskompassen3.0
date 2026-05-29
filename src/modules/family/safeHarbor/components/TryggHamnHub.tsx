import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { TabBar } from '../../../core/ui/TabBar';
import { KompassradPanel } from '../../../wellbeing/compasses/components/KompassradPanel';
import { CognitiveLoadStrip } from '../../../core/ui/CognitiveLoadStrip';
import { BiffPublicPanel } from './BiffPublicPanel';
import { vaultDrawerPath } from '../../../core/navigation/navTruth';
import { MaterialPackShortcuts, useLifeHubPreset } from '../../../core/lifeOs';
import { useHubTab } from '../../../core/navigation/hooks/useHubTab';

type Props = {
  initialMessage?: string;
};

/** D6 — Trygg Hamn hub. BIFF publikt; Analys via Valv-menyn. */
export function TryggHamnHub({ initialMessage = '' }: Props) {
  const [searchParams] = useSearchParams();
  const { tabs, activeTab, setTab } = useHubTab('hamn', { defaultTab: 'biff' });
  const { preset } = useLifeHubPreset();

  if (searchParams.get('tab') === 'analys') {
    const vaultPath = vaultDrawerPath('hamn_analys');
    const qIndex = vaultPath.indexOf('?');
    const search = qIndex >= 0 ? vaultPath.slice(qIndex) : '';
    return <Navigate to={{ pathname: '/dagbok', search }} replace />;
  }

  return (
    <div className="space-y-4">
      <MaterialPackShortcuts preset={preset} hub="hamn" />
      <TabBar tabs={tabs} active={activeTab} onChange={setTab} />

      {activeTab === 'oversikt' && (
        <div className="space-y-4">
          <CognitiveLoadStrip />
          <KompassradPanel />
          <p className="text-xs text-text-dim">
            BIFF och Grey Rock finns under fliken BIFF. Riskanalys och bevis under Valv → Hamn · Analys.
          </p>
        </div>
      )}

      {activeTab === 'biff' && <BiffPublicPanel initialMessage={initialMessage} />}

      {activeTab === 'speglar' && (
        <div className="elongated-module p-4 text-sm text-text-muted">
          <p className="text-text-dim">
            Akut känslovalidering (ACT) och bevisjämförelse — innan du formulerar svar här.
          </p>
          <Link to="/dagbok?tab=speglar" className="btn-pill--accent mt-3 inline-flex text-xs">
            Öppna Speglar
          </Link>
        </div>
      )}

      {activeTab === 'barn' && (
        <div className="elongated-module p-4 text-sm text-text-muted">
          <p className="text-text-dim">
            Barnfokus och minnesankare ligger i Familjen — separat från ex-kommunikation.
          </p>
          <Link to="/familjen?tab=reflektion" className="btn-pill--accent mt-3 inline-flex text-xs">
            Öppna Familjen
          </Link>
        </div>
      )}
    </div>
  );
}
