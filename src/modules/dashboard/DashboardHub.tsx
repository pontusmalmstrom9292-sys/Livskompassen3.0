import { useEffect } from 'react';
import { ProtectedModule } from '../../components/layout/ProtectedModule';
import { PageSkeleton } from '../../components/layout/PageSkeleton';
import { useStore } from '../core/store';
import { useDashboardStore } from './store/dashboardStore';
import { InsightsInput } from './components/InsightsInput';
import { DailyFocusCard } from './components/DailyFocusCard';
import { ParalysisBreaker } from '../support/ParalysisBreaker';
import { useParalysisStore } from '../support/store/paralysisStore';

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
      <div className="w-full h-full min-h-[80vh] p-8 text-red-500 bg-[var(--color-nordic-dusk)]">
        <h2>Ett fel uppstod:</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full min-h-[80vh] p-4 sm:p-6 md:p-8 text-white transition-colors duration-300 relative"
      style={{ backgroundColor: 'var(--color-nordic-dusk)' }}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold tracking-tight text-white/90">Dagens Översikt</h1>
          <button
            onClick={() => setZenMode(true)}
            className="px-4 py-2 bg-red-500/20 text-red-100 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-sm font-medium transition-colors"
          >
            Överväldigad?
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vänster kolumn: Morgonkompassen (Autonomi & Fokus) */}
          <div className="flex flex-col h-full">
            <DailyFocusCard />
          </div>

          {/* Höger kolumn: Ventilen (Kognitiv avlastning) */}
          <div className="flex flex-col h-full">
            <InsightsInput />
          </div>
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
