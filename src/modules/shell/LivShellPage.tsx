import { Navigate } from 'react-router-dom';
import { TabBar } from '../core/ui/TabBar';
import { HubPageShell } from '../core/layout/HubPageShell';
import { useHubTab } from '../core/navigation/hooks/useHubTab';
import { VardagenPage } from '../wellbeing/compasses';
import { MabraPage } from '../wellbeing/mabra';
import { PlaneringPage } from '../admin/planning';
import { ArbetslivHubPage } from '../arbetsliv';

export function LivShellPage() {
  const { tabs, activeTab, setTab, legacyRedirect } = useHubTab('liv', {
    defaultTab: 'kompasser',
    legacyTabRedirects: {
      vardagen: { pathname: '/liv', search: '?tab=kompasser' },
      planering: { pathname: '/liv', search: '?tab=handling' },
      gora: { pathname: '/liv', search: '?tab=handling' },
      projekt: { pathname: '/projekt', search: '' },
    },
  });

  if (legacyRedirect) {
    return <Navigate to={legacyRedirect} replace />;
  }

  return (
    <HubPageShell
      eyebrow="Liv och göra"
      title="Vardag · MåBra · handling · arbete"
      lead="Kompasser, återhämtning, kanban och stämpel — ett ställe."
    >
      <TabBar tabs={tabs} active={activeTab} onChange={setTab} />
      <div className="mt-4">
        {activeTab === 'kompasser' && <VardagenPage />}
        {activeTab === 'mabra' && <MabraPage />}
        {activeTab === 'handling' && <PlaneringPage />}
        {activeTab === 'arbetsliv' && <ArbetslivHubPage />}
      </div>
    </HubPageShell>
  );
}
