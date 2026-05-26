import { useCallback, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Sprout, Wallet } from 'lucide-react';
import { TabBar } from '../../core/ui/TabBar';
import { BentoCard } from '../../core/ui/BentoCard';
import { useStore } from '../../core/store';
import { EconomyPage } from '../../ekonomi';
import { getDefaultCompassByTime } from '../utils/compassTime';
import { DashboardPage } from './DashboardPage';
import { vaultDrawerPath } from '../../core/navigation/navTruth';

export type VardagenTab = 'kompasser' | 'ekonomi';

const TABS = [
  { id: 'kompasser' as const, label: 'Kompasser', icon: <Sprout className="h-3 w-3" /> },
  { id: 'ekonomi' as const, label: 'Ekonomi', icon: <Wallet className="h-3 w-3" /> },
];

export function parseVardagenTab(raw: string | null): VardagenTab {
  if (raw === 'ekonomi') return 'ekonomi';
  return 'kompasser';
}

export function VardagenPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const tab = parseVardagenTab(tabParam);
  const setCompassFilter = useStore((s) => s.setCompassFilter);

  useEffect(() => {
    if (tab === 'kompasser') {
      setCompassFilter(getDefaultCompassByTime());
    }
  }, [tab, setCompassFilter]);

  const setTab = useCallback(
    (next: VardagenTab) => {
      setSearchParams(next === 'kompasser' ? {} : { tab: next }, { replace: true });
    },
    [setSearchParams],
  );

  if (tabParam === 'kunskap') {
    const vaultPath = vaultDrawerPath('kunskapsbank');
    const qIndex = vaultPath.indexOf('?');
    const search = qIndex >= 0 ? vaultPath.slice(qIndex) : '';
    return <Navigate to={{ pathname: '/dagbok', search }} replace />;
  }

  return (
    <div className="space-y-6">
      <BentoCard title="Vardagen" description="Rytm · ekonomi">
        <p className="mb-4 text-sm text-text-muted">
          Daglig struktur och vardagsstress. Kunskap finns bakom Valv — se menyn.
        </p>
        <TabBar tabs={TABS} active={tab} onChange={setTab} />
      </BentoCard>

      {tab === 'kompasser' && <DashboardPage embedded />}
      {tab === 'ekonomi' && <EconomyPage embedded />}
    </div>
  );
}
