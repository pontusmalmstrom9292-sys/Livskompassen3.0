import { AuthProvider, useZeroFootprint } from './modules/core/auth';
import { useShakeToKill } from './modules/core/hooks/useShakeToKill';
import { AppRoutes } from './modules/core/routing/AppRoutes';
import { ThemeProvider } from './modules/core/theme';
import { WidgetDeepLinkBridge } from './modules/widgets/WidgetDeepLinkBridge';

function AppShell() {
  useZeroFootprint();
  useShakeToKill();
  return (
    <>
      <WidgetDeepLinkBridge />
      <AppRoutes />
    </>
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
