import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { WidgetRoutes } from '@/features/widgets/routing/WidgetRoutes';
import { AuthGate } from '../auth/AuthGate';
import { HomePage } from '../pages/HomePage';
import { ThemePreviewPage } from '../pages/ThemePreviewPage';
import { ThemeLabPage } from '../pages/ThemeLabPage';
import { HubLabPage } from '../pages/HubLabPage';
import { HjartatPage } from '@/features/lifeJournal/diary/diary';
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
import { VardagenPage } from '../pages/VardagenPage';
import {
  NAVIGATION_STRUCTURE,
  clusterPath,
  clusterTabNavigateTarget,
  registryTabSearch,
  type LifeJournalTabKey,
} from '../navigation/navigationRegistry';

const LIFE_JOURNAL = NAVIGATION_STRUCTURE.lifeJournal;

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

/** Legacy `/hamn` → Familjehubben; bevarar t.ex. Speglar `prefilledMessage` i location.state. */
function RedirectHamnToFamiljen() {
  const location = useLocation();
  return (
    <Navigate
      to={{ pathname: '/familjen', search: '?tab=hamn' }}
      state={location.state}
      replace
    />
  );
}

/** Legacy `/liv` och `/liv?tab=…` → `/vardagen` (bevarar flik). */
function RedirectLivToVardagen() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tab = params.get('tab');
  const vardagenTab = params.get('vardagenTab');
  if (tab === 'kompasser' && vardagenTab === 'ekonomi') {
    return <Navigate to="/vardagen?tab=ekonomi" replace />;
  }
  if (tab) {
    return <Navigate to={`/vardagen?tab=${encodeURIComponent(tab)}`} replace />;
  }
  return <Navigate to="/vardagen?tab=kompasser" replace />;
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
              <Route path="/" element={<HomePage />} />
              <Route
                path="/kompis"
                element={
                  <AuthGate>
                    <KompisHubPage />
                  </AuthGate>
                }
              />

              {/* —— REFORM: VARDAGEN ZON —— */}
              <Route path="/vardagen" element={<AuthGate><VardagenPage /></AuthGate>} />

              {/* Vardagen Omdirigeringar */}
              <Route path="/liv" element={<RedirectLivToVardagen />} />
              <Route path="/kompasser" element={<Navigate to="/vardagen?tab=kompasser" replace />} />
              <Route path="/mabra" element={<Navigate to="/vardagen?tab=mabra" replace />} />
              <Route path="/planering" element={<Navigate to="/vardagen?tab=handling" replace />} />
              <Route path="/ekonomi" element={<Navigate to="/vardagen?tab=ekonomi" replace />} />
              <Route path="/drogfrihet" element={<Navigate to="/vardagen?tab=drogfrihet" replace />} />
              <Route path="/arbetsliv" element={<Navigate to="/vardagen?tab=arbetsliv" replace />} />
              <Route path="/stampla" element={<Navigate to="/vardagen?tab=arbetsliv" replace />} />
              <Route path="/liv/arbetsliv" element={<Navigate to="/vardagen?tab=arbetsliv" replace />} />
              <Route path="/liv/arbetsliv/*" element={<Navigate to="/vardagen?tab=arbetsliv" replace />} />

              {/* —— REFORM: FAMILJEN ZON —— */}
              <Route path="/familjen" element={<AuthGate><FamiljenPage /></AuthGate>} />

              {/* Familjen Omdirigeringar */}
              <Route path="/familj" element={<Navigate to="/familjen?tab=reflektion" replace />} />
              <Route path="/barnen" element={<Navigate to="/familjen?tab=reflektion" replace />} />
              <Route path="/hamn" element={<RedirectHamnToFamiljen />} />

              {/* —— REFORM: HJÄRTAT ZON —— */}
              <Route
                path={LIFE_JOURNAL.path}
                element={
                  <AuthGate>
                    <HjartatPage />
                  </AuthGate>
                }
              />

              {/* Hjärtat Omdirigeringar */}
              <Route path="/valv" element={<RedirectToLifeJournalTab tabKey="evidence" />} />
              <Route path="/speglar" element={<RedirectToLifeJournalTab tabKey="mirrors" />} />
              <Route
                path="/kunskap"
                element={
                  <Navigate
                    to={{
                      pathname: clusterPath('lifeJournal'),
                      search: `${registryTabSearch(LIFE_JOURNAL.tabs.evidence.path)}&vaultTab=kunskapsbank`,
                    }}
                    replace
                  />
                }
              />
              <Route
                path="/dossier"
                element={
                  <Navigate
                    to={{
                      pathname: clusterPath('lifeJournal'),
                      search: `${registryTabSearch(LIFE_JOURNAL.tabs.evidence.path)}&vaultTab=dossier`,
                    }}
                    replace
                  />
                }
              />

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
            </Routes>
          </MainLayout>
        }
      />
    </Routes>
  );
}
