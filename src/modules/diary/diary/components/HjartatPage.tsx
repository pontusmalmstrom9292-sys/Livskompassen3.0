import { BentoCard } from '../../../core/ui/BentoCard';
import { TabBar } from '../../../core/ui/TabBar';
import { VaultPage } from '../../../evidence/vault';
import { SpeglingsSystem } from '../../../diary/mirror';
import { useHjartatHub } from '../../../core/navigation/hooks/useHjartatHub';
import type { HjartatTab } from '../../../core/navigation/tabRegistry';
import { DagbokPage } from './DagbokPage';

export type { HjartatTab } from '../../../core/navigation/tabRegistry';
export { parseHjartatTab } from '../../../core/navigation/tabRegistry';

export function HjartatPage() {
  const { tabs, tab, tabBarActive, vaultTab, setTab, setVaultTab } = useHjartatHub();

  return (
    <div className="space-y-6">
      <BentoCard title="Hjärtat" description="Reflektion · spegling">
        <p className="mb-4 text-sm text-text-muted">
          Dagbok och spegling här. Bevis, kunskap och analys finns bakom Valv — öppna via menyn.
        </p>
        <TabBar tabs={tabs} active={tabBarActive} onChange={(id) => setTab(id as HjartatTab)} />
      </BentoCard>

      {tab === 'reflektion' && <DagbokPage embedded />}
      {tab === 'bevis' && (
        <VaultPage
          embedded
          initialVaultTab={vaultTab}
          onVaultTabChange={setVaultTab}
          onClose={() => setTab('reflektion')}
        />
      )}
      {tab === 'speglar' && <SpeglingsSystem embedded />}
    </div>
  );
}
