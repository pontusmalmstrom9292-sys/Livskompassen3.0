import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { LifeBuoy } from 'lucide-react';
import { FloatingDock } from './FloatingDock';
import { FyrenWidgetBar } from '../components/FyrenWidgetBar';
import { FyrenWidgetProvider } from '../components/fyrenWidgetContext';

import { AppHeaderBar } from '../components/AppHeaderBar';
import { AmbientBackground } from './AmbientBackground';
import { KompisHeaderVaultButton } from '../components/KompisHeaderVaultButton';
import { AccountAuthMenu } from '../auth/AccountAuthMenu';
import { NavigationDrawer } from './NavigationDrawer';
import { FirestoreNetworkChip } from '../components/FirestoreNetworkChip';
import { SystemErrorBanner } from '../components/SystemErrorBanner';
import { isBarnportenChildRoute } from '@/features/onboarding/barnporten/constants/barnportenRoutes';
import { useStore } from '../store';
import { useSOSStore } from '../store/sosStore';
import { useTheme } from '../theme';
import { isDesignPackTheme } from '../theme/themePackDesign';
import { isMockupTheme } from '../theme/mockupTheme';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isScenicHome = location.pathname === '/';
  const user = useStore((s) => s.user);
  const kompisAuraActive = useStore((s) => s.system.kompisAuraActive);
  const activateSOS = useSOSStore((s) => s.activateSOS);
  const { themeId } = useTheme();
  const mockupSkin = isMockupTheme(themeId) || isDesignPackTheme(themeId);
  const barnportenChildShell = isBarnportenChildRoute(location.pathname);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  useEffect(() => {
    if (!user) setDrawerOpen(false);
  }, [user]);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const openAccount = useCallback(() => setAccountOpen(true), []);

  return (
    <FyrenWidgetProvider>
    <div
      className={clsx(
        'app-shell relative min-h-screen text-text font-sans selection:bg-accent/30',
        mockupSkin && 'app-shell--mockup-skin',
      )}
    >
      <AmbientBackground />

      <header className="app-header">
        <div className="app-header__inner">
          <AppHeaderBar
            menuExpanded={drawerOpen}
            onMenuClick={() => setDrawerOpen(true)}
            actions={
              <>
                <button
                  type="button"
                  onClick={activateSOS}
                  className="header-chrome-btn header-chrome-btn--round mr-1"
                  aria-label="Aktivera SOS-läge"
                >
                  <LifeBuoy className="w-6 h-6 text-red-400 hover:text-red-300 transition-colors" />
                </button>
                <AccountAuthMenu
                  open={accountOpen}
                  onOpenChange={setAccountOpen}
                  compactTrigger
                />
                <KompisHeaderVaultButton kompisAuraActive={kompisAuraActive} />
              </>
            }
          />
        </div>
      </header>

      <NavigationDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        onOpenSettings={openAccount}
      />

      <FirestoreNetworkChip />
      <SystemErrorBanner />

      <main
        className={clsx(
          'app-main relative z-10 mx-auto max-w-2xl px-4',
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
    </FyrenWidgetProvider>
  );
}
