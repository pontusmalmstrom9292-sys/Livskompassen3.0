import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { WidgetRoutes } from '@/features/widgets/routing/WidgetRoutes';
import { AuthGate } from '../auth/AuthGate';
import { HomePage } from '../pages/HomePage';
import { ThemePreviewPage } from '../pages/ThemePreviewPage';
import { ThemeLabPage } from '../pages/ThemeLabPage';
import { HubLabPage } from '../pages/HubLabPage';
import { HjartatPage } from '@/features/lifeJournal/diary/diary';
import { DossierPage } from '@/features/lifeJournal/evidence/vault/dossier';
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
import { LivShellPage, FamiljShellPage } from '@/modules/shell';
import { ArbetslivHubPage } from '@/features/dailyLife/arbetsliv';
import type { VardagenTab } from '@/features/dailyLife/wellbeing/compasses';
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

function RedirectToVardagenTab({ tab }: { tab: VardagenTab }) {
  if (tab === 'ekonomi') {
    return <Navigate to="/liv?tab=kompasser&vardagenTab=ekonomi" replace />;
  }
  return <Navigate to="/liv?tab=kompasser" replace />;
}

/** Bevarar ?tab=ekonomi vid flytt från legacy /vardagen. */
function RedirectVardagenToLiv() {
  const location = useLocation();
  const tab = new URLSearchParams(location.search).get('tab');
  if (tab === 'ekonomi') {
    return <Navigate to="/liv?tab=kompasser&vardagenTab=ekonomi" replace />;
  }
  return <Navigate to="/liv?tab=kompasser" replace />;
}

function MainAppRoutes() {
  return (
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
        <Route path="/kompasser" element={<RedirectToVardagenTab tab="kompasser" />} />
        <Route path="/valv" element={<RedirectToLifeJournalTab tabKey="evidence" />} />
        <Route path="/liv" element={<AuthGate><LivShellPage /></AuthGate>} />
        <Route path="/liv/arbetsliv" element={<Navigate to="/arbetsliv" replace />} />
        <Route
          path="/liv/arbetsliv/*"
          element={<Navigate to="/arbetsliv" replace />}
        />
        <Route path="/mabra" element={<Navigate to="/liv?tab=mabra" replace />} />
        <Route path="/planering" element={<Navigate to="/liv?tab=handling" replace />} />
        <Route path="/vardagen" element={<RedirectVardagenToLiv />} />
        <Route
          path="/arbetsliv"
          element={
            <AuthGate>
              <ArbetslivHubPage />
            </AuthGate>
          }
        />
        <Route path="/stampla" element={<Navigate to="/arbetsliv?tab=stampla" replace />} />
        <Route path="/familj" element={<AuthGate><FamiljShellPage /></AuthGate>} />
        <Route path="/familjen" element={<Navigate to="/familj?tab=reflektion" replace />} />
        <Route path="/barnen" element={<Navigate to="/familj?tab=reflektion" replace />} />
        <Route path="/hamn" element={<Navigate to="/familj?tab=hamn" replace />} />
        <Route path="/drogfrihet" element={<Navigate to="/familj?tab=drogfrihet" replace />} />
        <Route path="/ekonomi" element={<RedirectToVardagenTab tab="ekonomi" />} />
        <Route
          path={LIFE_JOURNAL.path}
          element={
            <AuthGate>
              <HjartatPage />
            </AuthGate>
          }
        />
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
        <Route path="/speglar" element={<RedirectToLifeJournalTab tabKey="mirrors" />} />
        <Route
          path="/dossier"
          element={
            <AuthGate>
              <DossierPage />
            </AuthGate>
          }
        />
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
        <Route
          path="/barnporten"
          element={<BarnportenPage />}
        />
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
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/widget/*" element={<WidgetRoutes />} />
      <Route
        path="/*"
        element={
          <MainLayout>
            <MainAppRoutes />
          </MainLayout>
        }
      />
    </Routes>
  );
}
