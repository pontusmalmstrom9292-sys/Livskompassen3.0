import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { clsx } from 'clsx';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { HubChromeIconTile } from '../ui/HubChromeIconTile';
import { LivskompassMark } from '../ui/LivskompassMark';
import { useLongPress } from '../hooks/useLongPress';
import { HubPresetSheet } from '../lifeOs/HubPresetSheet';
import { useLifeHubPreset } from '../lifeOs/useLifeHubPreset';
import { getHubContextSlots, type HubContextSlot } from '../navigation/hubContextBar';
import { renderHubContextIcon } from '../navigation/hubContextIcons';
import { getDockSideLinks, getHubPresetShortLabel } from './dockHubChrome';
import type { DockSideLink } from './dockHubChrome';

const DOCK_GLYPH = 'dock-hub-band__glyph';

function DockSideNav({ link }: { link: DockSideLink }) {
  return (
    <NavLink
      to={link.to}
      className={({ isActive }) =>
        clsx('dock-hub-band__side', isActive && 'dock-hub-band__side--active')
      }
      aria-label={link.label}
    >
      {({ isActive }) => (
        <>
          <HubChromeIconTile variant="side" active={isActive} className="dock-hub-band__side-tile">
            {renderHubContextIcon(link.icon, DOCK_GLYPH)}
          </HubChromeIconTile>
          <span className="dock-hub-band__side-label">{link.label}</span>
        </>
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
  return (
    <button
      type="button"
      className={clsx(
        'dock-hub-band__slot',
        slot.active && 'dock-hub-band__slot--active',
      )}
      aria-label={slot.label}
      aria-current={slot.active ? 'page' : undefined}
      onClick={() => onGo(slot.to)}
    >
      <HubChromeIconTile active={slot.active} className="dock-hub-band__slot-tile">
        {renderHubContextIcon(slot.icon, DOCK_GLYPH)}
      </HubChromeIconTile>
      <span className="dock-hub-band__slot-label">{slot.label}</span>
    </button>
  );
}

/** Dock-chrome: sidolänkar + kontext-slots kring kompass + hub-preset på centrum. */
export function DockHubBand() {
  const location = useLocation();
  const navigate = useNavigate();
  const { presetId, setPresetId } = useLifeHubPreset();
  const [presetOpen, setPresetOpen] = useState(false);
  const isHome = location.pathname === '/';

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
  const presetLabel = getHubPresetShortLabel(presetId);

  const valvLongPress = useLongPress({
    onLongPress: () => {
      setPresetOpen(false);
      navigate('/dagbok?tab=bevis');
    },
    onClick: () => setPresetOpen(true),
    delayMs: 3000,
  });

  const { progress, isHolding, ...centerHoldHandlers } = valvLongPress;

  const goTo = (to: string) => {
    navigate(to);
  };

  return (
    <>
      <div className="dock-hub-band">
        <DockSideNav link={sides.left} />

        <div className="dock-hub-band__context">
          {leftSlots.map((slot) => (
            <ContextSlotButton key={slot.id} slot={slot} onGo={goTo} />
          ))}
        </div>

        <button
          type="button"
          className={clsx(
            'dock-hub-band__center',
            isHome && 'dock-hub-band__center--active',
            isHolding && 'dock-hub-band__center--holding',
          )}
          aria-label={`Hub: ${presetLabel}. Tryck för att byta.`}
          aria-expanded={presetOpen}
          style={
            progress > 0
              ? ({ '--dock-hold': `${Math.round(progress * 100)}%` } as CSSProperties)
              : undefined
          }
          {...centerHoldHandlers}
        >
          <span className="dock-hub-band__plate">
            <LivskompassMark className="dock-hub-band__mark" />
          </span>
          <span className="dock-hub-band__preset-badge">{presetLabel}</span>
        </button>

        <div className="dock-hub-band__context">
          {rightSlots.map((slot) => (
            <ContextSlotButton key={slot.id} slot={slot} onGo={goTo} />
          ))}
        </div>

        <DockSideNav link={sides.right} />
      </div>

      <HubPresetSheet
        open={presetOpen}
        activeId={presetId}
        onSelect={setPresetId}
        onClose={() => setPresetOpen(false)}
      />
    </>
  );
}
