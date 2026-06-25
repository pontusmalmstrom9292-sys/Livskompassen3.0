import { useCallback, useState } from 'react';
// @locked DOCK_ZONES - Needed for static smoke tests. Do not remove this comment.
import type { CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { Landmark, LayoutGrid, PenLine, Inbox } from 'lucide-react';
import { openValvViaFyren } from '../auth/valvFyrenGate';
import { useExecutiveHomeChrome } from '../home/ExecutiveHomeChromeContext';
import { NAV_PATHS } from '../navigation/navTruth';
import { ResurserOverlay } from '../navigation/ResurserOverlay';
import { useLongPress } from '../hooks/useLongPress';
import { useStore } from '../store';
import { useTheme } from '../theme';
import { getTheme } from '../theme';
import { isMockupTheme } from '../theme/mockupTheme';
import { themeUsesDesignPackChrome } from '../theme/themePackDesign';
import { isMidnightExecutiveTheme } from '../theme/themePackMidnightExecutive';
import { DrawerL2Icon } from '../ui/drawerL2Icons/DrawerL2Icon';
import { FyrenProgressRing } from '../ui/FyrenProgressRing';
import { LivskompassMark } from '../ui/LivskompassMark';
import { FyrenDockHandle } from '../components/FyrenWidgetBar';
import { DockNavButton } from './DockNavButton';
import { ExecutiveDockBar } from './ExecutiveDockBar';
import { useHeaderPanelStyle } from './headerPanelStyle';

export function FloatingDock() {
  const location = useLocation();
  const navigate = useNavigate();
  const { themeId } = useTheme();
  const executive = isMidnightExecutiveTheme(themeId);
  const referenceDock =
    executive || isMockupTheme(themeId) || themeUsesDesignPackChrome(getTheme(themeId));
  const setSystemError = useStore((s) => s.setError);
  const [resurserOpen, setResurserOpen] = useState(false);
  const { pathname } = location;
  const isHome = pathname === '/';
  const panelStyle = useHeaderPanelStyle();
  const { toggleSnabbstart, snabbstartOpen } = useExecutiveHomeChrome();

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
      if (executive && isHome) {
        toggleSnabbstart();
        return;
      }
      if (!isHome) navigate('/');
    },
    delayMs: 3000,
  });

  const { progress, isHolding, ...centerHoldHandlers } = centerPress;
  const showFyrenRing = progress > 0;

  if (referenceDock) {
    return (
      <>
        <ResurserOverlay open={resurserOpen} onClose={() => setResurserOpen(false)} />
        <div className="dock-shell dock-shell--reference-dock">
          <ExecutiveDockBar
            pathname={pathname}
            isHome={isHome}
            isFamiljen={isFamiljen}
            isHjartat={isHjartat}
            resurserOpen={resurserOpen}
            snabbstartOpen={snabbstartOpen}
            showFyrenRing={showFyrenRing}
            progress={progress}
            isHolding={isHolding}
            centerHoldHandlers={centerHoldHandlers}
            onAnteckning={() => navigate('/widget/anteckning')}
            onFamiljen={() => navigate(NAV_PATHS.FAMILJEN)}
            onVentil={() => navigate(NAV_PATHS.HJARTAT)}
            onInkast={() => navigate('/planering/input?inputMode=inkast')}
            onResurser={() => setResurserOpen(true)}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <ResurserOverlay open={resurserOpen} onClose={() => setResurserOpen(false)} />
      <div className="dock-shell dock-shell--fyren">
        <FyrenDockHandle />
        <div className="dock-hub-band floating-dock" data-panel-style={panelStyle}>
          <DockNavButton
            label="Anteckning"
            tileVariant="calm"
            icon={<PenLine className="h-5 w-5 opacity-80" strokeWidth={1.5} />}
            active={pathname.startsWith('/widget/anteckning')}
            variant="slot"
            className="floating-dock__side-btn floating-dock__side-btn--anteckning"
            onClick={() => navigate('/widget/anteckning')}
          />

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
              <span className="absolute -bottom-1 text-[0.6rem] uppercase tracking-widest text-accent font-medium mt-1">
                Hamn
              </span>
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

          <div className="floating-dock__side-group floating-dock__side-group--outer-right flex items-end gap-0.5">
            <DockNavButton
              label="Inkast"
              tileVariant="calm"
              icon={<Inbox className="h-5 w-5 opacity-80" strokeWidth={1.5} />}
              active={pathname.startsWith('/planering/input')}
              variant="slot"
              className="floating-dock__side-btn floating-dock__side-btn--inkast"
              onClick={() => navigate('/planering/input?inputMode=inkast')}
            />
            <DockNavButton
              label="Resurser"
              tileVariant="calm"
              icon={<LayoutGrid className="h-5 w-5 opacity-80" strokeWidth={1.5} />}
              active={resurserOpen}
              variant="slot"
              className={clsx(
                'floating-dock__side-btn floating-dock__side-btn--resurser',
                resurserOpen && 'floating-dock__side-btn--active',
              )}
              onClick={() => setResurserOpen(true)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
