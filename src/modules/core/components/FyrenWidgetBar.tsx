import type { CSSProperties, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import { DrawerL2Icon, type DrawerL2HubId } from '../ui/drawerL2Icons/DrawerL2Icon';
import { useFyrenWidget } from './fyrenWidgetContext';

type WidgetAction = {
  id: string;
  label: string;
  to: string;
  hubId?: DrawerL2HubId;
  shortcutSrc?: string;
};

const WIDGET_ACTIONS: WidgetAction[] = [
  { id: 'inkast', label: 'Inkast', to: '/#inkast-lite', hubId: 'dagbok' },
  { id: 'snabbval', label: 'Snabbval', to: '/widget/snabbval', hubId: 'mabra' },
  {
    id: 'record',
    label: 'Inspelning',
    to: '/widget/inspelning?autostart=1',
    shortcutSrc: '/icons/shortcuts/wh-inspelning.svg',
  },
  {
    id: 'note',
    label: 'Anteckning',
    to: '/widget/anteckning',
    shortcutSrc: '/icons/shortcuts/wh-anteckning.svg',
  },
  { id: 'list', label: 'Lista', to: '/projekt/ny', hubId: 'projekt' },
  { id: 'plan', label: 'Planering', to: '/planering?tab=handling', hubId: 'planering' },
  { id: 'valv', label: 'Valv', to: NAV_PATHS.VALVET, hubId: 'dagbok' },
  { id: 'projekt', label: 'Projekt', to: '/projekt/ny', hubId: 'projekt' },
];

function WidgetIcon({ hubId, shortcutSrc }: { hubId?: DrawerL2HubId; shortcutSrc?: string }) {
  if (shortcutSrc) {
    return (
      <img
        src={shortcutSrc}
        alt=""
        aria-hidden
        draggable={false}
        decoding="async"
        className="fyren-widget-bar__drawer-l2"
      />
    );
  }
  if (hubId) {
    return <DrawerL2Icon hubId={hubId} className="fyren-widget-bar__drawer-l2" />;
  }
  return null;
}

function ActionTile({
  label,
  to,
  icon,
  tabIndex,
  onNavigate,
}: {
  label: string;
  to: string;
  icon: ReactNode;
  tabIndex: number;
  onNavigate: () => void;
}) {
  return (
    <Link
      to={to}
      className="fyren-widget-bar__action"
      aria-label={label}
      tabIndex={tabIndex}
      onClick={onNavigate}
    >
      <span className="fyren-widget-bar__icon-shell dock-nav-btn__icon-shell dock-nav-btn__icon-shell--calm">
        {icon}
      </span>
      <span className="fyren-widget-bar__label">{label}</span>
    </Link>
  );
}

/** Fyren-panel — fälls ut uppåt ovanför dock (trigger sitter i FloatingDock). */
export function FyrenWidgetBar() {
  const location = useLocation();
  const { open, setOpen } = useFyrenWidget();

  if (location.pathname.startsWith('/widget')) return null;

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fyren-widget-bar__backdrop"
          aria-label="Stäng Fyren"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div
        className={clsx('fyren-widget-bar', open && 'fyren-widget-bar--open')}
        aria-label="Fyren snabbval"
      >
        <div
          className={clsx('fyren-widget-bar__strip', !open && 'fyren-widget-bar__strip--closed')}
          aria-hidden={!open}
        >
          {WIDGET_ACTIONS.map(({ id, label, to, hubId, shortcutSrc }) => (
            <ActionTile
              key={id}
              label={label}
              to={to}
              icon={<WidgetIcon hubId={hubId} shortcutSrc={shortcutSrc} />}
              tabIndex={open ? 0 : -1}
              onNavigate={() => setOpen(false)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export function FyrenDockTrigger({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  const { open, progress, isHolding, dockTriggerProps } = useFyrenWidget();
  const { onDoubleClick, onClick, ...handlers } = dockTriggerProps;

  return (
    <button
      type="button"
      className={clsx(
        'dock-nav-btn floating-dock__fyren-btn',
        open && 'floating-dock__fyren-btn--open',
        isHolding && 'floating-dock__fyren-btn--holding',
        className,
      )}
      aria-expanded={open}
      aria-label={open ? 'Stäng Fyren' : 'Öppna Fyren snabbval'}
      style={
        progress > 0
          ? ({ ...style, '--fyren-hold': `${Math.round(progress * 100)}%` } as CSSProperties)
          : style
      }
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      {...handlers}
    >
      <span className="dock-nav-btn__icon-shell dock-nav-btn__icon-shell--calm fyren-widget-bar__icon-shell fyren-widget-bar__icon-shell--trigger">
        <DrawerL2Icon hubId="planering" className="fyren-widget-bar__drawer-l2" />
      </span>
      <span className="dock-nav-btn__label">Fyren</span>
    </button>
  );
}
