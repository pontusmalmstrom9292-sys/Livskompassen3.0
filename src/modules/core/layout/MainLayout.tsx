import { useState } from 'react';
import { FloatingDock } from './FloatingDock';
import { FyrenWidgetBar } from '../components/FyrenWidgetBar';
import { AmbientBackground } from './AmbientBackground';
import { KompisAvatar } from '../../kompis/components/KompisAvatar';
import { AccountAuthMenu } from '../auth/AccountAuthMenu';
import { NavigationDrawer } from './NavigationDrawer';
import { Menu } from 'lucide-react';
import { useStore } from '../store';
import { LivskompassMark } from '../ui/LivskompassMark';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const kompisAuraActive = useStore((s) => s.system.kompisAuraActive);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-bg text-text font-sans selection:bg-accent/30">
      <AmbientBackground />

      <header className="app-header">
        <div className="glass-header-bar glass-header-bar--kanon">
          <button
            type="button"
            className="header-menu-btn"
            aria-label="Öppna meny"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <div className="app-header__brand app-header__brand--kanon">
            <div className="app-header__logo">
              <LivskompassMark className="h-6 w-6 text-accent" />
            </div>
            <h1 className="app-header__title app-header__title--kanon">LIVSKOMPASSEN</h1>
          </div>

          <div className="app-header__actions app-header__actions--kanon">
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
          </div>
        </div>
      </header>

      <NavigationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpenSettings={() => setAccountOpen(true)}
      />

      <main className="relative z-10 mx-auto max-w-2xl px-4 pb-28 pt-[4.75rem]">{children}</main>

      <FyrenWidgetBar />
      <FloatingDock />
    </div>
  );
}
