import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sprout, Wallet, Sparkles } from 'lucide-react';
import { TabBar } from '../../core/ui/TabBar';
import { BentoCard } from '../../core/ui/BentoCard';
import { EconomyPage } from '../../ekonomi';
import { KunskapPage } from '../../kompis/components/KunskapPage';
import { DashboardPage } from './DashboardPage';

export type VardagenTab = 'kompasser' | 'ekonomi' | 'kunskap';

const TABS = [
  { id: 'kompasser' as const, label: 'Kompasser', icon: <Sprout className="h-3 w-3" /> },
  { id: 'ekonomi' as const, label: 'Ekonomi', icon: <Wallet className="h-3 w-3" /> },
  { id: 'kunskap' as const, label: 'Kunskap', icon: <Sparkles className="h-3 w-3" /> },
];

export function parseVardagenTab(raw: string | null): VardagenTab {
  if (raw === 'ekonomi' || raw === 'kunskap') return raw;
  return 'kompasser';
}

export function VardagenPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = parseVardagenTab(searchParams.get('tab'));

  const setTab = useCallback(
    (next: VardagenTab) => {
      setSearchParams(next === 'kompasser' ? {} : { tab: next }, { replace: true });
    },
    [setSearchParams],
  );

  return (
    <div className="space-y-6">
      <BentoCard title="Vardagen" description="Rytm · ekonomi · kunskap">
        <p className="mb-4 text-sm text-text-muted">
          Daglig struktur och vardagsstress — ett kluster, tre flikar.
        </p>
        <TabBar tabs={TABS} active={tab} onChange={setTab} />
      </BentoCard>

      {tab === 'kompasser' && <DashboardPage embedded />}
      {tab === 'ekonomi' && <EconomyPage embedded />}
      {tab === 'kunskap' && <KunskapPage embedded />}
    </div>
  );
}
