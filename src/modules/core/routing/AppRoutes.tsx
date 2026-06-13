import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { WidgetRoutes } from '@/features/widgets/routing/WidgetRoutes';
import { ProtectedModule } from '../../components/layout/ProtectedModule';
const HomePage = lazy(() =>
  import('../pages/HomePage').then((m) => ({ default: m.HomePage }))
);
import { resolveLivLegacyTabRedirect } from '@/modules/shell/livLauncherRoutes';
import {
  clusterTabNavigateTarget,
  valvetNavigateTarget,
  type LifeJournalTabKey,
} from '../navigation/navigationRegistry';
import { NAV_PATHS, vaultDrawerPath } from '../navigation/navTruth';

const HjartatPage = lazy(() =>
  import('@/core/pages/DagbokPage').then((m) => ({ default: m.HjartatPage })),
);
const ValvetRoutePage = lazy(() =>
  import('../pages/ValvetRoutePage').then((m) => ({ default: m.ValvetRoutePage })),
);
const FamiljenPage = lazy(() =>
  import('../pages/FamiljenPage').then((m) => ({ default: m.FamiljenPage })),
);
const LivLauncherPage = lazy(() =>
  import('@/modules/shell/LivLauncherPage').then((m) => ({ default: m.LivLauncherPage })),
);
const KompisHubPage = lazy(() =>
  import('@/features/lifeJournal/evidence/kompis').then((m) => ({ default: m.KompisHubPage })),
);
const MabraRoutes = lazy(() =>
  import('@/features/dailyLife/wellbeing/mabra').then((m) => ({ default: m.MabraRoutes })),
);
const PlaneringPage = lazy(() =>
  import('@/features/admin/planning').then((m) => ({ default: m.PlaneringPage })),
);
const PlaneringKalenderPage = lazy(() =>
  import('@/features/admin/planning').then((m) => ({ default: m.PlaneringKalenderPage })),
);
const ArbetslivHubPage = lazy(() =>
  import('@/features/dailyLife/arbetsliv').then((m) => ({ default: m.ArbetslivHubPage })),
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
const InstallningarPage = lazy(() =>
  import('../pages/InstallningarPage').then((m) => ({ default: m.InstallningarPage })),
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
const DashboardHubPage = lazy(() =>
  import('@/features/dashboard').then((m) => ({ default: m.DashboardHub })),
);
const ArchiveHubPage = lazy(() =>
  import('../../features/archive/components/ArchiveHub').then((m) => ({ default: m.ArchiveHub }))
);

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

/** Blockera `?tab=bevis` på Hjärtat — skicka till Valvet. */
function HjartatRoute() {
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
    <ProtectedModule>
      <HjartatPage />
    </ProtectedModule>
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
  return (
    <Navigate
      to={{ pathname: NAV_PATHS.FAMILJEN, search: `?${search.toString()}` }}
      state={location.state}
      replace
    />
  );
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
  return <Navigate to={NAV_PATHS.VARDAGEN} replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/widget/*" element={<WidgetRoutes />} />
      <Route
        path="/*"
        element={
          <MainLayout>
            <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path={NAV_PATHS.HOME} element={<HomePage />} />
              <Route
                path="/oversikt"
                element={
                  <ProtectedModule>
                    <DashboardHubPage />
                  </ProtectedModule>
                }
              />
              <Route
                path="/kompis"
                element={
                  <ProtectedModule>
                    <KompisHubPage />
                  </ProtectedModule>
                }
              />

              {/* —— LIV OCH GÖRA (launcher + fullsid-moduler) —— */}
              <Route path={NAV_PATHS.VARDAGEN} element={<ProtectedModule><LivLauncherPage /></ProtectedModule>} />
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
                path="/planering"
                element={
                  <ProtectedModule>
                    <PlaneringPage />
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
              <Route path="/ekonomi" element={<Navigate to={`${NAV_PATHS.VARDAGEN}?tab=ekonomi`} replace />} />
              <Route path="/stampla" element={<Navigate to="/arbetsliv?tab=stampla" replace />} />
              <Route path="/liv/arbetsliv" element={<Navigate to="/arbetsliv" replace />} />
              <Route path="/liv/arbetsliv/*" element={<Navigate to="/arbetsliv" replace />} />

              {/* —— FAMILJEN ZON —— */}
              <Route path={NAV_PATHS.FAMILJEN} element={<ProtectedModule><FamiljenPage /></ProtectedModule>} />

              <Route path="/familj" element={<Navigate to={`${NAV_PATHS.FAMILJEN}?tab=reflektion`} replace />} />
              <Route path="/barnen" element={<Navigate to={`${NAV_PATHS.FAMILJEN}?tab=reflektion`} replace />} />
              <Route path="/hamn" element={<RedirectHamnToFamiljen />} />

              {/* —— HJÄRTAT (Dagbok) — frikopplat från Valv —— */}
              <Route path={NAV_PATHS.HJARTAT} element={<HjartatRoute />} />

              {/* —— VALVET — egen silo, säkerhet inuti VaultPage —— */}
              <Route
                path={NAV_PATHS.VALVET}
                element={
                  <ProtectedModule>
                    <ValvetRoutePage />
                  </ProtectedModule>
                }
              />

              {/* —— NYTT ARKIV (ArchiveHub) —— */}
              <Route
                path="/arkiv"
                element={
                  <ProtectedModule>
                    <ArchiveHubPage />
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
              <Route path="/barnporten" element={<BarnportenPage />} />
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
                    <InstallningarPage />
                  </ProtectedModule>
                }
              />
              <Route path="/dev/themes" element={<ThemePreviewPage />} />
              <Route path="/dev/theme-lab" element={<ThemeLabPage />} />
              <Route path="/dev/hub-lab" element={<HubLabPage />} />

              <Route path="*" element={<Navigate to={NAV_PATHS.HOME} replace />} />
            </Routes>
            </Suspense>
          </MainLayout>
        }
      />
    </Routes>
  );
}
