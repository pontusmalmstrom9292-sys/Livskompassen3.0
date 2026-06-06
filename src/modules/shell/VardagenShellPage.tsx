/** @deprecated Embed-shell avvisad — använd LivLauncherPage + fullsid-routes. */
import { TabBar } from '../core/ui/TabBar';
import { HubPageShell } from '../core/layout/HubPageShell';
import { useHubTab } from '../core/navigation/hooks/useHubTab';
import { VardagenPage } from '@/features/dailyLife/wellbeing/compasses';
import { MabraPage } from '@/features/dailyLife/wellbeing/mabra';
import { PlaneringPage } from '@/features/admin/planning';
import { ArbetslivHubPage } from '@/features/dailyLife/arbetsliv';
import { EconomyPage } from '@/features/dailyLife/wellbeing/economy';
import { DrogfrihetHubPage } from '@/features/dailyLife/drogfrihet';

export function VardagenShellPage() {
  const { tabs, activeTab, setTab } = useHubTab('vardagen', {
    defaultTab: 'kompasser',
  });

  return (
    <HubPageShell
      eyebrow="Vardagen"
      title="Rytm · MåBra · Planering · Arbete"
      lead="Dina dagliga verktyg och kompasser samlade på en och samma plats."
    >
      <TabBar tabs={tabs} active={activeTab} onChange={setTab} />
      <div className="mt-4">
        {activeTab === 'kompasser' && <VardagenPage />}
        {activeTab === 'mabra' && <MabraPage />}
        {activeTab === 'handling' && <PlaneringPage />}
        {activeTab === 'arbetsliv' && <ArbetslivHubPage />}
        {activeTab === 'ekonomi' && <EconomyPage />}
        {activeTab === 'drogfrihet' && <DrogfrihetHubPage />}
      </div>
    </HubPageShell>
  );
}
