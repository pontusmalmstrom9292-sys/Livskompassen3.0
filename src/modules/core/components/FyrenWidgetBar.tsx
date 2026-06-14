import type { CSSProperties, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { NAV_PATHS } from '../navigation/navTruth';
import { DrawerL2Icon, type DrawerL2HubId } from '../ui/drawerL2Icons/DrawerL2Icon';
import { FyrenProgressRing } from '../ui/FyrenProgressRing';
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
    hubId: 'inspelning',
  },
  {
    id: 'note',
    label: 'Anteckning',
    to: '/widget/anteckning',
    hubId: 'anteckning',
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

export function FyrenDockHandle({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  const { open, progress, isHolding, dockTriggerProps } = useFyrenWidget();
  const { onDoubleClick, onClick, ...handlers } = dockTriggerProps;
  const showFyrenRing = progress > 0;

  return (
    <button
      type="button"
      className={clsx(
        'fyren-dock-handle',
        open && 'fyren-dock-handle--open',
        isHolding && 'fyren-dock-handle--holding',
        className,
      )}
      aria-expanded={open}
      aria-label={open ? 'Stäng Fyren snabbval' : 'Öppna Fyren snabbval. Håll tre sekunder för Valv.'}
      style={
        progress > 0
          ? ({ ...style, '--fyren-hold': `${Math.round(progress * 100)}%` } as CSSProperties)
          : style
      }
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      {...handlers}
    >
      {showFyrenRing ? <FyrenProgressRing progress={progress} /> : null}
      <span className="fyren-dock-handle__lip" aria-hidden />
      <span className="fyren-dock-handle__label">Fyren</span>
      <svg viewBox="0 0 12 8" aria-hidden className="fyren-dock-handle__chevron">
        <path
          d="M1.5 6.5 6 2.5l4.5 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
