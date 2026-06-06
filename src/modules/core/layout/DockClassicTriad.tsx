import { useState } from 'react';
import type { ReactNode } from 'react';
import { BookOpen, Users, X } from 'lucide-react';
import { clsx } from 'clsx';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LivskompassMark } from '../ui/LivskompassMark';
import { useLongPress } from '../hooks/useLongPress';
import { openValvViaFyren } from '../auth/valvFyrenGate';
import { useStore } from '../store';
import { NAV_PATHS } from '../navigation/navTruth';
import { getPageContextSummary } from '../navigation/pageContextSummary';

function DockSideLink({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx('dock-classic__side', isActive && 'dock-classic__side--active')
      }
      aria-label={label}
    >
      <span className="dock-classic__side-icon" aria-hidden>
        {icon}
      </span>
      <span className="dock-classic__side-label">{label}</span>
    </NavLink>
  );
}

/** Kanon: Familjen · kompass (kontext vid tryck) · Dagbok — Valv endast 3s-håll på kompass. */
export function DockClassicTriad() {
  const location = useLocation();
  const navigate = useNavigate();
  const setSystemError = useStore((s) => s.setError);
  const [contextOpen, setContextOpen] = useState(false);
  const summary = getPageContextSummary(location.pathname, location.search);
  const isHome = location.pathname === '/';

  const valvLongPress = useLongPress({
    onLongPress: () => {
      setContextOpen(false);
      void openValvViaFyren(navigate, {
        onDenied: (message) => setSystemError(message),
      });
    },
    onClick: () => {},
    delayMs: 3000,
  });

  const { progress, isHolding, ...centerHoldHandlers } = valvLongPress;

  const onCenterTap = () => {
    if (isHome) {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setContextOpen(true);
  };

  return (
    <div className="dock-classic">
      <DockSideLink
        to="/familjen"
        label="Familjen"
        icon={<Users className="h-4 w-4" strokeWidth={1.5} />}
      />

      <button
        type="button"
        className={clsx(
          'dock-classic__center',
          isHome && location.pathname === '/' && 'dock-classic__center--active',
          isHolding && 'dock-classic__center--holding',
        )}
        aria-label={isHome ? 'Hem' : `Var du är: ${summary.title}`}
        aria-expanded={contextOpen}
        style={
          progress > 0
            ? ({ '--dock-hold': `${Math.round(progress * 100)}%` } as React.CSSProperties)
            : undefined
        }
        onClick={onCenterTap}
        {...centerHoldHandlers}
      >
        <span className="dock-classic__plate">
          <LivskompassMark className="dock-classic__mark" />
        </span>
      </button>

      <DockSideLink
        to={NAV_PATHS.HJARTAT}
        label="Dagbok"
        icon={<BookOpen className="h-4 w-4" strokeWidth={1.5} />}
      />

      {contextOpen ? (
        <div className="dock-classic__context" role="dialog" aria-label={summary.title}>
          <p className="dock-classic__context-title">{summary.title}</p>
          <p className="dock-classic__context-body">{summary.body}</p>
          <button
            type="button"
            className="dock-classic__context-close"
            aria-label="Stäng sammanfattning"
            onClick={() => setContextOpen(false)}
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
