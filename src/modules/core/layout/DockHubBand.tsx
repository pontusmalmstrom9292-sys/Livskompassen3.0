import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { clsx } from 'clsx';
import { MoreHorizontal } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LivskompassMark } from '../ui/LivskompassMark';
import { useLongPress } from '../hooks/useLongPress';
import { HubPresetSheet } from '../lifeOs/HubPresetSheet';
import { useLifeHubPreset } from '../lifeOs/useLifeHubPreset';
import {
  getHubContextSlots,
  HUB_MORE_ACTIONS,
  type HubContextSlot,
} from '../navigation/hubContextBar';
import { renderHubContextIcon } from '../navigation/hubContextIcons';
import { getDockSideLinks, getHubPresetShortLabel } from './dockHubChrome';
import type { DockSideLink } from './dockHubChrome';

function DockSideNav({ link }: { link: DockSideLink }) {
  return (
    <NavLink
      to={link.to}
      className={({ isActive }) =>
        clsx('dock-hub-band__side', isActive && 'dock-hub-band__side--active')
      }
      aria-label={link.label}
    >
      <span className="dock-hub-band__side-icon" aria-hidden>
        {renderHubContextIcon(link.icon, 'h-4 w-4 text-accent')}
      </span>
      <span className="dock-hub-band__side-label">{link.label}</span>
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
      <span className="dock-hub-band__slot-icon" aria-hidden>
        {renderHubContextIcon(slot.icon, 'h-[1rem] w-[1rem] text-accent')}
      </span>
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
  const [moreOpen, setMoreOpen] = useState(false);
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
      setMoreOpen(false);
      setPresetOpen(false);
      navigate('/dagbok?tab=bevis');
    },
    onClick: () => setPresetOpen(true),
    delayMs: 3000,
  });

  const { progress, isHolding, ...centerHoldHandlers } = valvLongPress;

  const goTo = (to: string) => {
    navigate(to);
    setMoreOpen(false);
  };

  return (
    <>
      {moreOpen ? (
        <button
          type="button"
          className="fyren-smart-bar__backdrop"
          aria-label="Stäng mer-menyn"
          onClick={() => setMoreOpen(false)}
        />
      ) : null}

      <div className={clsx('dock-hub-band', moreOpen && 'dock-hub-band--more-open')}>
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
          <button
            type="button"
            className="dock-hub-band__slot dock-hub-band__slot--more"
            aria-label="Fler snabbval"
            onClick={() => setMoreOpen(true)}
          >
            <span className="dock-hub-band__slot-icon" aria-hidden>
              <MoreHorizontal className="h-[1rem] w-[1rem] text-accent" strokeWidth={1.5} />
            </span>
            <span className="dock-hub-band__slot-label">Mer</span>
          </button>
        </div>

        <DockSideNav link={sides.right} />
      </div>

      {moreOpen ? (
        <div className="dock-hub-band__more fyren-smart-bar__expanded-panel">
          <p className="fyren-smart-bar__panel-title">Mer</p>
          <div className="fyren-smart-bar__icon-grid">
            {HUB_MORE_ACTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                className="fyren-smart-bar__icon-btn"
                aria-label={item.label}
                onClick={() => goTo(item.to)}
              >
                <span className="fyren-smart-bar__icon-tile">
                  {renderHubContextIcon(item.icon, 'h-[1.15rem] w-[1.15rem] text-accent')}
                </span>
                <span className="fyren-smart-bar__icon-label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <HubPresetSheet
        open={presetOpen}
        activeId={presetId}
        onSelect={setPresetId}
        onClose={() => setPresetOpen(false)}
      />
    </>
  );
}
