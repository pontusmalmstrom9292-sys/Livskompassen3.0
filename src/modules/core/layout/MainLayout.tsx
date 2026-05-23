import { useNavigate, useLocation } from 'react-router-dom';
import { FloatingDock } from './FloatingDock';
import { AmbientBackground } from './AmbientBackground';
import { KompisAvatar } from '../../kompis/components/KompisAvatar';
import { AccountAuthMenu } from '../auth/AccountAuthMenu';
import { Compass, Home } from 'lucide-react';
import { clsx } from 'clsx';
import { useStore } from '../store';

function HeaderHomeButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const setModuleHubOpen = useStore((s) => s.setModuleHubOpen);
  const isActive = location.pathname === '/';

  return (
    <button
      type="button"
      aria-label="Hem"
      aria-current={isActive ? 'page' : undefined}
      onClick={() => {
        setModuleHubOpen(false);
        navigate('/');
      }}
      className={clsx('header-glass-btn', isActive && 'header-glass-btn--active')}
    >
      <Home className="h-4 w-4" strokeWidth={1.75} />
      <span>Hem</span>
    </button>
  );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const kompisAuraActive = useStore((s) => s.system.kompisAuraActive);

  return (
    <div className="relative min-h-screen bg-bg text-text font-sans selection:bg-accent/30">
      <AmbientBackground />

      <header className="app-header">
        <div className="glass-header-bar">
          <div className="app-header__brand">
            <div className="app-header__logo">
              <Compass className="h-4 w-4 text-accent" strokeWidth={1.75} />
            </div>
            <h1 className="app-header__title">Livskompassen</h1>
          </div>

          <div className="app-header__actions">
            <HeaderHomeButton />
            <AccountAuthMenu />
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

      <main className="relative z-10 mx-auto max-w-2xl px-4 pb-36 pt-[4.75rem]">{children}</main>

      <FloatingDock />
    </div>
  );
}
