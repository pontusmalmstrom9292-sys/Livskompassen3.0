import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Sprout, Anchor, BookOpen, Heart } from 'lucide-react';
import { useLongPress } from '../hooks/useLongPress';
import { setVaultGate } from '../auth/sessionService';
import { authenticateVaultGate } from '../auth/webauthn';
import { clsx } from 'clsx';
import { DESIGN } from '../ui/tokens';

type DockItem = {
  path: string;
  icon: typeof Home;
  label: string;
  longPress?: boolean;
  search?: string;
};

const dockItems: DockItem[] = [
  { path: '/', icon: Home, label: 'Hem' },
  { path: '/dagbok', icon: BookOpen, label: 'Hjärtat', longPress: true, search: '?tab=bevis' },
  { path: '/hamn', icon: Anchor, label: 'Hamn' },
  { path: '/familjen', icon: Heart, label: 'Familjen' },
  { path: '/vardagen', icon: Sprout, label: 'Vardagen' },
];

function FyrenProgressRing({ progress }: { progress: number }) {
  const pct = Math.round(progress * 100);
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
      viewBox="0 0 36 36"
      aria-hidden
    >
      <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(194,65,12,0.12)" strokeWidth="1.5" />
      <circle
        cx="18"
        cy="18"
        r="16"
        fill="none"
        stroke={DESIGN.accent}
        strokeWidth="1.5"
        strokeDasharray={`${pct} ${100 - pct}`}
        pathLength={100}
        opacity={0.85}
      />
    </svg>
  );
}

function DockButton({ item }: { item: DockItem }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive =
    item.path === '/'
      ? location.pathname === '/'
      : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
  const Icon = item.icon;

  const longPress = useLongPress({
    onLongPress: async () => {
      const ok = await authenticateVaultGate();
      if (!ok) return;
      setVaultGate();
      navigate({ pathname: item.path, search: item.search ?? '' });
    },
    onClick: () =>
      navigate(item.longPress ? { pathname: item.path, search: '' } : item.path),
    delayMs: 3000,
  });

  const { progress, isHolding, ...longPressHandlers } = longPress;

  const handlers = item.longPress
    ? longPressHandlers
    : { onClick: () => navigate(item.path) };

  const showFyren = item.longPress && (isHolding || progress > 0);

  return (
    <button
      type="button"
      aria-label={item.longPress ? `${item.label} — håll 3 sek för dold åtkomst till bevis` : item.label}
      title={item.longPress ? 'Fyren: håll 3 sek…' : item.label}
      className={clsx('dock-item', (isActive || showFyren) && 'dock-item--active')}
      {...handlers}
    >
      <span className="dock-item__icon-wrap">
        {showFyren && <FyrenProgressRing progress={progress} />}
        <Icon className="relative z-10 h-4 w-4" strokeWidth={1.75} />
      </span>
      <span className="dock-item__label">{item.label}</span>
    </button>
  );
}

export function FloatingDock() {
  return (
    <div className="dock-shell">
      <nav className="glass-nav dock-nav" aria-label="Huvudmeny">
        {dockItems.map((item) => (
          <DockButton key={item.path} item={item} />
        ))}
      </nav>
    </div>
  );
}
