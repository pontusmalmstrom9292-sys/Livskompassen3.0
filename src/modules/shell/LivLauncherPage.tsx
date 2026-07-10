/** @locked MOD-VARD-LAUNCH — låst modul; unlock via docs/evaluations/*-unlock-MOD-VARD-LAUNCH.md */
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
import { MabraHubView } from '@/features/dailyLife/wellbeing/mabra/views/MabraHubView';
import { LivLauncherGrid, type LivLauncherId } from './LivLauncherGrid';
import {
  LIV_LAUNCHER_EXTERNAL,
  LIV_LAUNCHER_INLINE_TABS,
  resolveLivLegacyTabRedirect,
} from './livLauncherRoutes';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { BentoCard } from '@/shared/ui/BentoCard';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import { VardagenBentoShell } from './components/VardagenBentoShell';
import { VardagenZoneIntro } from './components/VardagenZoneIntro';

type LivInlineTab = 'kompasser' | 'ekonomi' | 'mabra';

/** Superhub deep links från launcher (W3). */
const LIV_LAUNCHER_SUPERHUB_TARGETS: Partial<Record<LivLauncherId, string>> = {
  arbetsliv: '/arbetsliv/input?inputMode=stampla',
};

function resolveInlineTab(raw: string | null): LivInlineTab {
  if (raw === 'ekonomi') return 'ekonomi';
  if (raw === 'mabra') return 'mabra';
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
  const useLegacyEkonomi = searchParams.get('legacy') === 'true';
  const compassFlow = getDefaultCompassByTime();

  const handleChange = (id: LivLauncherId) => {
    const superhubTarget = LIV_LAUNCHER_SUPERHUB_TARGETS[id];
    if (superhubTarget) {
      navigate(superhubTarget);
      return;
    }
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
        eyebrow="Vardagen"
        title="Vardagsstart"
        lead="Daglig rytm, planering och mående — ett kort i taget."
      >
        <VardagenBentoShell>
          <div className="liv-launcher-page mx-auto max-w-5xl space-y-4 pb-12">
            <div className="space-y-4">
              <CognitiveLoadStrip
                label="Ett steg i taget"
                hint="Tryck ett kort. Kompass, ekonomi och MåBra visas här; projekt och arbetsliv öppnas på egna sidor."
              />

              <VardagenZoneIntro activeTab={activeTab} />

              <LivLauncherGrid activeId={activeTab} onSelect={handleChange} />
            </div>

            <main className="calm-scroll-island liv-launcher-page__surface mt-2 animate-fade-in">
              {activeTab === 'kompasser' && (
                <BentoCard glow="gold" depth noHover bare className="!p-4 sm:!p-5">
                  <div className="space-y-4">
                    <CompassQuickWidgetRail flow={compassFlow} className="compass-quick-widget-rail--in-module" />
                    <CompassDashboard forcedFlow={compassFlow} />
                  </div>
                </BentoCard>
              )}

              {activeTab === 'ekonomi' && (
                <BentoCard glow="gold" depth noHover bare className="!p-4 sm:!p-5">
                  <div className="space-y-4">
                    {useLegacyEkonomi ? (
                      <EconomyOverviewPanel userId={user?.uid ?? ''} />
                    ) : (
                      <EkonomiInputSuperModule userId={user?.uid ?? ''} />
                    )}
                  </div>
                </BentoCard>
              )}

              {activeTab === 'mabra' && (
                <BentoCard glow="green" depth noHover bare className="!p-4 sm:!p-5">
                  <MabraHubView />
                </BentoCard>
              )}
            </main>
          </div>
        </VardagenBentoShell>
      </HubPageShell>
    </HubErrorBoundary>
  );
}
