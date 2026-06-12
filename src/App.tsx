import { AppUnlockGate, AuthProvider, useZeroFootprint } from './modules/core/auth';
import { useMaterialPackSync } from './modules/core/lifeOs/useMaterialPackSync';
import { AppRoutes } from './modules/core/routing/AppRoutes';
import { ThemeProvider } from './modules/core/theme';
import { WidgetDeepLinkBridge } from '@/features/widgets/WidgetDeepLinkBridge';
import { useBarnportenWebManifest } from '@/features/onboarding/barnporten/hooks/useBarnportenWebManifest';
import { ToastContainer } from './modules/core/ui/ToastContainer';
import { SOSOverlay } from './modules/features/sos/components/SOSOverlay';

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
        <ToastContainer />
        <SOSOverlay />
        <AppShell />
      </ThemeProvider>
    </AuthProvider>
  );
}
