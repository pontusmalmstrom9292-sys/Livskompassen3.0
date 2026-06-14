import { AppUnlockGate, AuthProvider, useZeroFootprint } from './modules/core/auth';
import { useMaterialPackSync } from './modules/core/lifeOs/useMaterialPackSync';
import { useEvolutionSync } from './modules/core/hooks/useEvolutionSync';
import { AppRoutes } from './modules/core/routing/AppRoutes';
import { ThemeProvider } from './modules/core/theme';
import { WidgetDeepLinkBridge } from '@/features/widgets/WidgetDeepLinkBridge';
import { useBarnportenWebManifest } from '@/features/onboarding/barnporten/hooks/useBarnportenWebManifest';
import { ToastContainer } from './modules/core/ui/ToastContainer';
import { SOSOverlay } from './modules/features/sos/components/SOSOverlay';
import { QuickCaptureOverlay } from './modules/features/voiceToVault/components/QuickCaptureOverlay';
import { LayoutShell } from './components/LayoutShell';

function AppShell() {
  useZeroFootprint();
  useMaterialPackSync();
  useEvolutionSync();
  useBarnportenWebManifest();
  return (
    <AppUnlockGate>
      <WidgetDeepLinkBridge />
      <QuickCaptureOverlay />
      <LayoutShell>
        <AppRoutes />
      </LayoutShell>
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
