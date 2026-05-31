import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { WidgetRoutes } from '../../widgets/routing/WidgetRoutes';
import { AuthGate } from '../auth/AuthGate';
import { HomePage } from '../pages/HomePage';
import { ThemePreviewPage } from '../pages/ThemePreviewPage';
import { ThemeLabPage } from '../pages/ThemeLabPage';
import { HubLabPage } from '../pages/HubLabPage';
import { HjartatPage } from '../../diary/diary';
import { DossierPage } from '../../evidence/vault/dossier';
import {
  ProjektDetailPage,
  ProjektHubPage,
  ProjektMaterialPackPage,
  ProjektNyPage,
  ProjektReglerPage,
} from '../../admin/projects';
import { BarnportenPage } from '../../barnporten';
import { InstallningarPage } from '../pages/InstallningarPage';
import { KompisHubPage } from '../../evidence/kompis';
import { LivShellPage, FamiljShellPage } from '../../shell';
import type { VardagenTab } from '../../wellbeing/compasses';

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
  const search = tab === 'kompasser' ? '?tab=kompasser' : `?tab=${tab}`;
  return <Navigate to={{ pathname: '/liv', search }} replace />;
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
        <Route path="/valv" element={<RedirectToHjartatTab tab="bevis" />} />
        <Route path="/liv" element={<AuthGate><LivShellPage /></AuthGate>} />
        <Route path="/mabra" element={<Navigate to="/liv?tab=mabra" replace />} />
        <Route path="/planering" element={<Navigate to="/liv?tab=handling" replace />} />
        <Route path="/vardagen" element={<Navigate to="/liv?tab=kompasser" replace />} />
        <Route path="/arbetsliv" element={<Navigate to="/liv?tab=arbetsliv" replace />} />
        <Route path="/stampla" element={<Navigate to="/liv?tab=arbetsliv" replace />} />
        <Route path="/familj" element={<AuthGate><FamiljShellPage /></AuthGate>} />
        <Route path="/familjen" element={<Navigate to="/familj?tab=reflektion" replace />} />
        <Route path="/barnen" element={<Navigate to="/familj?tab=reflektion" replace />} />
        <Route path="/hamn" element={<Navigate to="/familj?tab=hamn" replace />} />
        <Route path="/drogfrihet" element={<Navigate to="/familj?tab=drogfrihet" replace />} />
        <Route path="/ekonomi" element={<RedirectToVardagenTab tab="ekonomi" />} />
        <Route
          path="/dagbok"
          element={
            <AuthGate>
              <HjartatPage />
            </AuthGate>
          }
        />
        <Route path="/kunskap" element={<Navigate to="/dagbok?tab=bevis&vaultTab=kunskapsbank" replace />} />
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
