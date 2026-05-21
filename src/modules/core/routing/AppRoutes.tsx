import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { AuthGate } from '../auth/AuthGate';
import { HomePage } from '../pages/HomePage';
import { VardagenPage, type VardagenTab } from '../../kompasser';
import { SafeHarborPage } from '../../safe_harbor';
import { HjartatPage } from '../../dagbok';
import { FamiljenPage } from '../../barnens_livsloggar';

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

export function AppRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/vardagen" element={<VardagenPage />} />
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
      </Routes>
    </MainLayout>
  );
}
