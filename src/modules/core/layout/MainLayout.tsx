import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { FloatingDock } from './FloatingDock';
import { FyrenSmartWidgetBar } from '../components/FyrenSmartWidgetBar';
import { FyrenHeaderQuickStrip } from '../components/FyrenHeaderQuickStrip';
import { AppHeaderBar } from '../components/AppHeaderBar';
import { AmbientBackground } from './AmbientBackground';
import { KompisAvatar } from '../../kompis/components/KompisAvatar';
import { AccountAuthMenu } from '../auth/AccountAuthMenu';
import { NavigationDrawer } from './NavigationDrawer';
import { useStore } from '../store';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const kompisAuraActive = useStore((s) => s.system.kompisAuraActive);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const isHome = location.pathname === '/';

  return (
    <div className="app-shell relative min-h-screen text-text font-sans selection:bg-accent/30">
      <AmbientBackground />

      <header className="app-header">
        <div className="app-header__inner">
          <AppHeaderBar
            menuExpanded={drawerOpen}
            onMenuClick={() => setDrawerOpen(true)}
            actions={
              <>
                <AccountAuthMenu
                  open={accountOpen}
                  onOpenChange={setAccountOpen}
                  compactTrigger
                />
                <div className="header-glass-btn header-glass-btn--avatar" aria-hidden>
                  <KompisAvatar
                    size="sm"
                    state={kompisAuraActive ? 'analyzing' : 'idle'}
                    className="border-0 bg-transparent"
                  />
                </div>
              </>
            }
          />
          <FyrenHeaderQuickStrip />
        </div>
      </header>

      <NavigationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpenSettings={() => setAccountOpen(true)}
      />

      <main
        className={clsx(
          'relative z-10 mx-auto max-w-2xl px-4 pb-24',
          isHome ? 'pt-[8.5rem]' : 'pt-[5.75rem]',
        )}
      >
        {children}
      </main>

      <FyrenSmartWidgetBar />
      <FloatingDock />
    </div>
  );
}
