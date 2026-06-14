import { useState, useEffect } from 'react';
import { useArchiveData } from '../hooks/useArchiveData';
import { useArchiveExport } from '../hooks/useArchiveExport';
import { ArchiveListView } from './ArchiveListView';
import { ArchiveCalendarView } from './ArchiveCalendarView';
import { Calendar, List, Archive, Download, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { subMonths } from 'date-fns';
import { useStore } from '@/core/store';
import { 
  useCapacityScore, 
  useIsCapacityLoading, 
  useListenToCapacityState 
} from '@/modules/core/store/useCapacityGate';

type ViewMode = 'list' | 'calendar';

export function ArchiveHub() {
  const user = useStore(s => s.user);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  
  const { data: entries, loading, error, loadMonth } = useArchiveData();
  const { exportArchive, isExporting, exportError } = useArchiveExport();

  const capacityScore = useCapacityScore();
  const isCapacityLoading = useIsCapacityLoading();
  const listenToCapacityState = useListenToCapacityState();

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
    <div className="min-h-screen bg-[#020617] bg-gradient-to-b from-[#020617] to-[#050b14] text-text font-sans selection:bg-indigo-500/30">
      {/* Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-900/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-900/10 blur-[120px]" />
      </div>

      <div className="relative max-w-lg mx-auto px-4 pt-12 pb-24 h-screen overflow-y-auto overflow-x-hidden no-scrollbar z-10">
        
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-surface-2/80 flex items-center justify-center border border-border/30 shadow-md">
                <Archive className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-[0.15em] font-display-serif uppercase text-text">Minnesarkivet</h1>
                <p className="text-[10px] text-text-muted uppercase tracking-widest mt-0.5">Ditt WORM-arkiverade liv</p>
              </div>
            </div>

            <button
              onClick={exportArchive}
              disabled={isExporting}
              className="flex items-center justify-center w-10 h-10 rounded-2xl bg-surface-2/85 hover:bg-surface-3 border border-border/30 shadow-sm transition-all disabled:opacity-50"
              title="Exportera hela arkivet till textfil"
            >
              {isExporting ? (
                <Loader2 className="w-5 h-5 text-accent animate-spin" />
              ) : (
                <Download className="w-5 h-5 text-text-muted hover:text-text transition-colors" />
              )}
            </button>
          </div>

          {/* Toggle Switch */}
          <div className="flex p-1 bg-surface-2/60 backdrop-blur-md rounded-2xl border border-border/25 w-full relative z-10">
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                viewMode === 'list' 
                  ? 'bg-indigo-500/15 text-text border border-indigo-500/30 shadow-[0_2px_10px_rgba(99,102,241,0.15)]' 
                  : 'text-text-muted hover:text-text hover:bg-surface-3/35'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Hyllor & Lådor</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                viewMode === 'calendar' 
                  ? 'bg-indigo-500/15 text-text border border-indigo-500/30 shadow-[0_2px_10px_rgba(99,102,241,0.15)]' 
                  : 'text-text-muted hover:text-text hover:bg-surface-3/35'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Kalender</span>
            </button>
          </div>
        </header>

        {/* Loading and Error States */}
        {isCapacityLoading && entries.length === 0 && loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
            <span className="text-xs uppercase tracking-widest text-text-muted">Ansluter till valvet...</span>
          </div>
        ) : (
          <>
            {(error || exportError) && (
              <div className="p-4 mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs shadow-md">
                {error || exportError}
              </div>
            )}

            {/* Content Area */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {viewMode === 'list' ? (
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
