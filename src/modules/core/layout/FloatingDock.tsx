import { useCallback } from 'react';
// @locked DOCK_ZONES - Needed for static smoke tests. Do not remove this comment.
import type { CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { Landmark, PenLine, Inbox } from 'lucide-react';
import { openValvViaFyren } from '../auth/valvFyrenGate';
import { NAV_PATHS } from '../navigation/navTruth';
import { useLongPress } from '../hooks/useLongPress';
import { useStore } from '../store';
import { DrawerL2Icon } from '../ui/drawerL2Icons/DrawerL2Icon';
import { FyrenProgressRing } from '../ui/FyrenProgressRing';
import { LivskompassMark } from '../ui/LivskompassMark';
import { FyrenDockHandle } from '../components/FyrenWidgetBar';
import { DockNavButton } from './DockNavButton';
import { useHeaderPanelStyle } from './headerPanelStyle';

export function FloatingDock() {
  const location = useLocation();
  const navigate = useNavigate();
  const setSystemError = useStore((s) => s.setError);
  const { pathname } = location;
  const isHome = pathname === '/';
  const panelStyle = useHeaderPanelStyle();

  const isFamiljen = pathname === '/familjen' || pathname.startsWith('/familjen/');
  const isHjartat = pathname === '/hjartat' || pathname.startsWith('/hjartat') || pathname.startsWith('/dagbok');

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
      if (!isHome) navigate('/');
    },
    delayMs: 3000,
  });

  const { progress, isHolding, ...centerHoldHandlers } = centerPress;
  const showFyrenRing = progress > 0;

  return (
    <div className="dock-shell dock-shell--fyren">
      <FyrenDockHandle />
      <div className="dock-hub-band floating-dock" data-panel-style={panelStyle}>
        
        {/* Left outer capture shortcut */}
        <DockNavButton
          label="Anteckning"
          tileVariant="calm"
          icon={<PenLine className="h-5 w-5 opacity-80" strokeWidth={1.5} />}
          active={pathname.startsWith('/widget/anteckning')}
          variant="slot"
          className="floating-dock__side-btn floating-dock__side-btn--anteckning"
          onClick={() => navigate('/widget/anteckning')}
        />

        {/* Center pill containing the primary core zones and home compass */}
        <div className="dock-hub-band__rail dock-hub-band__rail--zones">
          <div className="floating-dock__side-group floating-dock__side-group--left justify-end pr-1">
            <DockNavButton
              label="Familj"
              tileVariant="calm"
              icon={<DrawerL2Icon hubId="familjen" className="dock-nav-btn__drawer-l2" />}
              active={isFamiljen}
              variant="slot"
              className="floating-dock__side-btn floating-dock__side-btn--familj"
              onClick={() => navigate(NAV_PATHS.FAMILJEN)}
            />
          </div>

          <div className="floating-dock__center-wrapper relative flex flex-col items-center">
            <button
              type="button"
              className={clsx(
                'dock-hub-band__center floating-dock__center',
                isHome && 'dock-hub-band__center--active',
                isHolding && 'dock-hub-band__center--holding',
              )}
              aria-label="Hamn. Håll tre sekunder för Valv."
              style={
                progress > 0
                  ? ({ '--dock-hold': `${Math.round(progress * 100)}%` } as CSSProperties)
                  : undefined
              }
              {...centerHoldHandlers}
            >
              <span className="dock-hub-band__center-glow floating-dock__center-glow" aria-hidden />
              <span className="floating-dock__arc" aria-hidden />
              <span className="dock-hub-band__plate floating-dock__plate">
                {showFyrenRing ? <FyrenProgressRing progress={progress} /> : null}
                <LivskompassMark className="dock-hub-band__mark floating-dock__mark" />
              </span>
            </button>
            <span className="absolute -bottom-1 text-[0.6rem] uppercase tracking-widest text-accent font-medium mt-1">Hamn</span>
          </div>

          <div className="floating-dock__side-group floating-dock__side-group--right justify-start pl-1">
            <DockNavButton
              label="Ventil"
              tileVariant="calm"
              icon={<Landmark className="h-5 w-5 opacity-80" strokeWidth={1.5} />}
              active={isHjartat}
              variant="slot"
              className="floating-dock__side-btn floating-dock__side-btn--valv"
              onClick={() => navigate(NAV_PATHS.HJARTAT)}
            />
          </div>
        </div>

        {/* Right outer capture shortcut */}
        <DockNavButton
          label="Inkast"
          tileVariant="calm"
          icon={<Inbox className="h-5 w-5 opacity-80" strokeWidth={1.5} />}
          active={pathname.startsWith('/planering/input')}
          variant="slot"
          className="floating-dock__side-btn floating-dock__side-btn--inkast"
          onClick={() => navigate('/planering/input?inputMode=inkast')}
        />
        
      </div>
    </div>
  );
}
