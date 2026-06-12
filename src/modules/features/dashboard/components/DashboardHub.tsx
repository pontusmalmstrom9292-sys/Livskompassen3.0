import { LazyDiary } from './LazyDiary';
import { VisualCompassWidget } from './VisualCompassWidget';
import { QuickActionsWidget } from './QuickActionsWidget';
import { useStore } from '@/modules/core/store';

export function DashboardHub() {
  const user = useStore((s) => s.user);

  return (
    <div className="min-h-[80vh] w-full max-w-7xl mx-auto space-y-8 px-4 py-8 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="font-display-serif text-3xl text-accent tracking-wide">Översikt</h1>
        <p className="text-text-muted mt-2 tracking-wide font-light">
          Välkommen {user?.email ? user.email : 'tillbaka'}, här är din samlade vy.
        </p>
      </header>

      <VisualCompassWidget />
      <QuickActionsWidget />
      
      <section className="dashboard-hub__diary-section rounded-3xl p-6 bg-glass border border-border-strong shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Ambient background for depth */}
        <div className="absolute inset-0 pointer-events-none opacity-50 bg-gradient-to-br from-surface-2 to-surface-3" />
        <div className="absolute -top-32 -right-32 w-96 h-96 ambient-blob ambient-blob--gold opacity-20 pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 ambient-blob ambient-blob--indigo opacity-30 pointer-events-none" />
        
        <header className="mb-6 relative z-10 flex items-center justify-between">
          <h2 className="text-xl font-medium tracking-wide text-text flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Min Dagbok
          </h2>
          <span className="text-[10px] uppercase tracking-widest text-accent px-3 py-1 rounded-full border border-accent/30 bg-accent/10">
            Aktiv Modul
          </span>
        </header>

        <div className="relative z-10">
          <LazyDiary />
        </div>
      </section>
    </div>
  );
}
