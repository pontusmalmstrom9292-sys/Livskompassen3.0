import { useState, useEffect } from 'react';
import { useArchiveData } from '../hooks/useArchiveData';
import { useArchiveExport } from '../hooks/useArchiveExport';
import { ArchiveListView } from './ArchiveListView';
import { ArchiveCalendarView } from './ArchiveCalendarView';
import { Calendar, List, Archive, Download, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { subMonths } from 'date-fns';

type ViewMode = 'list' | 'calendar';

export function ArchiveHub() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  
  const { data: entries, loading, error, loadMonth } = useArchiveData();
  const { exportArchive, isExporting, exportError } = useArchiveExport();

  // Initial ladda aktuell månad
  useEffect(() => {
    loadMonth(currentMonthDate);
  }, [currentMonthDate, loadMonth]);

  const handleLoadMore = () => {
    // I List-vy vill vi hämta föregående månad (som ett infinity-scroll)
    // Eftersom loadMonth ackumulerar entries räcker det med att byta fokus till en äldre månad.
    const prevMonth = subMonths(currentMonthDate, 1);
    setCurrentMonthDate(prevMonth);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-500/30">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-900/20 blur-[120px]" />
      </div>

      <div className="relative max-w-lg mx-auto px-4 pt-12 pb-24 h-screen overflow-y-auto overflow-x-hidden no-scrollbar">
        
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-lg">
                <Archive className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Valvet</h1>
                <p className="text-sm text-white/50">Ditt WORM-arkiv</p>
              </div>
            </div>

            <button
              onClick={exportArchive}
              disabled={isExporting}
              className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all disabled:opacity-50"
              title="Exportera arkiv"
            >
              {isExporting ? (
                <Loader2 className="w-5 h-5 text-white/50 animate-spin" />
              ) : (
                <Download className="w-5 h-5 text-white/70" />
              )}
            </button>
          </div>

          {/* Toggle Switch */}
          <div className="flex p-1 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 w-full relative z-10">
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all ${
                viewMode === 'list' ? 'bg-white/15 text-white shadow-sm' : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Lista</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all ${
                viewMode === 'calendar' ? 'bg-white/15 text-white shadow-sm' : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Kalender</span>
            </button>
          </div>
        </header>

        {/* Error State */}
        {(error || exportError) && (
          <div className="p-4 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error || exportError}
          </div>
        )}

        {/* Content Area */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {viewMode === 'list' ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ArchiveListView 
                  entries={entries} 
                  loading={loading} 
                  onLoadMore={handleLoadMore} 
                />
              </motion.div>
            ) : (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
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

      </div>
    </div>
  );
}
