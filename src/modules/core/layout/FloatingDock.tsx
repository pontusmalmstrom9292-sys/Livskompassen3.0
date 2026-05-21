import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Shield,
  Sprout,
  Map,
  Anchor,
  BookOpen,
  Heart,
  Sparkles,
} from 'lucide-react';
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
};

const dockItems: DockItem[] = [
  { path: '/', icon: Home, label: 'Hem' },
  { path: '/kompasser', icon: Sprout, label: 'Kompasser' },
  { path: '/valv', icon: Shield, label: 'Valv', longPress: true },
  { path: '/hamn', icon: Anchor, label: 'Hamn' },
  { path: '/dagbok', icon: BookOpen, label: 'Dagbok' },
  { path: '/kunskap', icon: Sparkles, label: 'Kunskap' },
  { path: '/barnen', icon: Heart, label: 'Barnen' },
  { path: '/ekonomi', icon: Map, label: 'Ekonomi' },
];

function FyrenProgressRing({ progress }: { progress: number }) {
  const pct = Math.round(progress * 100);
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
      viewBox="0 0 36 36"
      aria-hidden
    >
      <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(194,65,12,0.15)" strokeWidth="2" />
      <circle
        cx="18"
        cy="18"
        r="16"
        fill="none"
        stroke={DESIGN.accent}
        strokeWidth="2"
        strokeDasharray={`${pct} ${100 - pct}`}
        pathLength={100}
      />
    </svg>
  );
}

function DockButton({ item }: { item: DockItem }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === item.path;
  const Icon = item.icon;

  const longPress = useLongPress({
    onLongPress: async () => {
      const ok = await authenticateVaultGate();
      if (!ok) return;
      setVaultGate();
      navigate(item.path);
    },
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
      aria-label={item.longPress ? `${item.label} — håll 3 sek för dold åtkomst` : item.label}
      title={item.longPress ? 'Fyren: håll 3 sek…' : item.label}
      className={clsx('nav-item', (isActive || showFyren) && 'active')}
      {...handlers}
    >
      {showFyren && <FyrenProgressRing progress={progress} />}
      <Icon className="relative z-10 h-5 w-5" />
    </button>
  );
}

export function FloatingDock() {
  return (
    <div className="fixed bottom-8 left-1/2 z-50 max-w-[95vw] -translate-x-1/2">
      <nav className="glass-nav flex items-center gap-1 overflow-x-auto rounded-3xl px-3 py-2 shadow-2xl">
        {dockItems.map((item) => (
          <DockButton key={item.path} item={item} />
        ))}
      </nav>
    </div>
  );
}
