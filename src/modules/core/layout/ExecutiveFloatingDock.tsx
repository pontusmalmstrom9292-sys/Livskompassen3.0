import { useCallback, type CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { CalendarDays, Home, Inbox, Menu } from 'lucide-react';
import { openValvViaFyren } from '../auth/valvFyrenGate';
import { useExecutiveHomeChrome } from '../home/ExecutiveHomeChromeContext';
import { useLongPress } from '../hooks/useLongPress';
import { NAV_PATHS } from '../navigation/navTruth';
import { useStore } from '../store';
import { ExecutiveDecorCompass } from '../ui/executive';
import { FyrenProgressRing } from '../ui/FyrenProgressRing';
import { FyrenDockHandle } from '../components/FyrenWidgetBar';
import { useHeaderPanelStyle } from './headerPanelStyle';

type DockItemProps = {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
};

function ExecDockItem({ label, icon, active, onClick }: DockItemProps) {
  return (
    <button
      type="button"
      className={clsx('exec-floating-dock__item', active && 'exec-floating-dock__item--active')}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
    >
      <span className="exec-floating-dock__item-icon" aria-hidden>
        {icon}
      </span>
    </button>
  );
}

/** Executive bottom dock — Hem · Ekonomi · kompass · Inkast · Mer (mockup v1). */
export function ExecutiveFloatingDock() {
  const location = useLocation();
  const navigate = useNavigate();
  const setSystemError = useStore((s) => s.setError);
  const setMenuOpen = useStore((s) => s.setMenuOpen);
  const { pathname, search } = location;
  const panelStyle = useHeaderPanelStyle();
  const { toggleSnabbstart, snabbstartOpen } = useExecutiveHomeChrome();

  const isHome = pathname === '/';
  const isEkonomi =
    pathname.startsWith('/vardagen') && new URLSearchParams(search).get('tab') === 'ekonomi';
  const isInkast = pathname.startsWith('/planering/input');

  const fyrenToValv = useCallback(
    () =>
      void openValvViaFyren(navigate, {
        onDenied: (message) => setSystemError(message),
      }),
    [navigate, setSystemError],
  );

  const centerPress = useLongPress({
    onLongPress: fyrenToValv,
    onClick: () => {
      if (isHome) {
        toggleSnabbstart();
        return;
      }
      navigate('/');
    },
    delayMs: 3000,
  });

  const { progress, isHolding, ...centerHoldHandlers } = centerPress;
  const showFyrenRing = progress > 0;

  return (
    <div className="dock-shell dock-shell--executive">
      <FyrenDockHandle />
      <nav className="exec-floating-dock" aria-label="Huvudnavigation" data-panel-style={panelStyle}>
          <div className="exec-floating-dock__rail">
            <ExecDockItem
              label="Hem"
              icon={<Home className="exec-floating-dock__glyph" strokeWidth={1.65} />}
              active={isHome}
              onClick={() => navigate('/')}
            />
            <ExecDockItem
              label="Ekonomi"
              icon={<CalendarDays className="exec-floating-dock__glyph" strokeWidth={1.65} />}
              active={isEkonomi}
              onClick={() => navigate(`${NAV_PATHS.VARDAGEN}?tab=ekonomi`)}
            />
            <div className="exec-floating-dock__fab-gap" aria-hidden />
            <ExecDockItem
              label="Inkast"
              icon={<Inbox className="exec-floating-dock__glyph" strokeWidth={1.65} />}
              active={isInkast}
              onClick={() => navigate('/planering/input?inputMode=inkast')}
            />
            <ExecDockItem
              label="Mer"
              icon={<Menu className="exec-floating-dock__glyph" strokeWidth={1.65} />}
              onClick={() => setMenuOpen(true)}
            />
          </div>

          <button
            type="button"
            className={clsx(
              'exec-floating-dock__fab',
              isHome && 'exec-floating-dock__fab--home',
              snabbstartOpen && 'exec-floating-dock__fab--snabb-open',
              isHolding && 'exec-floating-dock__fab--holding',
            )}
            aria-label={
              isHome
                ? snabbstartOpen
                  ? 'Stäng snabbstart. Håll tre sekunder för Valv.'
                  : 'Öppna snabbstart. Håll tre sekunder för Valv.'
                : 'Hamn. Håll tre sekunder för Valv.'
            }
            aria-expanded={isHome ? snabbstartOpen : undefined}
            style={
              progress > 0
                ? ({ '--dock-hold': `${Math.round(progress * 100)}%` } as CSSProperties)
                : undefined
            }
            {...centerHoldHandlers}
          >
            {showFyrenRing ? <FyrenProgressRing progress={progress} /> : null}
            <ExecutiveDecorCompass size="dock" className="exec-floating-dock__fab-compass" />
          </button>
        </nav>
      </div>
  );
}
