import { useState, useEffect } from 'react';
import { hubHeaderClasses } from '@/core/ui/typeScale';
import { useArchiveData } from '../hooks/useArchiveData';
import { useArchiveExport } from '../hooks/useArchiveExport';
import { ArchiveListView } from './ArchiveListView';
import { ArchiveCalendarView } from './ArchiveCalendarView';
import { Calendar, List, Archive, Download, Loader2 } from 'lucide-react';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { subMonths } from 'date-fns';
import { useStore } from '@/core/store';
import { 
  useCapacityScore, 
  useIsCapacityLoading, 
  useListenToCapacityState,
  useIsEconomyAdvancedUnlocked
} from '@/modules/core/store/useCapacityGate';

type ViewMode = 'list' | 'calendar';

export function ArchiveHub() {
  const h = hubHeaderClasses();
  const user = useStore(s => s.user);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  
  const { data: entries, loading, error, loadMonth } = useArchiveData();
  const { exportArchive, isExporting, exportError } = useArchiveExport();

  const capacityScore = useCapacityScore();
  const isCapacityLoading = useIsCapacityLoading();
  const listenToCapacityState = useListenToCapacityState();
  const isEconomyAdvancedUnlocked = useIsEconomyAdvancedUnlocked();

  // Listen to Capacity State
  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = listenToCapacityState(user.uid);
      return () => unsubscribe();
    }
  }, [user?.uid, listenToCapacityState]);

  // Initial load of current month
  useEffect(() => {
    loadMonth(currentMonthDate);
  }, [currentMonthDate, loadMonth]);

  const handleLoadMore = () => {
    // In List view we want to load the previous month (like infinity scroll)
    const prevMonth = subMonths(currentMonthDate, 1);
    setCurrentMonthDate(prevMonth);
  };

  return (
    <div className="min-h-screen bg-bg bg-gradient-to-b from-bg to-surface text-text font-sans selection:bg-accent/30">
      {/* Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <div className="relative max-w-lg mx-auto px-4 pt-12 pb-24 min-h-[100dvh] max-h-[100dvh] overflow-y-auto overflow-x-hidden no-scrollbar z-10">
        
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-surface-2/80 flex items-center justify-center border border-border/30 shadow-md">
                <Archive className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className={h.eyebrow}>Ditt WORM-arkiverade liv</p>
                <h1 className={h.title}>Minnesarkivet</h1>
              </div>
            </div>

            <button
              type="button"
              onClick={exportArchive}
              disabled={isExporting}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-border/30 bg-surface-2/85 shadow-sm transition-all hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-50"
              title="Exportera hela arkivet till textfil"
              aria-label="Exportera hela arkivet till textfil"
              aria-busy={isExporting}
            >
              {isExporting ? (
                <Loader2 className="w-5 h-5 text-accent animate-spin" />
              ) : (
                <Download className="w-5 h-5 text-text-muted hover:text-text transition-colors" />
              )}
            </button>
          </div>

          {/* Toggle Switch */}
          {isEconomyAdvancedUnlocked && (
            <div className="flex p-1 bg-surface-2/60 backdrop-blur-md rounded-2xl border border-border/25 w-full relative z-10">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-pressed={viewMode === 'list'}
                className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55 ${
                  viewMode === 'list' 
                    ? 'border border-accent/30 bg-accent/15 text-text shadow-[0_2px_10px_color-mix(in_srgb,var(--accent)_15%,transparent)]' 
                    : 'text-text-muted hover:bg-surface-3/35 hover:text-text'
                }`}
              >
                <List className="h-4 w-4" aria-hidden />
                <span>Hyllor & Lådor</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                aria-pressed={viewMode === 'calendar'}
                className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55 ${
                  viewMode === 'calendar' 
                    ? 'border border-accent/30 bg-accent/15 text-text shadow-[0_2px_10px_color-mix(in_srgb,var(--accent)_15%,transparent)]' 
                    : 'text-text-muted hover:bg-surface-3/35 hover:text-text'
                }`}
              >
                <Calendar className="h-4 w-4" aria-hidden />
                <span>Kalender</span>
              </button>
            </div>
          )}
        </header>

        {/* Loading and Error States */}
        {isCapacityLoading && entries.length === 0 && loading ? (
          <HubPanelSkeleton label="Ansluter till arkivet…" lines={4} className="py-8" />
        ) : (
          <>
            {(error || exportError) && (
              <div
                className="mb-6 rounded-2xl border border-danger/25 bg-danger/10 p-4 text-xs text-danger shadow-md"
                role="alert"
              >
                {error || exportError}
              </div>
            )}

            {/* Content Area */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {(!isEconomyAdvancedUnlocked || viewMode === 'list') ? (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <ArchiveListView 
                      entries={entries} 
                      loading={loading} 
                      onLoadMore={handleLoadMore} 
                      capacityScore={capacityScore}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="calendar"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <ArchiveCalendarView 
                      entries={entries} 
                      currentMonthDate={currentMonthDate}
                      onChangeMonth={setCurrentMonthDate}
                      loading={loading}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
