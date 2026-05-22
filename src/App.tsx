import { AuthProvider, useZeroFootprint } from './modules/core/auth';
import { useShakeToKill } from './modules/core/hooks/useShakeToKill';
import { AppRoutes } from './modules/core/routing/AppRoutes';

function AppShell() {
  useZeroFootprint();
  useShakeToKill();
  return <AppRoutes />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
