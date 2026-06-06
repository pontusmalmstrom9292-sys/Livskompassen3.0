import { AppUnlockGate, AuthProvider, useZeroFootprint } from './modules/core/auth';
import { useMaterialPackSync } from './modules/core/lifeOs/useMaterialPackSync';
import { AppRoutes } from './modules/core/routing/AppRoutes';
import { ThemeProvider } from './modules/core/theme';
import { WidgetDeepLinkBridge } from '@/features/widgets/WidgetDeepLinkBridge';
import { useBarnportenWebManifest } from '@/features/onboarding/barnporten/hooks/useBarnportenWebManifest';

function AppShell() {
  useZeroFootprint();
  useMaterialPackSync();
  useBarnportenWebManifest();
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
