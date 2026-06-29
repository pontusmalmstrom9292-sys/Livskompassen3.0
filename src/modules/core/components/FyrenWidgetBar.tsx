import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { LayoutPanelLeft } from 'lucide-react';
import { hasVaultGate } from '../auth/sessionService';
import { NAV_PATHS } from '../navigation/navTruth';
import { useStore } from '../store';
import { DrawerL2Icon, type DrawerL2HubId } from '../ui/drawerL2Icons/DrawerL2Icon';
import { FyrenProgressRing } from '../ui/FyrenProgressRing';
import { FyrenShortcutMicIcon, FyrenShortcutNoteIcon } from '../ui/widget-icons';
import { useFyrenWidget } from './fyrenWidgetContext';
import { readFyrenSideQuickHidden, setFyrenSideQuickHidden } from './FyrenSideQuickDock';
import '../../features/widgets/layout/WidgetShell.css';

type WidgetIconKind = 'mic' | 'note';

type WidgetAction = {
  id: string;
  label: string;
  to: string;
  hubId?: DrawerL2HubId;
  widgetIcon?: WidgetIconKind;
};

const WIDGET_ACTIONS: WidgetAction[] = [
  { id: 'inkast', label: 'Inkast', to: '/#inkast-lite', hubId: 'dagbok' },
  { id: 'note', label: 'Bevis-rad', to: '/widget/anteckning', widgetIcon: 'note' },
  { id: 'snabbval', label: 'Dagbok', to: '/widget/snabbval', hubId: 'dagbok' },
  { id: 'barnobs', label: 'Barnobs', to: '/widget/familjen', hubId: 'familjen' },
  { id: 'brusfiltret', label: 'Hamn', to: '/widget/hamn', hubId: 'hamn' },
  { id: 'voice-vault', label: 'Bevis-röst', to: '/widget/voice-vault', widgetIcon: 'note' },
  {
    id: 'record',
    label: 'Bevis-ljud',
    to: '/widget/inspelning?autostart=1',
    widgetIcon: 'mic',
  },
  { id: 'list', label: 'Lista', to: '/widget/projekt', hubId: 'projekt' },
  { id: 'plan', label: 'Planering', to: '/planering?tab=handling&picked=1', hubId: 'planering' },
  { id: 'valv', label: 'Valv', to: NAV_PATHS.VALVET, hubId: 'dagbok' },
  { id: 'projekt', label: 'Projekt', to: '/widget/projekt', hubId: 'projekt' },
];

const VALV_LOCKED_LABEL = 'Lås upp';

function resolveWidgetActionLabel(action: WidgetAction, vaultSessionOpen: boolean): string {
  if (action.id === 'valv' && !vaultSessionOpen) {
    return VALV_LOCKED_LABEL;
  }
  return action.label;
}

function WidgetIcon({ hubId, widgetIcon }: { hubId?: DrawerL2HubId; widgetIcon?: WidgetIconKind }) {
  const cls = 'fyren-widget-bar__drawer-l2';
  if (widgetIcon === 'mic') {
    return <FyrenShortcutMicIcon className={cls} />;
  }
  if (widgetIcon === 'note') {
    return <FyrenShortcutNoteIcon className={cls} />;
  }
  if (hubId) {
    return <DrawerL2Icon hubId={hubId} className={cls} />;
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
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const vaultSessionOpen = isVaultUnlocked || hasVaultGate();
  const [sideQuickHidden, setSideQuickHidden] = useState(readFyrenSideQuickHidden);

  const syncSideQuickHidden = useCallback(() => {
    setSideQuickHidden(readFyrenSideQuickHidden());
  }, []);

  useEffect(() => {
    window.addEventListener('fyren-side-quick-visibility', syncSideQuickHidden);
    return () => window.removeEventListener('fyren-side-quick-visibility', syncSideQuickHidden);
  }, [syncSideQuickHidden]);

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
          {WIDGET_ACTIONS.map((action) => {
            const label = resolveWidgetActionLabel(action, vaultSessionOpen);
            return (
              <ActionTile
                key={action.id}
                label={label}
                to={action.to}
                icon={
                  <WidgetIcon hubId={action.hubId} widgetIcon={action.widgetIcon} />
                }
                tabIndex={open ? 0 : -1}
                onNavigate={() => setOpen(false)}
              />
            );
          })}
          {sideQuickHidden ? (
            <button
              type="button"
              className="fyren-widget-bar__action"
              aria-label="Visa sidofält"
              tabIndex={open ? 0 : -1}
              onClick={() => {
                setFyrenSideQuickHidden(false);
                setOpen(false);
              }}
            >
              <span className="fyren-widget-bar__icon-shell dock-nav-btn__icon-shell dock-nav-btn__icon-shell--calm">
                <LayoutPanelLeft className="fyren-widget-bar__drawer-l2" strokeWidth={1.75} aria-hidden />
              </span>
              <span className="fyren-widget-bar__label">Sidofält</span>
            </button>
          ) : null}
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
      aria-label={open ? 'Stäng snabbåtkomst' : 'Öppna snabbåtkomst. Håll tre sekunder för Valv.'}
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
      <span className="fyren-dock-handle__label">Snabbåtkomst</span>
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
