import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenLine, Shield, Bot, Zap } from 'lucide-react';
import { BentoCard } from '@/modules/shared/ui/BentoCard';
import { NAV_PATHS } from '@/modules/core/navigation/navTruth';
import { useStore } from '@/modules/core/store';

type QuickAction = {
  id: string;
  icon: React.ReactNode;
  label: string;
};

const ACTIONS: QuickAction[] = [
  {
    id: 'ny-reflektion',
    icon: <PenLine size={20} />,
    label: 'Ny reflektion',
  },
  {
    id: 'oppna-valvet',
    icon: <Shield size={20} />,
    label: 'Öppna Valvet',
  },
  {
    id: 'fraga-kompis',
    icon: <Bot size={20} />,
    label: 'Fråga Kompis',
  },
];

/**
 * Snabbåtgärder — handlingsbara genvägar för Dashboard.
 *
 * Navigerar till Hjärtat (reflektion), Valvet och Kompis
 * via react-router + Zustand-butikens drawer-state.
 */
export function QuickActionsWidget() {
  const navigate = useNavigate();
  const setActiveDrawer = useStore((s) => s.setActiveDrawer);

  const handleAction = useCallback(
    (id: string) => {
      switch (id) {
        case 'ny-reflektion':
          navigate(`${NAV_PATHS.HJARTAT}?tab=reflektion`);
          break;
        case 'oppna-valvet':
          navigate(NAV_PATHS.VALVET);
          break;
        case 'fraga-kompis':
          setActiveDrawer('kompis');
          navigate('/kompis');
          break;
      }
    },
    [navigate, setActiveDrawer],
  );

  return (
    <BentoCard
      title="Snabbåtgärder"
      icon={<Zap size={16} />}
      glow="gold"
    >
      <div className="grid grid-cols-3 gap-3">
        {ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => handleAction(action.id)}
            className="flex flex-col items-center gap-2 rounded-2xl border border-accent/20 bg-surface-2/50 px-3 py-4 backdrop-blur-sm transition-all duration-200 hover:border-accent/40 hover:bg-accent/8 active:scale-[0.97]"
          >
            <span className="text-accent">{action.icon}</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-text-muted">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </BentoCard>
  );
}

