import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { BentoCard } from '@/shared/ui/BentoCard';
import { TabBar } from '@/core/ui/TabBar';
import { useStore } from '@/core/store';
import { EconomyPage } from '../../economy';
import { getDefaultCompassByTime } from '../utils/compassTime';
import { DashboardPage } from './DashboardPage';
import { vaultDrawerPath } from '@/core/navigation/navTruth';
import { useHubTab } from '@/core/navigation/hooks/useHubTab';

export type VardagenTab = 'kompasser' | 'ekonomi';

export function parseVardagenTab(raw: string | null): VardagenTab {
  if (raw === 'ekonomi') return 'ekonomi';
  return 'kompasser';
}

export function VardagenPage() {
  const { pathname } = useLocation();
  const embeddedInLiv = pathname === '/liv';
  const { tabs, activeTab, setTab, legacyRedirect } = useHubTab('vardagen', {
    paramKey: embeddedInLiv ? 'vardagenTab' : 'tab',
    legacyTabRedirects: {
      kunskap: {
        pathname: '/dagbok',
        search: (() => {
          const vaultPath = vaultDrawerPath('kunskapsbank');
          const qIndex = vaultPath.indexOf('?');
          return qIndex >= 0 ? vaultPath.slice(qIndex) : '';
        })(),
      },
    },
  });
  const tab = activeTab as VardagenTab;
  const setCompassFilter = useStore((s) => s.setCompassFilter);

  useEffect(() => {
    if (tab === 'kompasser') {
      setCompassFilter(getDefaultCompassByTime());
    }
  }, [tab, setCompassFilter]);

  if (legacyRedirect) {
    return <Navigate to={legacyRedirect} replace />;
  }

  return (
    <div className="space-y-6">
      <BentoCard title="Vardagen" description="Rytm · ekonomi">
        <p className="mb-4 text-sm text-text-muted">
          Daglig struktur och vardagsstress. Kunskap finns bakom Valv — se menyn.
        </p>
        <TabBar tabs={tabs} active={activeTab} onChange={setTab} />
      </BentoCard>

      {tab === 'kompasser' && <DashboardPage embedded />}
      {tab === 'ekonomi' && <EconomyPage embedded />}
    </div>
  );
}
