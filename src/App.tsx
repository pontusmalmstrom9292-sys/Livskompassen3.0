/* PROTECTED CORE COMPONENT: DO NOT MODIFY, REFRACTOR, OR REMOVE UI ELEMENTS. THIS FILE IS LOCKED FOR ARCHITECTURAL STABILITY. */
import { AppUnlockGate, AuthProvider, useZeroFootprint } from './modules/core/auth';
import { useMaterialPackSync } from './modules/core/lifeOs/useMaterialPackSync';
import { useEvolutionSync } from './modules/core/hooks/useEvolutionSync';
import { useAdaptationSync } from './modules/core/hooks/useAdaptationSync';
import { useAdaptationSignalRouter } from './modules/core/hooks/useAdaptationSignalRouter';
import { AppRoutes } from './modules/core/routing/AppRoutes';
import { ThemeProvider } from './modules/core/theme';
import { WidgetDeepLinkBridge } from '@/features/widgets/WidgetDeepLinkBridge';
import { useBarnportenWebManifest } from '@/features/onboarding/barnporten/hooks/useBarnportenWebManifest';
import { ToastContainer } from './modules/core/ui/ToastContainer';
import { SOSOverlay } from './modules/features/sos/components/SOSOverlay';
import { QuickCaptureOverlay } from './modules/features/voiceToVault/components/QuickCaptureOverlay';
import { SystemStatusPanel } from '@/features/dev/SystemStatusPanel';

function AppShell() {
  useZeroFootprint();
  useMaterialPackSync();
  useEvolutionSync();
  useAdaptationSync();
  useAdaptationSignalRouter();
  useBarnportenWebManifest();
  return (
    <AppUnlockGate>
      <WidgetDeepLinkBridge />
      <QuickCaptureOverlay />
      <SystemStatusPanel />
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
