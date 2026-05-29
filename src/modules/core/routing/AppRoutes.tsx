import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { WidgetRoutes } from '../../widgets/routing/WidgetRoutes';
import { AuthGate } from '../auth/AuthGate';
import { HomePage } from '../pages/HomePage';
import { ThemePreviewPage } from '../pages/ThemePreviewPage';
import { ThemeLabPage } from '../pages/ThemeLabPage';
import { HubLabPage } from '../pages/HubLabPage';
import { VardagenPage, type VardagenTab } from '../../wellbeing/compasses';
import { SafeHarborPage } from '../../family/safeHarbor';
import { HjartatPage } from '../../diary/diary';
import { FamiljenPage } from '../../family/children';
import { DossierPage } from '../../evidence/vault/dossier';
import { MabraPage } from '../../wellbeing/mabra';
import { PlaneringPage } from '../../admin/planning';
import {
  ProjektDetailPage,
  ProjektHubPage,
  ProjektNyPage,
  ProjektReglerPage,
} from '../../admin/projects';
import { BarnportenPage } from '../../barnporten';
import { ArbetslivHubPage } from '../../arbetsliv';
import { DrogfrihetHubPage } from '../../drogfrihet';
import { InstallningarPage } from '../pages/InstallningarPage';
import { KompisHubPage } from '../../evidence/kompis';

function RedirectToHjartatTab({ tab }: { tab: 'bevis' | 'speglar' }) {
  const location = useLocation();
  return (
    <Navigate
      to={{ pathname: '/dagbok', search: `?tab=${tab}` }}
      state={location.state}
      replace
    />
  );
}

function RedirectToVardagenTab({ tab }: { tab: VardagenTab }) {
  return (
    <Navigate
      to={{ pathname: '/vardagen', search: tab === 'kompasser' ? '' : `?tab=${tab}` }}
      replace
    />
  );
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
        <Route
          path="/vardagen"
          element={
            <AuthGate>
              <VardagenPage />
            </AuthGate>
          }
        />
        <Route path="/kompasser" element={<RedirectToVardagenTab tab="kompasser" />} />
        <Route path="/valv" element={<RedirectToHjartatTab tab="bevis" />} />
        <Route
          path="/hamn"
          element={
            <AuthGate>
              <SafeHarborPage />
            </AuthGate>
          }
        />
        <Route path="/ekonomi" element={<RedirectToVardagenTab tab="ekonomi" />} />
        <Route
          path="/arbetsliv"
          element={
            <AuthGate>
              <ArbetslivHubPage />
            </AuthGate>
          }
        />
        <Route path="/stampla" element={<Navigate to="/arbetsliv?tab=stampla" replace />} />
        <Route
          path="/dagbok"
          element={
            <AuthGate>
              <HjartatPage />
            </AuthGate>
          }
        />
        <Route path="/kunskap" element={<Navigate to="/dagbok?tab=bevis&vaultTab=kunskapsbank" replace />} />
        <Route
          path="/familjen"
          element={
            <AuthGate>
              <FamiljenPage />
            </AuthGate>
          }
        />
        <Route path="/barnen" element={<Navigate to="/familjen" replace />} />
        <Route path="/speglar" element={<RedirectToHjartatTab tab="speglar" />} />
        <Route
          path="/dossier"
          element={
            <AuthGate>
              <DossierPage />
            </AuthGate>
          }
        />
        <Route
          path="/mabra"
          element={
            <AuthGate>
              <MabraPage />
            </AuthGate>
          }
        />
        <Route
          path="/drogfrihet"
          element={
            <AuthGate>
              <DrogfrihetHubPage />
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
