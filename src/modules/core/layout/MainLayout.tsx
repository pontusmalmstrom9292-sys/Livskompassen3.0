import { useNavigate, useLocation } from 'react-router-dom';
import { FloatingDock } from './FloatingDock';
import { AmbientBackground } from './AmbientBackground';
import { AccountAuthMenu } from '../auth/AccountAuthMenu';
import { LivskompassMark } from '../ui/LivskompassMark';
import { Home } from 'lucide-react';
import { clsx } from 'clsx';
import { useStore } from '../store';
import { CognitiveLoadBar } from '../cognitive/CognitiveLoadBar';

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
  const safeMode = useStore((s) => s.ui.safeMode);

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
          <div className="app-header__brand">
            <div className="app-header__logo" aria-hidden>
              <LivskompassMark className="app-header__logo-mark" />
            </div>
            <h1 className="app-header__title">Livskompassen</h1>
          </div>

          <div className="app-header__cognitive">
            <CognitiveLoadBar variant="compact" />
          </div>

          <div className="app-header__actions">
            <HeaderHomeButton />
            <AccountAuthMenu />
            <div
              className={clsx(
                'header-glass-btn header-glass-btn--avatar header-glass-btn--mark',
                kompisAuraActive && 'header-glass-btn--mark-active',
              )}
              aria-hidden
            >
              <LivskompassMark className="header-glass-btn__mark" />
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-4 pb-36 pt-[5.25rem]">{children}</main>

      <FloatingDock />
    </div>
  );
}
