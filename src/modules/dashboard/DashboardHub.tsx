import { useEffect } from 'react';
import { ProtectedModule } from '../../components/layout/ProtectedModule';
import { PageSkeleton } from '../../components/layout/PageSkeleton';
import { useStore } from '../core/store';
import { useDashboardStore } from './store/dashboardStore';
import { InsightsInput } from './components/InsightsInput';
import { DailyFocusCard } from './components/DailyFocusCard';
import { RecentIntakeWidget } from './components/RecentIntakeWidget';
import { ActivePlanningWidget } from './components/ActivePlanningWidget';
import { MabraPulseWidget } from './components/MabraPulseWidget';
import { ParalysisBreaker } from '../support/ParalysisBreaker';
import { useParalysisStore } from '../support/store/paralysisStore';
import { SleepPhysiologyWidget } from './components/SleepPhysiologyWidget';
import { WeeklyPulseWidget } from './components/WeeklyPulseWidget';
import { DailySummaryWidget } from './components/DailySummaryWidget';

// Store exporteras från ./store/dashboardStore.ts

function DashboardHubContent() {
  const user = useStore(state => state.user);
  const { isLoading, error, fetchData } = useDashboardStore();
  const { setZenMode } = useParalysisStore();

  useEffect(() => {
    if (user?.uid) {
      fetchData(user.uid);
    }
  }, [user?.uid, fetchData]);

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <div className="w-full h-full min-h-[80vh] p-8 text-red-500 bg-[var(--bg-dusk)]">
        <h2>Ett fel uppstod:</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-hub relative h-full min-h-[80vh] w-full max-w-full overflow-x-clip bg-[var(--bg-dusk)] p-4 text-white transition-colors duration-300 sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold tracking-tight text-white/90">Dagens Översikt</h1>
          <button
            onClick={() => setZenMode(true)}
            className="min-h-11 rounded-lg border border-border/40 bg-surface-3/50 px-4 py-2 text-sm font-medium text-text-muted shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-border hover:bg-surface-3 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            Överväldigad?
          </button>
        </header>

        <div className="mb-6">
          <DailySummaryWidget />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vänster kolumn: Morgonkompassen (Autonomi & Fokus) */}
          <div className="flex flex-col h-full">
            <DailyFocusCard />
          </div>

          {/* Höger kolumn: Ventilen (Kognitiv avlastning) */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <SleepPhysiologyWidget />
              <WeeklyPulseWidget />
            </div>
            <RecentIntakeWidget />
            <ActivePlanningWidget />
            <InsightsInput />
          </div>
        </div>

        {/* Proaktiv Mabra-puls */}
        <div className="w-full">
          <MabraPulseWidget />
        </div>

        {/* Senaste intaget-flöde */}
        <div className="w-full">
          <RecentIntakeWidget />
        </div>

        {/* Aktivt arbetsflöde */}
        <div className="w-full">
          <ActivePlanningWidget />
        </div>
      </div>
      
      {/* Globala Overlays */}
      <ParalysisBreaker />
    </div>
  );
}

/**
 * DashboardHub Modul
 * Omsluten av ProtectedModule för garanterad autentisering.
 */
export default function DashboardHub() {
  return (
    <ProtectedModule>
      <DashboardHubContent />
    </ProtectedModule>
  );
}
