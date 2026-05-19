import { AuthProvider, useZeroFootprint } from './modules/core/auth';
import { AppRoutes } from './modules/core/routing/AppRoutes';

function AppShell() {
  useZeroFootprint();
  return <AppRoutes />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
