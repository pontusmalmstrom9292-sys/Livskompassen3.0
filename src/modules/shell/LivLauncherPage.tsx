/** @locked MOD-VARD-LAUNCH — låst modul; unlock via docs/evaluations/*-unlock-MOD-VARD-LAUNCH.md */
import { useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '@/core/store';
import { HubPageShell } from '@/core/layout/HubPageShell';
import { CognitiveLoadStrip } from '@/core/ui/CognitiveLoadStrip';
import { LivLauncherGrid, type LivLauncherId } from './LivLauncherGrid';
import { LivLauncherTabContent } from './LivLauncherTabContent';
import {
  LIV_LAUNCHER_EXTERNAL,
  LIV_LAUNCHER_INLINE_TABS,
  resolveLivLegacyTabRedirect,
} from './livLauncherRoutes';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
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
 * Stora kort; kompass/ekonomi/mabra inline, övrigt navigerar till egen fullsid-route.
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
      errorBody="Prova att ladda om sidan. Dina sparade uppgifter påverkas inte."
      glow="gold"
      backTo={NAV_PATHS.HOME}
      backLabel="Till Hem"
      logTag="LivLauncherPage"
    >
      <HubPageShell
        eyebrow="Vardagen"
        title="Vardagsstart"
        lead="Daglig rytm, planering och mående — ett kort i taget."
        lockViewport
        fitViewport
        contentIsland={false}
        className="vardagen-route-page"
        headerAside={<ModuleHelpFromRegistry moduleId="hub_vardagen" />}
      >
        <VardagenBentoShell>
          <div className="liv-launcher-page calm-scroll-island mx-auto flex max-w-5xl flex-col">
            <div className="space-y-4">
              <CognitiveLoadStrip
                label="Ett steg i taget"
                hint="Tryck ett kort. Kompass, ekonomi och Mabra visas här; projekt och arbetsliv öppnas på egna sidor."
              />

              <HubErrorBoundary
                title="Zonöversikten kunde inte laddas"
                glow="gold"
                logTag="VardagenZoneIntro"
              >
                <VardagenZoneIntro activeTab={activeTab} />
              </HubErrorBoundary>

              <HubErrorBoundary
                title="Modulväljaren kunde inte laddas"
                glow="gold"
                logTag="LivLauncherGrid"
              >
                <LivLauncherGrid activeId={activeTab} onSelect={handleChange} />
              </HubErrorBoundary>
            </div>

            <main className="liv-launcher-page__surface mt-2 pb-4 animate-fade-in">
              <LivLauncherTabContent
                activeTab={activeTab}
                userId={user?.uid ?? ''}
                useLegacyEkonomi={useLegacyEkonomi}
              />
            </main>
          </div>
        </VardagenBentoShell>
      </HubPageShell>
    </HubErrorBoundary>
  );
}
