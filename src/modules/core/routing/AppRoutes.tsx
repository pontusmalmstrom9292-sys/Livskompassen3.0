/* @locked MOD-CORE-NAV — låst modul; unlock via docs/evaluations/*-unlock-MOD-CORE-NAV.md
 PROTECTED CORE COMPONENT: DO NOT MODIFY, REFRACTOR, OR REMOVE UI ELEMENTS. THIS FILE IS LOCKED FOR ARCHITECTURAL STABILITY. */
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { WidgetRoutes } from '@/features/widgets/routing/WidgetRoutes';
import { ProtectedModule } from '../../../components/layout/ProtectedModule';
const HomePage = lazy(() =>
  import('../pages/HomePage').then((m) => ({ default: m.HomePage }))
);
import { LIV_LAUNCHER_EXTERNAL, resolveLivLegacyTabRedirect } from '@/modules/shell/livLauncherRoutes';
const VardagenRoutePage = lazy(() =>
  import('../pages/VardagenRoutePage').then((m) => ({ default: m.VardagenRoutePage })),
);
import {
  clusterTabNavigateTarget,
  valvetNavigateTarget,
  type LifeJournalTabKey,
} from '../navigation/navigationRegistry';
import { NAV_PATHS, vaultDrawerPath } from '../navigation/navTruth';
import { ForalderTryggGuard } from '@/features/onboarding/barnporten/components/ForalderTryggGuard';

const HjartatRoutePage = lazy(() =>
  import('../pages/HjartatRoutePage').then((m) => ({ default: m.HjartatRoutePage })),
);
const FamiljenPage = lazy(() =>
  import('../pages/FamiljenPage').then((m) => ({ default: m.FamiljenPage })),
);

const ValvetRoutePage = lazy(() =>
  import('../pages/ValvetRoutePage').then((m) => ({ default: m.ValvetRoutePage })),
);
const VaultSettingsPage = lazy(() =>
  import('@/features/lifeJournal/evidence/vault/components/VaultSettingsPage').then((m) => ({ default: m.VaultSettingsPage })),
);

const KompisHubPage = lazy(() =>
  import('@/features/lifeJournal/evidence/kompis').then((m) => ({ default: m.KompisHubPage })),
);
const MabraRoutes = lazy(() =>
  import('@/features/dailyLife/wellbeing/mabra').then((m) => ({ default: m.MabraRoutes })),
);
const PlaneringPage = lazy(() =>
  import('@/features/admin/planning/components/PlaneringPage').then((m) => ({ default: m.PlaneringPage })),
);
const PlaneringKalenderPage = lazy(() =>
  import('@/features/admin/planning/components/PlaneringKalenderPage').then((m) => ({ default: m.PlaneringKalenderPage })),
);
const ArbetslivHubPage = lazy(() =>
  import('@/features/dailyLife/arbetsliv').then((m) => ({ default: m.ArbetslivHubPage })),
);
const PlaneringInputRoutes = lazy(() =>
  import('@/features/admin/planning/routing/PlaneringInputRoutes').then((m) => ({
    default: m.PlaneringInputRoutes,
  })),
);
const ArbetslivInputRoutes = lazy(() =>
  import('@/features/dailyLife/arbetsliv/routing/ArbetslivInputRoutes').then((m) => ({
    default: m.ArbetslivInputRoutes,
  })),
);
const DagbokInputRoutes = lazy(() =>
  import('@/features/lifeJournal/diary/routing/DagbokInputRoutes').then((m) => ({
    default: m.DagbokInputRoutes,
  })),
);
const ProjektHubPage = lazy(() =>
  import('@/features/admin/projects').then((m) => ({ default: m.ProjektHubPage })),
);
const ProjektNyPage = lazy(() =>
  import('@/features/admin/projects').then((m) => ({ default: m.ProjektNyPage })),
);
const ProjektReglerPage = lazy(() =>
  import('@/features/admin/projects').then((m) => ({ default: m.ProjektReglerPage })),
);
const ProjektMaterialPackPage = lazy(() =>
  import('@/features/admin/projects').then((m) => ({ default: m.ProjektMaterialPackPage })),
);
const ProjektDetailPage = lazy(() =>
  import('@/features/admin/projects').then((m) => ({ default: m.ProjektDetailPage })),
);
const BarnportenPage = lazy(() =>
  import('@/features/onboarding/barnporten').then((m) => ({ default: m.BarnportenPage })),
);
const ForalderTryggContainer = lazy(() =>
  import('@/features/onboarding/barnporten').then((m) => ({ default: m.ForalderTryggContainer })),
);
const InställningarPage = lazy(() =>
  import('../pages/InstallningarPage').then((m) => ({ default: m.InställningarPage })),
);
const ThemePreviewPage = lazy(() =>
  import('../pages/ThemePreviewPage').then((m) => ({ default: m.ThemePreviewPage })),
);
const ThemeLabPage = lazy(() =>
  import('../pages/ThemeLabPage').then((m) => ({ default: m.ThemeLabPage })),
);
const HubLabPage = lazy(() =>
  import('../pages/HubLabPage').then((m) => ({ default: m.HubLabPage })),
);
const ObsidianDepthMockupPage = lazy(() =>
  import('../pages/ObsidianDepthMockupPage').then((m) => ({
    default: m.ObsidianDepthMockupPage,
  })),
);
const ObsidianForgeLabPage = lazy(() =>
  import('../pages/ObsidianForgeLabPage').then((m) => ({
    default: m.ObsidianForgeLabPage,
  })),
);
const ObsidianDepthV2LabPage = lazy(() =>
  import('../pages/ObsidianDepthV2LabPage').then((m) => ({
    default: m.ObsidianDepthV2LabPage,
  })),
);
const BrusfiltretSupermoduleLabPage = lazy(() =>
  import('../pages/BrusfiltretSupermoduleLabPage').then((m) => ({
    default: m.BrusfiltretSupermoduleLabPage,
  })),
);
const W1KompaktProjektLabPage = lazy(() =>
  import('../pages/W1KompaktProjektLabPage').then((m) => ({
    default: m.W1KompaktProjektLabPage,
  })),
);
const DesignFreeportPage = lazy(() =>
  import('@/modules/sandbox/DesignFreeportPage').then((m) => ({
    default: m.DesignFreeportPage,
  })),
);
const BastaDesignLabPage = lazy(() =>
  import('@/modules/sandbox/BastaDesignLabPage').then((m) => ({
    default: m.BastaDesignLabPage,
  })),
);
const DagensAnkareLabPage = lazy(() =>
  import('../pages/DagensAnkareLabPage').then((m) => ({
    default: m.DagensAnkareLabPage,
  })),
);
const CompanionWidgetLabPage = lazy(() =>
  import('@/widgets/pack/CompanionWidgetLabPage').then((m) => ({
    default: m.CompanionWidgetLabPage,
  })),
);
const WidgetStudioPage = lazy(() =>
  import('@/widgets/studio/WidgetStudioPage').then((m) => ({
    default: m.WidgetStudioPage,
  })),
);
const MemoryTestView = import.meta.env.DEV
  ? lazy(() =>
      import('@/features/emotional-memory/MemoryTestView').then((m) => ({
        default: m.MemoryTestView,
      })),
    )
  : null;
const NewDashboardHubPage = lazy(() => import('../../dashboard/DashboardHub'));
const MorningCompassRoutePage = lazy(() =>
  import('../pages/MorningCompassRoutePage').then((m) => ({ default: m.MorningCompassRoutePage })),
);
const ReflectionPage = lazy(() => import('../../reflection/ReflectionPage'));
const OracleDashboardPage = lazy(() => import('../../oracle/OracleDashboard'));
const BiochemicalShieldHub = lazy(() => import('@/komponenter/BiochemicalShieldHub').then((m) => ({ default: m.BiochemicalShieldHub })));

function RouteFallback() {
  return <div className="p-6 text-center text-sm text-text-muted">Laddar…</div>;
}

function RedirectToLifeJournalTab({ tabKey }: { tabKey: LifeJournalTabKey }) {
  const location = useLocation();
  const target = clusterTabNavigateTarget('lifeJournal', tabKey);
  return (
    <Navigate
      to={{ pathname: target.pathname, search: target.search }}
      state={location.state}
      replace
    />
  );
}

/** Legacy `/dagbok` — bevis → Valvet; övriga flikar → Hjärtat. */
function RedirectDagbokLegacy() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  if (params.get('tab') === 'bevis') {
    const vaultTab = params.get('vaultTab') ?? 'logga';
    params.delete('tab');
    params.set('vaultTab', vaultTab);
    const search = params.toString();
    return (
      <Navigate
        to={{ pathname: NAV_PATHS.VALVET, search: search ? `?${search}` : '' }}
        replace
      />
    );
  }
  return (
    <Navigate
      to={{ pathname: NAV_PATHS.HJARTAT, search: location.search }}
      state={location.state}
      replace
    />
  );
}


/** Legacy `/valv` och `/kunskap` → Valvet (separat silo). */
function RedirectToValvet({ vaultTab }: { vaultTab?: string }) {
  const location = useLocation();
  const target = valvetNavigateTarget(vaultTab);
  return (
    <Navigate
      to={{ pathname: target.pathname, search: target.search ? `?${target.search}` : '' }}
      state={location.state}
      replace
    />
  );
}

/** Legacy `/hamn` → Familjen; `?tab=analys` → Valv forensic (hamn_analys). */
function RedirectHamnToFamiljen() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  if (params.get('tab') === 'analys') {
    return (
      <Navigate to={vaultDrawerPath('hamn_analys')} state={location.state} replace />
    );
  }
  return (
    <Navigate
      to={{ pathname: NAV_PATHS.FAMILJEN, search: '?tab=hamn' }}
      state={location.state}
      replace
    />
  );
}

const DROGFRIHET_SUBTAB_IDS = new Set(['idag', 'resurser', 'reflektion', 'kunskap']);

/** Legacy `/drogfrihet` → Familjen flik; bevarar underflik i `drogfrihetTab`. */
function RedirectDrogfrihetToFamiljen() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const legacySubTab = params.get('tab');
  const search = new URLSearchParams({ tab: 'drogfrihet' });
  if (legacySubTab && DROGFRIHET_SUBTAB_IDS.has(legacySubTab)) {
    search.set('drogfrihetTab', legacySubTab);
  }
  /** Våg 1: `/drogfrihet/akut` → öppna SOS Ankare */
  if (location.pathname.includes('/akut') || params.get('akut') === '1') {
    search.set('akut', '1');
  }
  return (
    <Navigate
      to={{ pathname: NAV_PATHS.FAMILJEN, search: `?${search.toString()}` }}
      state={location.state}
      replace
    />
  );
}

/** Legacy `/ekonomi` → Vardagen ekonomi-flik (Våg 3 H1). */
function RedirectEkonomiToVardagen() {
  return <Navigate to={`${NAV_PATHS.VARDAGEN}?tab=ekonomi`} replace />;
}

/** Legacy `/arkiv` → Valv logga (Våg 3 H3). */
function RedirectArkivToValvet() {
  return <Navigate to={`${NAV_PATHS.VALVET}?vaultTab=logga`} replace />;
}

/** Legacy `/liv` och `/liv?tab=…` → launcher eller fullsid-route. */
function RedirectLivToVardagen() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tab = params.get('tab');
  const vardagenTab = params.get('vardagenTab');
  if (tab === 'kompasser' && vardagenTab === 'ekonomi') {
    return <Navigate to={`${NAV_PATHS.VARDAGEN}?tab=ekonomi`} replace />;
  }
  const external = resolveLivLegacyTabRedirect(tab);
  if (external) {
    return <Navigate to={external} replace state={location.state} />;
  }
  if (tab === 'ekonomi') {
    return <Navigate to={`${NAV_PATHS.VARDAGEN}?tab=ekonomi`} replace />;
  }
  if (tab === 'mabra') {
    return <Navigate to={`${NAV_PATHS.VARDAGEN}?tab=mabra`} replace />;
  }
  if (tab === 'drogfrihet') {
    return <Navigate to={LIV_LAUNCHER_EXTERNAL.drogfrihet} replace />;
  }
  return <Navigate to={NAV_PATHS.VARDAGEN} replace />;
}

import { usePansarStore } from '@/modules/core/store/usePansarStore';
import { GlobalPansarView } from '@/modules/features/pansar/GlobalPansarView';

export function AppRoutes() {
  const isPansarActive = usePansarStore((state) => state.isPansarActive);

  if (isPansarActive) {
    return <GlobalPansarView />;
  }

  return (
    <Routes>
      <Route path="/widget/*" element={<WidgetRoutes />} />
      <Route
        path="/dev/design-freeport"
        element={
          <Suspense fallback={<RouteFallback />}>
            <DesignFreeportPage />
          </Suspense>
        }
      />
      <Route
        path="/dev/basta-design"
        element={
          <Suspense fallback={<RouteFallback />}>
            <BastaDesignLabPage />
          </Suspense>
        }
      />
      <Route
        path="/*"
        element={
          <MainLayout>
            <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path={NAV_PATHS.HOME} element={<HomePage />} />

              <Route path="/dashboard" element={<NewDashboardHubPage />} />
              <Route
                path="/kompis"
                element={
                  <ProtectedModule>
                    <KompisHubPage />
                  </ProtectedModule>
                }
              />

              {/* —— LIV OCH GÖRA (launcher + fullsid-moduler) —— */}
              <Route path={NAV_PATHS.VARDAGEN} element={<ProtectedModule><VardagenRoutePage /></ProtectedModule>} />
              <Route
                path="/morgon"
                element={
                  <ProtectedModule>
                    <MorningCompassRoutePage />
                  </ProtectedModule>
                }
              />
              <Route
                path="/mabra/*"
                element={
                  <ProtectedModule>
                    <MabraRoutes />
                  </ProtectedModule>
                }
              />
              <Route
                path="/planering/kalender"
                element={
                  <ProtectedModule>
                    <PlaneringKalenderPage />
                  </ProtectedModule>
                }
              />
              <Route
                path="/planering/*"
                element={
                  <ProtectedModule>
                    <PlaneringInputRoutes />
                  </ProtectedModule>
                }
              />
              <Route
                path="/planering"
                element={
                  <ProtectedModule>
                    <PlaneringPage />
                  </ProtectedModule>
                }
              />
              <Route
                path="/arbetsliv/*"
                element={
                  <ProtectedModule>
                    <ArbetslivInputRoutes />
                  </ProtectedModule>
                }
              />
              <Route
                path="/arbetsliv"
                element={
                  <ProtectedModule>
                    <ArbetslivHubPage />
                  </ProtectedModule>
                }
              />
              <Route path="/drogfrihet" element={<RedirectDrogfrihetToFamiljen />} />
              <Route path="/drogfrihet/*" element={<RedirectDrogfrihetToFamiljen />} />

              <Route path="/liv" element={<RedirectLivToVardagen />} />
              <Route path="/kompasser" element={<Navigate to={NAV_PATHS.VARDAGEN} replace />} />
              <Route path="/ekonomi" element={<RedirectEkonomiToVardagen />} />
              <Route path="/ekonomi/*" element={<RedirectEkonomiToVardagen />} />
              <Route path="/stampla" element={<Navigate to="/arbetsliv/input?inputMode=stampla" replace />} />
              <Route path="/liv/arbetsliv" element={<Navigate to="/arbetsliv" replace />} />
              <Route path="/liv/arbetsliv/*" element={<Navigate to="/arbetsliv" replace />} />

              {/* —— FAMILJEN ZON —— */}
              <Route path={NAV_PATHS.FAMILJEN} element={<ProtectedModule><FamiljenPage /></ProtectedModule>} />

              <Route path="/familj" element={<Navigate to={`${NAV_PATHS.FAMILJEN}?tab=reflektion`} replace />} />
              <Route path="/barnen" element={<Navigate to={`${NAV_PATHS.FAMILJEN}?tab=reflektion`} replace />} />
              <Route path="/barnhub" element={<Navigate to={`${NAV_PATHS.FAMILJEN}?tab=reflektion`} replace />} />
              <Route path="/barnhubben" element={<Navigate to={`${NAV_PATHS.FAMILJEN}?tab=reflektion`} replace />} />
              <Route path="/hamn" element={<RedirectHamnToFamiljen />} />

              {/* —— HJÄRTAT (Dagbok) — frikopplat från Valv —— */}
              <Route
                path={`${NAV_PATHS.HJARTAT}/*`}
                element={
                  <ProtectedModule>
                    <DagbokInputRoutes />
                  </ProtectedModule>
                }
              />
              <Route path={NAV_PATHS.HJARTAT} element={<HjartatRoutePage />} />

              {/* —— VALVET — egen silo, säkerhet inuti VaultPage —— */}
              <Route
                path={NAV_PATHS.VALVET}
                element={
                  <ProtectedModule>
                    <ValvetRoutePage />
                  </ProtectedModule>
                }
              />
              <Route
                path="/valvet/installningar"
                element={
                  <ProtectedModule>
                    <VaultSettingsPage />
                  </ProtectedModule>
                }
              />

              {/* —— ARKIV legacy → Valv logga (Våg 3 H3) —— */}
              <Route path="/arkiv" element={<RedirectArkivToValvet />} />
              <Route path="/arkiv/*" element={<RedirectArkivToValvet />} />

              <Route
                path="/reflection"
                element={
                  <ProtectedModule>
                    <ReflectionPage />
                  </ProtectedModule>
                }
              />
              <Route
                path="/orakel"
                element={
                  <ProtectedModule>
                    <OracleDashboardPage />
                  </ProtectedModule>
                }
              />
              <Route
                path="/biochem"
                element={
                  <ProtectedModule>
                    <BiochemicalShieldHub />
                  </ProtectedModule>
                }
              />

              {/* Legacy omdirigeringar — förhindrar loopar */}
              <Route path="/dagbok" element={<RedirectDagbokLegacy />} />
              <Route path="/dagbok/*" element={<RedirectDagbokLegacy />} />
              <Route path="/valv" element={<RedirectToValvet />} />
              <Route path="/speglar" element={<RedirectToLifeJournalTab tabKey="mirrors" />} />
              <Route path="/kunskap" element={<RedirectToValvet vaultTab="kunskapsbank" />} />
              <Route path="/dossier" element={<RedirectToValvet vaultTab="dossier" />} />

              {/* —— Projekt, Barnporten & Inställningar —— */}
              <Route
                path="/projekt"
                element={
                  <ProtectedModule>
                    <ProjektHubPage />
                  </ProtectedModule>
                }
              />
              <Route
                path="/projekt/ny"
                element={
                  <ProtectedModule>
                    <ProjektNyPage />
                  </ProtectedModule>
                }
              />
              <Route
                path="/projekt/regler"
                element={
                  <ProtectedModule>
                    <ProjektReglerPage />
                  </ProtectedModule>
                }
              />
              <Route
                path="/projekt/genvagar"
                element={
                  <ProtectedModule>
                    <ProjektMaterialPackPage />
                  </ProtectedModule>
                }
              />
              <Route path="/barnporten">
                <Route index element={<BarnportenPage />} />
                <Route
                  path="foralder-trygg"
                  element={
                    <ForalderTryggGuard>
                      <ForalderTryggContainer />
                    </ForalderTryggGuard>
                  }
                />
                <Route
                  path="foralder-trygg/:childId"
                  element={
                    <ForalderTryggGuard>
                      <ForalderTryggContainer />
                    </ForalderTryggGuard>
                  }
                />
              </Route>
              <Route
                path="/admin/projects/ny"
                element={
                  <ProtectedModule>
                    <ProjektNyPage />
                  </ProtectedModule>
                }
              />
              <Route
                path="/admin/projects/:projectId"
                element={
                  <ProtectedModule>
                    <ProjektDetailPage />
                  </ProtectedModule>
                }
              />
              <Route
                path="/installningar"
                element={
                  <ProtectedModule>
                    <InställningarPage />
                  </ProtectedModule>
                }
              />
              <Route path="/dev/themes" element={<ThemePreviewPage />} />
              <Route path="/dev/theme-lab" element={<ThemeLabPage />} />
              <Route
                path="/dev/theme-lab/brusfiltret-supermodule"
                element={<BrusfiltretSupermoduleLabPage />}
              />
              <Route
                path="/dev/theme-lab/w1-kompakt-projekt"
                element={<W1KompaktProjektLabPage />}
              />
              <Route path="/dev/hub-lab" element={<HubLabPage />} />
              <Route path="/dev/obsidian-depth" element={<ObsidianDepthMockupPage />} />
              <Route path="/dev/obsidian-forge" element={<ObsidianForgeLabPage />} />
              <Route path="/dev/obsidian-depth-v2" element={<ObsidianDepthV2LabPage />} />
              <Route path="/dev/dagens-ankare" element={<DagensAnkareLabPage />} />
              <Route path="/dev/companion-widgets" element={<CompanionWidgetLabPage />} />
              <Route path="/installningar/widget-studio" element={<WidgetStudioPage />} />
              {MemoryTestView ? (
                <Route path="/dev/memory-test" element={<MemoryTestView />} />
              ) : null}

              <Route path="*" element={<Navigate to={NAV_PATHS.HOME} replace />} />
            </Routes>
            </Suspense>
          </MainLayout>
        }
      />
    </Routes>
  );
}
