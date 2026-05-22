import { useCallback, useEffect, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sprout, Wallet, Sparkles } from 'lucide-react';
import { ClusterShell } from '../../core/ui/ClusterShell';
import type { TabBarItem } from '../../core/ui/TabBar';
import { useStore } from '../../core/store';
import {
  parseVardagenTab,
  VARDAGEN_TABS,
  type VardagenTab,
} from '../../core/navigation/appNavigation';
import { EconomyPage } from '../../ekonomi';
import { KunskapPage } from '../../kompis/components/KunskapPage';
import { getDefaultCompassByTime } from '../utils/compassTime';
import { DashboardPage } from './DashboardPage';

export type { VardagenTab } from '../../core/navigation/appNavigation';
export { parseVardagenTab } from '../../core/navigation/appNavigation';

const TAB_ICONS: Record<VardagenTab, ReactNode> = {
  kompasser: <Sprout className="h-3 w-3" />,
  ekonomi: <Wallet className="h-3 w-3" />,
  kunskap: <Sparkles className="h-3 w-3" />,
};

const TABS: TabBarItem<VardagenTab>[] = VARDAGEN_TABS.map((t) => ({
  id: t.id,
  label: t.label,
  icon: TAB_ICONS[t.id],
}));

export function VardagenPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = parseVardagenTab(searchParams.get('tab'));
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

  return (
    <ClusterShell
      title="Vardagen"
      description="Rytm · ekonomi · kunskap"
      tone="emerald"
      hint="Daglig struktur — ett kluster, tre flikar."
      tabs={TABS}
      activeTab={tab}
      onTabChange={setTab}
    >
      {tab === 'kompasser' && <DashboardPage embedded />}
      {tab === 'ekonomi' && <EconomyPage embedded />}
      {tab === 'kunskap' && <KunskapPage embedded />}
    </ClusterShell>
  );
}
