import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ClusterShell } from '../../core/ui/ClusterShell';
import { TabBar } from '../../core/ui/TabBar';
import { VaultCrossReference } from '../../verklighetsvalvet';
import { BarnensPage } from './BarnensPage';
import { BarnfokusBanner } from './BarnfokusBanner';
import { ChildProfileCards } from './ChildProfileCards';
import { FamiljenOversiktPanel } from './FamiljenOversiktPanel';
import { MemoryAnchorsPanel } from './MemoryAnchorsPanel';
import { FAMILJEN_TABS, parseFamiljenTab, type FamiljenTab } from '../familjenTabs';

export function FamiljenPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const tab = parseFamiljenTab(searchParams.get('tab'));

  const setTab = useCallback(
    (next: FamiljenTab) => {
      const def = FAMILJEN_TABS.find((t) => t.id === next);
      if (def?.external) {
        navigate(def.external);
        return;
      }
      setSearchParams(next === 'oversikt' ? {} : { tab: next }, { replace: true });
    },
    [navigate, setSearchParams],
  );

  return (
    <ClusterShell
      title="Familjen"
      description="Trygg hamn · stress-översikt"
      tone="lavender"
      hint="Ett område i taget — flikar är L3 under Familjen."
    >
      <TabBar tabs={FAMILJEN_TABS} active={tab} onChange={setTab} variant="module" />

      <div className="mt-4">
        {tab === 'oversikt' && <FamiljenOversiktPanel />}
        {tab === 'korsref' && <VaultCrossReference />}
        {tab === 'barnfokus' && (
          <div className="space-y-4">
            <BarnfokusBanner />
            <ChildProfileCards />
            <MemoryAnchorsPanel />
            <BarnensPage embedded />
          </div>
        )}
      </div>
    </ClusterShell>
  );
}
