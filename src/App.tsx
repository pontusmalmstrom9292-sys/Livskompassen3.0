import { AppUnlockGate, AuthProvider, useZeroFootprint } from './modules/core/auth';
import { AppRoutes } from './modules/core/routing/AppRoutes';
import { ThemeProvider } from './modules/core/theme';
import { WidgetDeepLinkBridge } from '@/features/widgets/WidgetDeepLinkBridge';

function AppShell() {
  useZeroFootprint();
  return (
    <AppUnlockGate>
      <WidgetDeepLinkBridge />
      <AppRoutes />
    </AppUnlockGate>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppShell />
      </ThemeProvider>
    </AuthProvider>
  );
}
