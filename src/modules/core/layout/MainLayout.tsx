import { useCallback, useEffect, useState } from 'react';
import { FloatingDock } from './FloatingDock';
import { FyrenSmartWidgetBar } from '../components/FyrenSmartWidgetBar';
import { AppHeaderBar } from '../components/AppHeaderBar';
import { AmbientBackground } from './AmbientBackground';
import { KompisAvatar } from '../../kompis/components/KompisAvatar';
import { AccountAuthMenu } from '../auth/AccountAuthMenu';
import { NavigationDrawer } from './NavigationDrawer';
import { useStore } from '../store';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const user = useStore((s) => s.user);
  const kompisAuraActive = useStore((s) => s.system.kompisAuraActive);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  useEffect(() => {
    if (!user) setDrawerOpen(false);
  }, [user]);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const openAccount = useCallback(() => setAccountOpen(true), []);

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
                <KompisAvatar
                  size="sm"
                  state={kompisAuraActive ? 'analyzing' : 'idle'}
                  className="pointer-events-none shrink-0"
                />
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

      <main className="relative z-10 mx-auto max-w-2xl px-4 pb-24 pt-[5.75rem]">
        {children}
      </main>

      <FyrenSmartWidgetBar />
      <FloatingDock />
    </div>
  );
}
