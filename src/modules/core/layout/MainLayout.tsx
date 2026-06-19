/* PROTECTED CORE COMPONENT: DO NOT MODIFY, REFRACTOR, OR REMOVE UI ELEMENTS. THIS FILE IS LOCKED FOR ARCHITECTURAL STABILITY. */
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { FloatingDock } from './FloatingDock';
import { FyrenWidgetBar } from '../components/FyrenWidgetBar';
import {
  FyrenHeaderQuickProvider,
  FyrenHeaderQuickToggle,
} from '../components/FyrenSideQuickDock';
import { FyrenWidgetProvider } from '../components/fyrenWidgetContext';

import { AppHeaderBar } from '../components/AppHeaderBar';
import { AmbientBackground } from './AmbientBackground';
import { KompisHeaderVaultButton } from '../components/KompisHeaderVaultButton';
import { AccountAuthMenu } from '../auth/AccountAuthMenu';
import { NavigationDrawer } from './NavigationDrawer';
import { FirestoreNetworkChip } from '../components/FirestoreNetworkChip';
import { SystemErrorBanner } from '../components/SystemErrorBanner';
import { useDesignPack } from '../design/useDesignPack';
import { isBarnportenChildRoute } from '@/features/onboarding/barnporten/constants/barnportenRoutes';
import { useStore } from '../store';
import { useTheme } from '../theme';
import { getTheme } from '../theme/themeRegistry';
import { isMockupTheme } from '../theme/mockupTheme';
import { themeUsesDesignPackChrome } from '../theme/themePackDesign';
import { useCapacityScore } from '../store/useCapacityGate';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isScenicHome = location.pathname === '/';
  const user = useStore((s) => s.user);
  const kompisAuraActive = useStore((s) => s.system.kompisAuraActive);
  const isMenuOpen = useStore((s) => s.ui.isMenuOpen);
  const setMenuOpen = useStore((s) => s.setMenuOpen);
  const { themeId } = useTheme();
  const { active: designPackActive } = useDesignPack();
  const mockupSkin = isMockupTheme(themeId) || themeUsesDesignPackChrome(getTheme(themeId));
  const barnportenChildShell = isBarnportenChildRoute(location.pathname);
  const [accountOpen, setAccountOpen] = useState(false);
  const slimHeaderChrome = designPackActive && isScenicHome;
  const capacityScore = useCapacityScore();
  const isLowCapacity = capacityScore > 0 && capacityScore < 50;

  useEffect(() => {
    if (!user) setMenuOpen(false);
  }, [user, setMenuOpen]);

  return (
    <FyrenWidgetProvider>
    <FyrenHeaderQuickProvider>
    <div
      className={clsx(
        'app-shell relative min-h-screen text-text font-sans selection:bg-accent/30',
        mockupSkin && 'app-shell--mockup-skin',
        isLowCapacity && 'capacity-low'
      )}
    >
      <AmbientBackground />

      <header className="app-header">
        <div className="app-header__inner">
          <AppHeaderBar
            menuExpanded={isMenuOpen}
            onMenuClick={() => setMenuOpen(true)}
            actions={
              slimHeaderChrome ? (
                <>
                  <FyrenHeaderQuickToggle />
                  <KompisHeaderVaultButton kompisAuraActive={kompisAuraActive} />
                </>
              ) : (
                <>
                  <FyrenHeaderQuickToggle />
                  <AccountAuthMenu
                    open={accountOpen}
                    onOpenChange={setAccountOpen}
                    compactTrigger
                  />
                  <KompisHeaderVaultButton kompisAuraActive={kompisAuraActive} />
                </>
              )
            }
          />
        </div>
      </header>

      <NavigationDrawer />

      <FirestoreNetworkChip />
      <SystemErrorBanner />

      <main
        className={clsx(
          'app-main relative z-10 mx-auto flex min-h-0 w-full max-w-2xl flex-col px-4',
          isScenicHome
            ? 'pt-[calc(4.65rem+env(safe-area-inset-top,0px))]'
            : 'pt-[calc(5.75rem+env(safe-area-inset-top,0px))]',
          barnportenChildShell && 'pb-16',
        )}
      >
        {children}
      </main>

      {!barnportenChildShell ? (
        <>
          <FyrenWidgetBar />
          <FloatingDock />
        </>
      ) : null}
    </div>
    </FyrenHeaderQuickProvider>
    </FyrenWidgetProvider>
  );
}
