import React, { useEffect } from 'react';
import { ProtectedModule } from '../../components/layout/ProtectedModule';
import { PageSkeleton } from '../../components/layout/PageSkeleton';
import { useStore } from '../core/store';
import { useDashboardStore } from './store/dashboardStore';
import { InsightsInput } from './components/InsightsInput';

// Store exporteras från ./store/dashboardStore.ts

function DashboardHubContent() {
  const user = useStore(state => state.user);
  const { data, isLoading, error, fetchData } = useDashboardStore();

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
      className="w-full h-full min-h-[80vh] p-4 sm:p-6 md:p-8 text-white transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-nordic-dusk)' }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Hub</h1>
        </header>

        <InsightsInput />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.length === 0 ? (
            <div className="col-span-full p-8 bg-white/5 rounded-2xl border border-white/10 shadow-md backdrop-blur-md text-center">
              <p className="text-lg opacity-80">Ingen data hittades för din profil.</p>
            </div>
          ) : (
            data.map(item => (
              <div 
                key={item.id} 
                className="p-6 bg-white/5 rounded-xl border border-white/5 shadow-sm backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <pre className="text-sm opacity-80 overflow-auto">{JSON.stringify(item, null, 2)}</pre>
              </div>
            ))
          )}
        </div>
      </div>
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
