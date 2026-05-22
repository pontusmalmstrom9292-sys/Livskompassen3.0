import { useNavigate, useLocation } from 'react-router-dom';
import { Compass, BookOpen } from 'lucide-react';
import { clsx } from 'clsx';
import { useStore } from '../store';
import { ModuleHubPanel } from './ModuleHubPanel';
import { HUB_CENTER } from './moduleHubConfig';

function CompassRose({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />
      <circle cx="32" cy="32" r="20" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.75" />
      <path
        d="M32 8 L34 28 L32 32 L30 28 Z"
        fill="currentColor"
        fillOpacity="0.35"
      />
      <path
        d="M32 56 L30 36 L32 32 L34 36 Z"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path
        d="M8 32 L28 30 L32 32 L28 34 Z"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path
        d="M56 32 L36 34 L32 32 L36 30 Z"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <circle cx="32" cy="32" r="2.5" fill="currentColor" fillOpacity="0.45" />
    </svg>
  );
}

function CompassHubButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const moduleHubOpen = useStore((s) => s.ui.moduleHubOpen);
  const setModuleHubOpen = useStore((s) => s.setModuleHubOpen);

  const onDagbok =
    location.pathname === HUB_CENTER.path ||
    location.pathname.startsWith(`${HUB_CENTER.path}/`);
  const showHeart = moduleHubOpen || onDagbok;
  const Icon = showHeart ? BookOpen : Compass;
  const isActive = moduleHubOpen || onDagbok;

  const handleClick = () => {
    if (moduleHubOpen) {
      setModuleHubOpen(false);
      return;
    }
    setModuleHubOpen(true);
    navigate(HUB_CENTER.path);
  };

  return (
    <button
      type="button"
      aria-label={showHeart ? 'Hjärtat — modulhub' : 'Öppna modulhub'}
      aria-expanded={moduleHubOpen}
      className={clsx(
        'dock-compass-hub',
        isActive && 'dock-compass-hub--active',
        moduleHubOpen && 'dock-compass-hub--open',
        showHeart && 'dock-compass-hub--heart',
      )}
      onClick={handleClick}
    >
      <span className="dock-compass-hub__plate">
        <CompassRose className="dock-compass-hub__rose" />
        <span className="dock-compass-hub__core">
          <Icon className="dock-compass-hub__icon" strokeWidth={1.65} />
        </span>
        <span className="dock-compass-hub__shine" aria-hidden />
      </span>
      <span className="dock-compass-hub__label">{showHeart ? 'Hjärtat' : 'Kompass'}</span>
    </button>
  );
}

export function FloatingDock() {
  const moduleHubOpen = useStore((s) => s.ui.moduleHubOpen);

  return (
    <div className="dock-shell">
      {moduleHubOpen && <ModuleHubPanel />}
      <nav className="dock-nav dock-nav--hub" aria-label="Modulhub">
        <CompassHubButton />
      </nav>
    </div>
  );
}
