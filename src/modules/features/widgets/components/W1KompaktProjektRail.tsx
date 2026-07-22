import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  CalendarDays,
  Camera,
  List,
  PenLine,
  Shield,
  Sparkles,
} from 'lucide-react';
import { hasVaultGate } from '@/core/auth/sessionService';
import { useStore } from '@/core/store';
import { FyrenShortcutMicIcon } from '@/core/ui/widget-icons';
import {
  W1_KOMPAKT_RAIL_ACTIONS,
  type W1KompaktRailAction,
  type W1KompaktRailIcon,
  type W1KompaktRailId,
} from '../config/w1KompaktRailActions';
import './W1KompaktProjektRail.css';

type Props = {
  variant?: 'embedded' | 'edge';
  activeId?: W1KompaktRailId;
  onNyttProjekt?: () => void;
  onNavigate?: () => void;
  className?: string;
};

function RailIcon({ kind }: { kind: W1KompaktRailIcon }) {
  const shell = 'w1-kompakt-rail__glyph';
  if (kind === 'sparkles') return <Sparkles className={shell} strokeWidth={1.5} aria-hidden />;
  if (kind === 'list') return <List className={shell} strokeWidth={1.5} aria-hidden />;
  if (kind === 'pen') return <PenLine className={shell} strokeWidth={1.5} aria-hidden />;
  if (kind === 'camera') return <Camera className={shell} strokeWidth={1.5} aria-hidden />;
  if (kind === 'mic') return <FyrenShortcutMicIcon className={shell} />;
  if (kind === 'plan') return <CalendarDays className={shell} strokeWidth={1.5} aria-hidden />;
  return <Shield className={shell} strokeWidth={1.75} aria-hidden />;
}

function resolveActiveId(pathname: string, explicit?: W1KompaktRailId): W1KompaktRailId | null {
  if (explicit) return explicit;
  if (pathname.startsWith('/widget/projekt')) return 'lista';
  if (pathname.startsWith('/widget/anteckning')) return 'anteckning';
  if (pathname.startsWith('/widget/inspelning')) return 'tyst-inspelning';
  if (pathname.startsWith('/planering')) return 'planering';
  if (pathname.startsWith('/valvet') || pathname.startsWith('/valv')) return 'valv';
  return null;
}

function resolveLabel(action: W1KompaktRailAction, vaultSessionOpen: boolean): string {
  if (action.id === 'valv' && !vaultSessionOpen) return 'Lås upp';
  return action.label;
}

function RailActionItem({
  action,
  active,
  vaultSessionOpen,
  onNyttProjekt,
  onNavigate,
}: {
  action: W1KompaktRailAction;
  active: boolean;
  vaultSessionOpen: boolean;
  onNyttProjekt?: () => void;
  onNavigate?: () => void;
}) {
  const label = resolveLabel(action, vaultSessionOpen);
  const className = clsx('w1-kompakt-rail__action', active && 'w1-kompakt-rail__action--active');

  if (action.kind === 'picker') {
    return (
      <button
        type="button"
        className={[className, 'min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40'].filter(Boolean).join(' ')}
        aria-label={label}
        onClick={() => {
          onNyttProjekt?.();
          onNavigate?.();
        }}
      >
        <span className="w1-kompakt-rail__icon-shell">
          <RailIcon kind={action.icon} />
        </span>
        <span className="w1-kompakt-rail__label">{label}</span>
      </button>
    );
  }

  return (
    <Link
      to={action.to}
      className={className}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      onClick={onNavigate}
    >
      <span className="w1-kompakt-rail__icon-shell">
        <RailIcon kind={action.icon} />
      </span>
      <span className="w1-kompakt-rail__label">{label}</span>
    </Link>
  );
}

/** W1 v2 kompakt projekt-strip — prod (Theme Lab extraherad). */
export function W1KompaktProjektRail({
  variant = 'embedded',
  activeId,
  onNyttProjekt,
  onNavigate,
  className,
}: Props) {
  const { pathname } = useLocation();
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const vaultSessionOpen = isVaultUnlocked || hasVaultGate();
  const resolvedActive = resolveActiveId(pathname, activeId);

  return (
    <nav
      className={clsx(
        'w1-kompakt-rail',
        variant === 'embedded' && 'w1-kompakt-rail--embedded',
        variant === 'edge' && 'w1-kompakt-rail--edge',
        className,
      )}
      aria-label="W1 kompakt snabbval"
    >
      {W1_KOMPAKT_RAIL_ACTIONS.map((action) => (
        <RailActionItem
          key={action.id}
          action={action}
          active={resolvedActive === action.id}
          vaultSessionOpen={vaultSessionOpen}
          onNyttProjekt={onNyttProjekt}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}
