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
      className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
      viewBox="0 0 36 36"
      aria-hidden
    >
      <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(253,230,138,0.15)" strokeWidth="2" />
      <circle
        cx="18"
        cy="18"
        r="16"
        fill="none"
        stroke="#FDE68A"
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
      className={clsx(
        'relative p-2.5 rounded-2xl transition-colors shrink-0',
        isActive ? 'bg-white/10 text-[#FDE68A]' : 'text-slate-500 hover:text-white',
        showFyren && 'text-[#FDE68A]'
      )}
      {...handlers}
    >
      {showFyren && <FyrenProgressRing progress={progress} />}
      <Icon className="w-5 h-5 relative z-10" />
    </button>
  );
}

export function FloatingDock() {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-[95vw]">
      <nav className="flex items-center gap-1 px-3 py-2 rounded-3xl bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 shadow-2xl overflow-x-auto">
        {dockItems.map((item) => (
          <DockButton key={item.path} item={item} />
        ))}
      </nav>
    </div>
  );
}
