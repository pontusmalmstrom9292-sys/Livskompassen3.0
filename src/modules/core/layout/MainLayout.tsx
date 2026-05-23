import { useNavigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { FloatingDock } from './FloatingDock';
import { AmbientBackground } from './AmbientBackground';
import { AccountAuthMenu } from '../auth/AccountAuthMenu';
import { LivskompassMark } from '../ui/LivskompassMark';
import { Home } from 'lucide-react';
import { clsx } from 'clsx';
import { useStore } from '../store';
import { HeaderCognitiveMenu } from './HeaderCognitiveMenu';

function HeaderNavButton({
  active,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
      className={clsx('header-segment__btn', active && 'header-segment__btn--active')}
    >
      {children}
    </button>
  );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const setModuleHubOpen = useStore((s) => s.setModuleHubOpen);
  const safeMode = useStore((s) => s.ui.safeMode);
  const isHome = location.pathname === '/';

  const goHome = () => {
    setModuleHubOpen(false);
    navigate('/');
  };

  return (
    <div
      className={clsx(
        'relative min-h-screen bg-bg text-text font-sans selection:bg-accent/30',
        safeMode && 'app-layout--safe-mode',
      )}
    >
      <AmbientBackground />

      <header className="app-header">
        <div className="glass-header-bar">
          <button type="button" className="app-header__brand" onClick={goHome} aria-label="Hem — Livskompassen">
            <span className="app-header__logo" aria-hidden>
              <LivskompassMark className="app-header__logo-mark" />
            </span>
            <span className="app-header__title">Livskompassen</span>
          </button>

          <div className="app-header__tray">
            <HeaderCognitiveMenu />
            <nav className="header-segment" aria-label="Huvudnavigering">
              <HeaderNavButton active={isHome} label="Hem" onClick={goHome}>
                <Home className="h-4 w-4" strokeWidth={1.75} />
              </HeaderNavButton>
              <AccountAuthMenu compact />
            </nav>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-4 pb-36 pt-[4.75rem]">{children}</main>

      <FloatingDock />
    </div>
  );
}
