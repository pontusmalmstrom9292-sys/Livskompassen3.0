import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { WidgetRoutes } from '@/features/widgets/routing/WidgetRoutes';
import { AuthGate } from '../auth/AuthGate';
import { HomePage } from '../pages/HomePage';
import { ThemePreviewPage } from '../pages/ThemePreviewPage';
import { ThemeLabPage } from '../pages/ThemeLabPage';
import { HubLabPage } from '../pages/HubLabPage';
import { HjartatPage } from '@/core/pages/DagbokPage';
import { ValvetRoutePage } from '../pages/ValvetRoutePage';
import {
  ProjektDetailPage,
  ProjektHubPage,
  ProjektMaterialPackPage,
  ProjektNyPage,
  ProjektReglerPage,
} from '@/features/admin/projects';
import { BarnportenPage } from '@/features/onboarding/barnporten';
import { InstallningarPage } from '../pages/InstallningarPage';
import { KompisHubPage } from '@/features/lifeJournal/evidence/kompis';
import { FamiljenPage } from '../pages/FamiljenPage';
import { LivLauncherPage } from '@/modules/shell/LivLauncherPage';
import { MabraPage } from '@/features/dailyLife/wellbeing/mabra';
import { PlaneringPage } from '@/features/admin/planning';
import { ArbetslivHubPage } from '@/features/dailyLife/arbetsliv';
import { resolveLivLegacyTabRedirect } from '@/modules/shell/livLauncherRoutes';
import {
  clusterTabNavigateTarget,
  valvetNavigateTarget,
  type LifeJournalTabKey,
} from '../navigation/navigationRegistry';
import { NAV_PATHS } from '../navigation/navTruth';

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
    <AuthGate>
      <HjartatPage />
    </AuthGate>
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

/** Legacy `/hamn` → Familjehubben; bevarar t.ex. Speglar `prefilledMessage` i location.state. */
function RedirectHamnToFamiljen() {
  const location = useLocation();
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
            <Routes>
              <Route path={NAV_PATHS.HOME} element={<HomePage />} />
              <Route
                path="/kompis"
                element={
                  <AuthGate>
                    <KompisHubPage />
                  </AuthGate>
                }
              />

              {/* —— LIV OCH GÖRA (launcher + fullsid-moduler) —— */}
              <Route path={NAV_PATHS.VARDAGEN} element={<AuthGate><LivLauncherPage /></AuthGate>} />
              <Route
                path="/mabra"
                element={
                  <AuthGate>
                    <MabraPage />
                  </AuthGate>
                }
              />
              <Route
                path="/planering"
                element={
                  <AuthGate>
                    <PlaneringPage />
                  </AuthGate>
                }
              />
              <Route
                path="/arbetsliv"
                element={
                  <AuthGate>
                    <ArbetslivHubPage />
                  </AuthGate>
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
              <Route path={NAV_PATHS.FAMILJEN} element={<AuthGate><FamiljenPage /></AuthGate>} />

              <Route path="/familj" element={<Navigate to={`${NAV_PATHS.FAMILJEN}?tab=reflektion`} replace />} />
              <Route path="/barnen" element={<Navigate to={`${NAV_PATHS.FAMILJEN}?tab=reflektion`} replace />} />
              <Route path="/hamn" element={<RedirectHamnToFamiljen />} />

              {/* —— HJÄRTAT (Dagbok) — frikopplat från Valv —— */}
              <Route path={NAV_PATHS.HJARTAT} element={<HjartatRoute />} />

              {/* —— VALVET — egen silo, säkerhet inuti VaultPage —— */}
              <Route
                path={NAV_PATHS.VALVET}
                element={
                  <AuthGate>
                    <ValvetRoutePage />
                  </AuthGate>
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
                  <AuthGate>
                    <ProjektHubPage />
                  </AuthGate>
                }
              />
              <Route
                path="/projekt/ny"
                element={
                  <AuthGate>
                    <ProjektNyPage />
                  </AuthGate>
                }
              />
              <Route
                path="/projekt/regler"
                element={
                  <AuthGate>
                    <ProjektReglerPage />
                  </AuthGate>
                }
              />
              <Route
                path="/projekt/genvagar"
                element={
                  <AuthGate>
                    <ProjektMaterialPackPage />
                  </AuthGate>
                }
              />
              <Route path="/barnporten" element={<BarnportenPage />} />
              <Route
                path="/admin/projects/ny"
                element={
                  <AuthGate>
                    <ProjektNyPage />
                  </AuthGate>
                }
              />
              <Route
                path="/admin/projects/:projectId"
                element={
                  <AuthGate>
                    <ProjektDetailPage />
                  </AuthGate>
                }
              />
              <Route
                path="/installningar"
                element={
                  <AuthGate>
                    <InstallningarPage />
                  </AuthGate>
                }
              />
              <Route path="/dev/themes" element={<ThemePreviewPage />} />
              <Route path="/dev/theme-lab" element={<ThemeLabPage />} />
              <Route path="/dev/hub-lab" element={<HubLabPage />} />

              <Route path="*" element={<Navigate to={NAV_PATHS.HJARTAT} replace />} />
            </Routes>
          </MainLayout>
        }
      />
    </Routes>
  );
}
