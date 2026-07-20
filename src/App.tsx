/* PROTECTED CORE COMPONENT: DO NOT MODIFY, REFRACTOR, OR REMOVE UI ELEMENTS. THIS FILE IS LOCKED FOR ARCHITECTURAL STABILITY. */
import { useLocation } from 'react-router-dom';
import { AppUnlockGate, AuthProvider, AuthErrorBoundary, useZeroFootprint } from './modules/core/auth';
import { useMaterialPackSync } from './modules/core/lifeOs/useMaterialPackSync';
import { useEvolutionSync } from './modules/core/hooks/useEvolutionSync';
import { useAdaptationSync } from './modules/core/hooks/useAdaptationSync';
import { useAdaptationSignalRouter } from './modules/core/hooks/useAdaptationSignalRouter';
import { useMaterialPackNotification } from './modules/core/hooks/useMaterialPackNotification';
import { useNativeBackHandler } from './modules/core/hooks/useNativeBackHandler';
import { useSystemChromeFusion } from './modules/core/hooks/useSystemChromeFusion';
import { AppRoutes } from './modules/core/routing/AppRoutes';
import { ThemeProvider } from './modules/core/theme';
import { WidgetDeepLinkBridge } from '@/features/widgets/WidgetDeepLinkBridge';
import { useBarnportenWebManifest } from '@/features/onboarding/barnporten/hooks/useBarnportenWebManifest';
import { ToastContainer } from './modules/core/ui/ToastContainer';
import { InactivityBlurOverlay } from './modules/core/ui/InactivityBlurOverlay';
import { ZenModeTrigger } from './modules/core/ui/ZenModeTrigger';
import { SOSOverlay } from './modules/features/sos/components/SOSOverlay';
import { QuickCaptureOverlay } from './modules/features/voiceToVault/components/QuickCaptureOverlay';
import { SystemStatusPanel } from '@/features/dev/SystemStatusPanel';

function AppShell() {
  useZeroFootprint();
  useMaterialPackSync();
  useEvolutionSync();
  useAdaptationSync();
  useAdaptationSignalRouter();
  useMaterialPackNotification();
  useNativeBackHandler();
  useSystemChromeFusion();
  useBarnportenWebManifest();
  const { pathname } = useLocation();
  const isWidgetRoute = pathname.startsWith('/widget');

  return (
    <AppUnlockGate>
      <WidgetDeepLinkBridge />
      <InactivityBlurOverlay />
      {!isWidgetRoute ? <ZenModeTrigger /> : null}
      {!isWidgetRoute ? <QuickCaptureOverlay /> : null}
      {!isWidgetRoute ? <SystemStatusPanel /> : null}
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
        <AuthErrorBoundary>
          <AppShell />
        </AuthErrorBoundary>
      </ThemeProvider>
    </AuthProvider>
  );
}
