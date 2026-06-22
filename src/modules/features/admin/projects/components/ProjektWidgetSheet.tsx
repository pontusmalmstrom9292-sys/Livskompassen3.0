import { X } from 'lucide-react';
import { DailyFocusCard } from '@/modules/dashboard/components/DailyFocusCard';
import { MabraPulseWidget } from '@/modules/dashboard/components/MabraPulseWidget';
import { ActivePlanningWidget } from '@/modules/dashboard/components/ActivePlanningWidget';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
};

export function ProjektWidgetSheet({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative flex h-[85vh] w-full max-w-2xl flex-col rounded-t-[2rem] border-t border-[var(--border-strong)] bg-surface shadow-[0_-8px_30px_rgba(0,0,0,0.6)] animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[var(--border)] bg-surface-2 px-6 py-4">
          <div>
            <h2 className="text-lg font-medium text-white">Projekt Widgets</h2>
            <p className="text-xs text-white/50 uppercase tracking-widest mt-1">
              Snabbåtkomst till Life OS
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <p className="text-sm text-white/60 mb-2 italic">
            Fästa Life OS-widgets för detta projekt.
          </p>
          
          <div className="space-y-4">
             <DailyFocusCard />
             <MabraPulseWidget />
             <ActivePlanningWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
