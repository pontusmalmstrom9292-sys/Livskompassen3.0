import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { FloatingDock } from './FloatingDock';
import { FyrenWidgetBar } from '../components/FyrenWidgetBar';
import { FyrenSmartWidgetBar } from '../components/FyrenSmartWidgetBar';
import { AppHeaderBar } from '../components/AppHeaderBar';
import { AmbientBackground } from './AmbientBackground';
import { KompisAvatar } from '../../evidence/kompis/components/KompisAvatar';
import { AccountAuthMenu } from '../auth/AccountAuthMenu';
import { NavigationDrawer } from './NavigationDrawer';
import { FirestoreNetworkChip } from '../components/FirestoreNetworkChip';
import { useStore } from '../store';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isScenicHome = location.pathname === '/';
  const user = useStore((s) => s.user);
  const kompisAuraActive = useStore((s) => s.system.kompisAuraActive);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  useEffect(() => {
    if (!user) setDrawerOpen(false);
  }, [user]);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const openAccount = useCallback(() => setAccountOpen(true), []);
  const openKompisHub = useCallback(() => {
    navigate('/kompis');
  }, [navigate]);

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
                <button
                  type="button"
                  onClick={openKompisHub}
                  className="header-chrome-btn header-chrome-btn--round shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-label="Öppna Kompis — välj väg"
                  title="Kompis"
                >
                  <KompisAvatar
                    size="sm"
                    chromeEmbed
                    state={kompisAuraActive ? 'analyzing' : 'idle'}
                    className="kompis-avatar--header-chrome shrink-0"
                  />
                </button>
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

      <main
        className={clsx(
          'app-main relative z-10 mx-auto max-w-2xl px-4',
          isScenicHome ? 'pt-[4.65rem]' : 'pt-[5.75rem]',
        )}
      >
        {children}
      </main>

      <FyrenSmartWidgetBar />
      <FyrenWidgetBar />
      <FloatingDock />
    </div>
  );
}
