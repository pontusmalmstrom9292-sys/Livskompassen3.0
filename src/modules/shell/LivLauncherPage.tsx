import { useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '@/core/store';
import { HubPageShell } from '@/core/layout/HubPageShell';
import { CognitiveLoadStrip } from '@/core/ui/CognitiveLoadStrip';
import { CompassQuickWidgetRail } from '@/features/dailyLife/wellbeing/compasses/components/CompassQuickWidgetRail';
import { DashboardPage as CompassDashboard } from '@/features/dailyLife/wellbeing/compasses/components/DashboardPage';
import { getDefaultCompassByTime } from '@/features/dailyLife/wellbeing/compasses/utils/compassTime';
import { EconomyOverviewPanel } from '@/features/dailyLife/wellbeing/economy/components/EconomyOverviewPanel';
import { EkonomiInputSuperModule } from '@/features/dailyLife/wellbeing/economy/supermodule';
import { LivLauncherGrid, type LivLauncherId } from './LivLauncherGrid';
import {
  LIV_LAUNCHER_EXTERNAL,
  LIV_LAUNCHER_INLINE_TABS,
  resolveLivLegacyTabRedirect,
} from './livLauncherRoutes';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { NAV_PATHS } from '@/core/navigation/navTruth';

type LivInlineTab = 'kompasser' | 'ekonomi';

function resolveInlineTab(raw: string | null): LivInlineTab {
  if (raw === 'ekonomi') return 'ekonomi';
  return 'kompasser';
}

/**
 * Liv och göra — launcher-hub.
 * Stora kort; kompass/ekonomi inline, övrigt navigerar till egen fullsid-route.
 */
export function LivLauncherPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const rawTab = searchParams.get('tab');
  const legacyTarget = resolveLivLegacyTabRedirect(rawTab);

  useEffect(() => {
    if (!legacyTarget) return;
    navigate(legacyTarget, { replace: true });
  }, [legacyTarget, navigate]);

  if (legacyTarget) {
    return <Navigate to={legacyTarget} replace />;
  }

  const activeTab = resolveInlineTab(rawTab);
  const useSuperhub = searchParams.get('superhub') === 'true';
  const compassFlow = getDefaultCompassByTime();

  const handleChange = (id: LivLauncherId) => {
    const external = LIV_LAUNCHER_EXTERNAL[id];
    if (external) {
      navigate(external);
      return;
    }
    if (LIV_LAUNCHER_INLINE_TABS.has(id)) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (id === 'kompasser') next.delete('tab');
          else next.set('tab', id);
          return next;
        },
        { replace: true },
      );
    }
  };

  return (
    <HubErrorBoundary
      title="Liv och göra kunde inte laddas"
      glow="gold"
      backTo={NAV_PATHS.HOME}
      backLabel="Till Hem"
      logTag="LivLauncherPage"
    >
      <HubPageShell
        eyebrow="Liv och göra"
        title="Vardagsstart"
        lead="Välj ett kort. Kompass och ekonomi visas här — MåBra, planering och arbetsliv (/arbetsliv) öppnas på egna sidor."
      >
      <div className="mx-auto max-w-5xl space-y-4 pb-12">
        <CognitiveLoadStrip
          label="Ett steg i taget"
          hint="Tryck ett kort. Inline-val visas nedan; övriga tar dig till rätt verktyg direkt."
        />

        <LivLauncherGrid activeId={activeTab} onSelect={handleChange} />

        <main className="calm-scroll-island mt-2 animate-fade-in">
          {activeTab === 'kompasser' && (
            <div className="space-y-4">
              <CompassQuickWidgetRail flow={compassFlow} className="compass-quick-widget-rail--in-module" />
              <CompassDashboard forcedFlow={compassFlow} />
            </div>
          )}

          {activeTab === 'ekonomi' && (
            <div className="space-y-4">
              {useSuperhub ? (
                <EkonomiInputSuperModule userId={user?.uid ?? ''} />
              ) : (
                <EconomyOverviewPanel userId={user?.uid ?? ''} />
              )}
            </div>
          )}
        </main>
      </div>
      </HubPageShell>
    </HubErrorBoundary>
  );
}
