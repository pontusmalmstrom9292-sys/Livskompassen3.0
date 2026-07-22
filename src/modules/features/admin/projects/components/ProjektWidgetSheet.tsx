import { X } from 'lucide-react';
import { Sheet, SheetBody } from '@/design-system';
import { DailyFocusCard } from '@/modules/dashboard/components/DailyFocusCard';
import { MabraPulseWidget } from '@/modules/dashboard/components/MabraPulseWidget';
import { ActivePlanningWidget } from '@/modules/dashboard/components/ActivePlanningWidget';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
};

export function ProjektWidgetSheet({ isOpen, onClose }: Props) {
  return (
    <Sheet
      open={isOpen}
      onClose={onClose}
      ariaLabel="Projekt Widgets"
      hideHeader
      size="tall"
      className="z-[100]"
      panelClassName="border-t border-border-strong bg-surface shadow-[0_-8px_30px_rgba(0,0,0,0.6)]"
    >
      <div className="flex flex-shrink-0 items-center justify-between border-b border-border bg-surface-2 px-6 py-4">
        <div>
          <h2 className="text-lg font-medium text-white">Projekt Widgets</h2>
          <p className="mt-1 text-xs uppercase tracking-widest text-text-muted">Snabbåtkomst till Life OS</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 text-white/50 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
          aria-label="Stäng"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <SheetBody className="p-6">
        <p className="mb-2 text-sm italic text-text-muted">Fästa Life OS-widgets för detta projekt.</p>
        <div className="space-y-4">
          <DailyFocusCard />
          <MabraPulseWidget />
          <ActivePlanningWidget />
        </div>
      </SheetBody>
    </Sheet>
  );
}
