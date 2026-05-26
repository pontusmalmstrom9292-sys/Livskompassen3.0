import { useMemo } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { TabBar, type TabBarItem } from '../../core/ui/TabBar';
import { StampClockPage } from '../../stampla/components/StampClockPage';
import { EconomyTidPanel } from '../../ekonomi/components/EconomyTidPanel';
import { EconomyLogPanel } from '../../ekonomi/components/EconomyLogPanel';
import { vaultDrawerPath } from '../../core/navigation/navTruth';

export type ArbetslivTab = 'stampla' | 'tid' | 'logg';

const TABS: TabBarItem<ArbetslivTab>[] = [
  { id: 'stampla', label: 'Stämpel' },
  { id: 'tid', label: 'Tid & flex' },
  { id: 'logg', label: 'Logg' },
];

function parseArbetslivTab(raw: string | null): ArbetslivTab {
  if (raw === 'tid' || raw === 'logg') return raw;
  return 'stampla';
}

function vaultRedirectSearch(vaultTab: string): string {
  const vaultPath = vaultDrawerPath(vaultTab);
  const qIndex = vaultPath.indexOf('?');
  return qIndex >= 0 ? vaultPath.slice(qIndex) : '';
}

/** Arbetsliv — stämpel, tid, logg publikt. Frånvaro/lön via Valv-menyn. */
export function ArbetslivHubPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  if (tabParam === 'franvaro') {
    return <Navigate to={{ pathname: '/dagbok', search: vaultRedirectSearch('arbetsliv_franvaro') }} replace />;
  }

  if (tabParam === 'lon') {
    return <Navigate to={{ pathname: '/dagbok', search: vaultRedirectSearch('arbetsliv_lon') }} replace />;
  }

  const tab = parseArbetslivTab(tabParam);

  const setTab = (next: ArbetslivTab) => {
    setSearchParams(next === 'stampla' ? {} : { tab: next }, { replace: true });
  };

  const publicPanel = useMemo(() => {
    switch (tab) {
      case 'stampla':
        return <StampClockPage />;
      case 'tid':
        return <EconomyTidPanel />;
      case 'logg':
        return <EconomyLogPanel />;
      default:
        return null;
    }
  }, [tab]);

  return (
    <div className="arbetsliv-hub space-y-5 pb-8">
      <header>
        <p className="text-[10px] uppercase tracking-[0.35em] text-accent/80">Arbetsliv</p>
        <h1 className="text-xl font-display text-text">Tid · stämpel · logg</h1>
        <p className="mt-1 text-xs text-text-dim">
          Stämpel och flex är öppna. Frånvaro och lönespec finns under Valv i menyn.
        </p>
      </header>

      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {publicPanel}

      <BentoCard
        title="Vardagsekonomi"
        description="Veckopeng och matlåda ligger kvar under Vardagen."
        icon={<Briefcase className="h-4 w-4" />}
      >
        <p className="text-sm text-text-muted">
          Den här hubben är för jobb och lön. Privat kassa:{' '}
          <a href="/vardagen?tab=ekonomi" className="text-accent hover:underline">
            Vardagen → Ekonomi
          </a>
          .
        </p>
      </BentoCard>
    </div>
  );
}
