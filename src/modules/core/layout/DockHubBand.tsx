import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { clsx } from 'clsx';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LivskompassMark } from '../ui/LivskompassMark';
import { useLongPress } from '../hooks/useLongPress';
import { useLifeHubPreset } from '../lifeOs/useLifeHubPreset';
import { getHubContextSlots, type HubContextSlot } from '../navigation/hubContextBar';
import { getDockHubBanner } from './dockHubBanner';
import { renderDockNavIcon, renderDockSideIcon } from './dockNavIcons';
import { DockNavButton, DockNavLinkFace } from './DockNavButton';
import { getDockSideLinks } from './dockHubChrome';
import type { DockSideLink } from './dockHubChrome';

function DockSideNav({ link }: { link: DockSideLink }) {
  const icon = renderDockSideIcon(link.icon);
  return (
    <NavLink
      to={link.to}
      className={({ isActive }) =>
        clsx('dock-nav-btn', 'dock-nav-btn--side', isActive && 'dock-nav-btn--active')
      }
      aria-label={link.label}
    >
      {({ isActive }) => (
        <DockNavLinkFace label={link.label} icon={icon} active={isActive} />
      )}
    </NavLink>
  );
}

function ContextSlotButton({
  slot,
  onGo,
}: {
  slot: HubContextSlot;
  onGo: (to: string) => void;
}) {
  const icon = renderDockNavIcon(slot);
  return (
    <DockNavButton
      label={slot.label}
      icon={icon}
      active={!!slot.active}
      variant="slot"
      onClick={() => onGo(slot.to)}
    />
  );
}

/** Dock-chrome: sidolänkar + kontext-slots kring kompass (DOCK-KANON: mitt = Hem). */
export function DockHubBand() {
  const location = useLocation();
  const navigate = useNavigate();
  const { presetId } = useLifeHubPreset();
  const isHome = location.pathname === '/';
  const hubBanner = getDockHubBanner(location.pathname);

  const hubSlots = useMemo(
    () => getHubContextSlots(location.pathname, location.search),
    [location.pathname, location.search],
  );
  const sides = useMemo(
    () => getDockSideLinks(presetId, location.pathname),
    [presetId, location.pathname],
  );
  const leftSlots = hubSlots.slice(0, 2);
  const rightSlots = hubSlots.slice(2, 4);
  const leftRail = [leftSlots[0] ?? null, leftSlots[1] ?? null] as const;
  const rightRail = [rightSlots[0] ?? null, rightSlots[1] ?? null] as const;

  const centerPress = useLongPress({
    onLongPress: () => navigate('/dagbok?tab=bevis'),
    onClick: () => {
      if (!isHome) navigate('/');
    },
    delayMs: 3000,
  });

  const { progress, isHolding, ...centerHoldHandlers } = centerPress;

  const goTo = (to: string) => {
    navigate(to);
  };

  return (
    <div className={clsx('dock-hub-band', hubBanner && 'dock-hub-band--has-banner')}>
      {hubBanner ? (
        <div className="dock-hub-band__banner" aria-hidden>
          <span className="dock-hub-band__banner-text">{hubBanner}</span>
        </div>
      ) : null}

      <div className="dock-hub-band__rail chrome-strip-surface">
        <DockSideNav link={sides.left} />
        {leftRail.map((slot, index) =>
          slot ? (
            <ContextSlotButton key={slot.id} slot={slot} onGo={goTo} />
          ) : (
            <span key={`dock-pad-left-${index}`} className="dock-hub-band__pad" aria-hidden />
          ),
        )}

        <button
          type="button"
          className={clsx(
            'dock-hub-band__center',
            isHome && 'dock-hub-band__center--active',
            isHolding && 'dock-hub-band__center--holding',
          )}
          aria-label="Hem. Håll tre sekunder för Valv."
          style={
            progress > 0
              ? ({ '--dock-hold': `${Math.round(progress * 100)}%` } as CSSProperties)
              : undefined
          }
          {...centerHoldHandlers}
        >
          <span className="dock-hub-band__center-glow" aria-hidden />
          <span className="dock-hub-band__plate header-chrome-btn header-chrome-btn--round header-chrome-btn--logo">
            <LivskompassMark className="dock-hub-band__mark app-header__logo-mark text-accent" />
          </span>
        </button>

        {rightRail.map((slot, index) =>
          slot ? (
            <ContextSlotButton key={slot.id} slot={slot} onGo={goTo} />
          ) : (
            <span key={`dock-pad-right-${index}`} className="dock-hub-band__pad" aria-hidden />
          ),
        )}
        <DockSideNav link={sides.right} />
      </div>
    </div>
  );
}
