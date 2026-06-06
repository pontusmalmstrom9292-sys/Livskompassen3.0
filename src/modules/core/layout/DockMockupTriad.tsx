import { Users } from 'lucide-react';
import { clsx } from 'clsx';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LivskompassMark } from '../ui/LivskompassMark';
import { ValvArchIcon } from '../ui/ValvArchIcon';
import { useLongPress } from '../hooks/useLongPress';
import { openValvViaFyren } from '../auth/valvFyrenGate';
import { useStore } from '../store';
import { NAV_PATHS } from '../navigation/navTruth';

/** Mockup-dock: Familjen · kompass (guld båge) · Valv — som referensbilderna. */
export function DockMockupTriad() {
  const location = useLocation();
  const navigate = useNavigate();
  const setSystemError = useStore((s) => s.setError);
  const isHome = location.pathname === '/';

  const valvLongPress = useLongPress({
    onLongPress: () => {
      void openValvViaFyren(navigate, {
        onDenied: (message) => setSystemError(message),
      });
    },
    onClick: () => {},
    delayMs: 3000,
  });

  const { progress, isHolding, ...centerHoldHandlers } = valvLongPress;

  const onCenterTap = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="dock-mockup">
      <NavLink
        to="/familj"
        className={({ isActive }) =>
          clsx('dock-mockup__side', (isActive || location.pathname.startsWith('/familj')) && 'dock-mockup__side--active')
        }
        aria-label="Familjen"
      >
        <span className="dock-mockup__side-icon">
          <Users className="h-4 w-4" strokeWidth={1.5} />
        </span>
        <span className="dock-mockup__side-label">Familjen</span>
      </NavLink>

      <div className="dock-mockup__center-wrap">
        <span className="dock-mockup__arc" aria-hidden />
        <button
          type="button"
          className={clsx(
            'dock-mockup__center',
            isHome && 'dock-mockup__center--active',
            isHolding && 'dock-mockup__center--holding',
          )}
          aria-label="Hem"
          style={
            progress > 0
              ? ({ '--dock-hold': `${Math.round(progress * 100)}%` } as React.CSSProperties)
              : undefined
          }
          onClick={onCenterTap}
          {...centerHoldHandlers}
        >
          <span className="dock-mockup__plate">
            <LivskompassMark className="dock-mockup__mark" />
          </span>
        </button>
        <span className="dock-mockup__center-label">Hamn</span>
      </div>

      <NavLink
        to={NAV_PATHS.VALVET}
        className={({ isActive }) =>
          clsx(
            'dock-mockup__side',
            (isActive ||
              location.pathname.startsWith('/valvet') ||
              location.pathname.startsWith('/dagbok')) &&
              'dock-mockup__side--active',
          )
        }
        aria-label="Valv"
      >
        <span className="dock-mockup__side-icon">
          <ValvArchIcon className="h-4 w-4" />
        </span>
        <span className="dock-mockup__side-label">Valv</span>
      </NavLink>
    </div>
  );
}
