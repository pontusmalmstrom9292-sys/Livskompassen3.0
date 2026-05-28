import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FloatingDock } from './FloatingDock';
import { FyrenSmartWidgetBar } from '../components/FyrenSmartWidgetBar';
import { AppHeaderBar } from '../components/AppHeaderBar';
import { AmbientBackground } from './AmbientBackground';
import { KompisAvatar } from '../../kompis/components/KompisAvatar';
import { AccountAuthMenu } from '../auth/AccountAuthMenu';
import { NavigationDrawer } from './NavigationDrawer';
import { FirestoreNetworkChip } from '../components/FirestoreNetworkChip';
import { useStore } from '../store';
import { vaultDrawerPath } from '../navigation/navTruth';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const kompisAuraActive = useStore((s) => s.system.kompisAuraActive);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  useEffect(() => {
    if (!user) setDrawerOpen(false);
  }, [user]);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const openAccount = useCallback(() => setAccountOpen(true), []);
  const openKunskapsbank = useCallback(() => {
    navigate(vaultDrawerPath('kunskapsbank'));
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
                  onClick={openKunskapsbank}
                  className="shrink-0 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-label="Öppna Kunskapsbank (Valv)"
                  title="Kunskapsbank"
                >
                  <KompisAvatar
                    size="sm"
                    state={kompisAuraActive ? 'analyzing' : 'idle'}
                    className="shrink-0"
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

      <main className="relative z-10 mx-auto max-w-2xl px-4 pb-24 pt-[5.75rem]">
        {children}
      </main>

      <FyrenSmartWidgetBar />
      <FloatingDock />
    </div>
  );
}
