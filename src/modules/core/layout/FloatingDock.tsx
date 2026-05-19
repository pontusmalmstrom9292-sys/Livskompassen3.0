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

function DockButton({ item }: { item: DockItem }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === item.path;
  const Icon = item.icon;

  const longPress = useLongPress({
    onLongPress: () => {
      setVaultGate();
      navigate(item.path);
    },
    delayMs: 3000,
  });

  const handlers = item.longPress
    ? longPress
    : { onClick: () => navigate(item.path) };

  return (
    <button
      type="button"
      aria-label={item.label}
      title={item.longPress ? `${item.label} — håll 3 sek` : item.label}
      className={clsx(
        'p-2.5 rounded-2xl transition-colors shrink-0',
        isActive ? 'bg-white/10 text-[#FDE68A]' : 'text-slate-500 hover:text-white'
      )}
      {...handlers}
    >
      <Icon className="w-5 h-5" />
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
