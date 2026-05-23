import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { WidgetRoutes } from '../../widgets/routing/WidgetRoutes';
import { AuthGate } from '../auth/AuthGate';
import { HomePage } from '../pages/HomePage';
import { VardagenPage, type VardagenTab } from '../../kompasser';
import { SafeHarborPage } from '../../safe_harbor';
import { HjartatPage } from '../../dagbok';
import { FamiljenPage } from '../../barnens_livsloggar';
import { DossierPage } from '../../dossier';
import { MabraPage } from '../../mabra';
import { PlaneringPage } from '../../planering';
import { ProjektHubPage } from '../../projekt';

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
          path="/dagbok"
          element={
            <AuthGate>
              <HjartatPage />
            </AuthGate>
          }
        />
        <Route path="/kunskap" element={<RedirectToVardagenTab tab="kunskap" />} />
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
        <Route path="/projekt/ny" element={<Navigate to="/projekt" replace />} />
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
