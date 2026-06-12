import { useState } from 'react';
import { LazyDiary } from './LazyDiary';
import { VisualCompassWidget } from './VisualCompassWidget';
import { QuickActionsWidget } from './QuickActionsWidget';
import { WeeklySummaryModal } from './WeeklySummaryModal';
import { useStore } from '@/modules/core/store';
import { Sparkles } from 'lucide-react';

export function DashboardHub() {
  const user = useStore((s) => s.user);
  const [isWeeklySummaryOpen, setIsWeeklySummaryOpen] = useState(false);

  return (
    <div className="min-h-[80vh] w-full max-w-7xl mx-auto space-y-8 px-4 py-8 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="font-display-serif text-3xl text-accent tracking-wide">Översikt</h1>
        <p className="text-text-muted mt-2 tracking-wide font-light">
          Välkommen {user?.email ? user.email : 'tillbaka'}, här är din samlade vy.
        </p>
      </header>

      <VisualCompassWidget />

      {/* Veckans Sammanfattning Bento Action */}
      <button 
        onClick={() => setIsWeeklySummaryOpen(true)}
        className="w-full group relative overflow-hidden rounded-3xl p-6 bg-glass border border-accent/20 shadow-lg hover:shadow-accent/10 transition-all duration-300 text-left active:scale-[0.99]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-2xl border border-accent/20 group-hover:scale-110 transition-transform duration-500">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-medium tracking-wide text-text">Veckans Insikter</h3>
              <p className="text-sm text-text-muted font-light mt-1">Generera en AI-analys av dina mönster och gränser de senaste 7 dagarna.</p>
            </div>
          </div>
          <div className="hidden sm:flex px-4 py-2 bg-accent text-background rounded-full text-xs font-medium tracking-wide uppercase shadow-[0_0_15px_rgba(var(--color-accent),0.2)] group-hover:shadow-[0_0_20px_rgba(var(--color-accent),0.4)] transition-all">
            Sammanfatta
          </div>
        </div>
      </button>

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

      <WeeklySummaryModal isOpen={isWeeklySummaryOpen} onClose={() => setIsWeeklySummaryOpen(false)} />
    </div>
  );
}
