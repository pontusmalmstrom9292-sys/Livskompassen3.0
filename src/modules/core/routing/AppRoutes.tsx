import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { AuthGate } from '../auth/AuthGate';
import { HomePage } from '../pages/HomePage';
import { DashboardPage } from '../../kompasser';
import { VaultPage } from '../../verklighetsvalvet';
import { SafeHarborPage } from '../../safe_harbor';
import { EconomyPage } from '../../ekonomi';
import { KunskapPage } from '../../kompis/components/KunskapPage';
import { DagbokPage } from '../../dagbok';
import { BarnensPage } from '../../barnens_livsloggar';
import { SpeglingsSystem } from '../../speglings_system';

export function AppRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/kompasser" element={<DashboardPage />} />
        <Route
          path="/valv"
          element={
            <AuthGate>
              <VaultPage />
            </AuthGate>
          }
        />
        <Route
          path="/hamn"
          element={
            <AuthGate>
              <SafeHarborPage />
            </AuthGate>
          }
        />
        <Route path="/ekonomi" element={<EconomyPage />} />
        <Route
          path="/dagbok"
          element={
            <AuthGate>
              <DagbokPage />
            </AuthGate>
          }
        />
        <Route
          path="/kunskap"
          element={
            <AuthGate>
              <KunskapPage />
            </AuthGate>
          }
        />
        <Route
          path="/barnen"
          element={
            <AuthGate>
              <BarnensPage />
            </AuthGate>
          }
        />
        <Route
          path="/speglar"
          element={
            <AuthGate>
              <SpeglingsSystem />
            </AuthGate>
          }
        />
      </Routes>
    </MainLayout>
  );
}
