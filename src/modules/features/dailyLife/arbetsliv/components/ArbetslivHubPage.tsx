import { useMemo } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Briefcase, Shield } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { TabBar, type TabBarItem } from '@/core/ui/TabBar';
import { StampClockPage } from '@/features/admin/stampla/components/StampClockPage';
import { EconomyTidPanel } from '@/features/dailyLife/wellbeing/economy/components/EconomyTidPanel';
import { EconomyLogPanel } from '@/features/dailyLife/wellbeing/economy/components/EconomyLogPanel';
import { vaultDrawerPath } from '@/core/navigation/navTruth';
import { useHubTab } from '@/core/navigation/hooks/useHubTab';

export type ArbetslivTab = 'stampla' | 'tid' | 'logg';

function vaultRedirectSearch(vaultTab: string): string {
  const vaultPath = vaultDrawerPath(vaultTab);
  const qIndex = vaultPath.indexOf('?');
  return qIndex >= 0 ? vaultPath.slice(qIndex) : '';
}

/** Arbetsliv — stämpel, tid, logg publikt. Frånvaro/lön via Valv-menyn. */
export function ArbetslivHubPage() {
  const { pathname } = useLocation();
  const embeddedInLiv = pathname === '/vardagen';
  const { tabs, activeTab, setTab, legacyRedirect } = useHubTab('arbetsliv', {
    paramKey: embeddedInLiv ? 'workTab' : 'tab',
    legacyTabRedirects: {
      franvaro: { pathname: '/dagbok', search: vaultRedirectSearch('arbetsliv_franvaro') },
      lon: { pathname: '/dagbok', search: vaultRedirectSearch('arbetsliv_lon') },
    },
  });
  const tab = activeTab as ArbetslivTab;

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

  if (legacyRedirect) {
    return <Navigate to={legacyRedirect} replace />;
  }

  return (
    <div className="arbetsliv-hub space-y-5 pb-8">
      <header>
        <p className="text-[10px] uppercase tracking-[0.35em] text-accent/80">Arbetsliv</p>
        <h1 className="text-xl font-display text-text">Tid · stämpel · logg</h1>
        <p className="mt-1 text-xs text-text-dim">
          Stämpel och flex är öppna här. Hemskärms-widget under Inställningar → widget. Frånvaro och
          lönespec finns under Valv i menyn.
        </p>
        <Link
          to={{ pathname: '/dagbok', search: vaultRedirectSearch('arbetsliv_franvaro') }}
          className="btn-pill--ghost mt-3 inline-flex items-center gap-2 text-xs"
        >
          <Shield className="h-3.5 w-3.5 text-accent/80" />
          Frånvaro och lön i Valv
        </Link>
      </header>

      <TabBar<ArbetslivTab>
        tabs={tabs as TabBarItem<ArbetslivTab>[]}
        active={tab}
        onChange={(id) => setTab(id)}
      />

      {publicPanel}

      <BentoCard
        title="Vardagsekonomi"
        description="Veckopeng och matlåda ligger kvar under Vardagen."
        icon={<Briefcase className="h-4 w-4" />}
      >
        <p className="text-sm text-text-muted">
          Den här hubben är för jobb och lön. Privat kassa:{' '}
          <Link to="/ekonomi" className="text-accent hover:underline">
            Vardagen → Ekonomi
          </Link>
          .
        </p>
      </BentoCard>
    </div>
  );
}
