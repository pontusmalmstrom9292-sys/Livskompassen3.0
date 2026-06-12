import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  startOfWeek, 
  endOfWeek,
  addMonths,
  subMonths
} from 'date-fns';
import { sv } from 'date-fns/locale';
import { ArchiveEntry } from '../hooks/useArchiveData';
import { ChevronLeft, ChevronRight, X, Book, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArchiveCalendarViewProps {
  entries: ArchiveEntry[];
  currentMonthDate: Date;
  onChangeMonth: (date: Date) => void;
  loading: boolean;
}

export function ArchiveCalendarView({ 
  entries, 
  currentMonthDate, 
  onChangeMonth,
  loading
}: ArchiveCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Bygg kalender-grid
  const monthStart = startOfMonth(currentMonthDate);
  const monthEnd = endOfMonth(monthStart);
  // Kalendern börjar alltid på en måndag (veckostart enligt svensk standard)
  const calendarStart = startOfWeek(monthStart, { weekStarts: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStarts: 1 });

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Få inlägg för en specifik dag
  const getEntriesForDay = (date: Date) => {
    return entries.filter(entry => {
      if (!entry.createdAt) return false;
      const entryDate = new Date(entry.createdAt.seconds * 1000);
      return isSameDay(entryDate, date);
    });
  };

  const handlePrevMonth = () => onChangeMonth(subMonths(currentMonthDate, 1));
  const handleNextMonth = () => onChangeMonth(addMonths(currentMonthDate, 1));

  const selectedEntries = selectedDate ? getEntriesForDay(selectedDate) : [];

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* Kalender Header */}
      <div className="flex items-center justify-between bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
        <button onClick={handlePrevMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-lg font-semibold capitalize">
          {format(currentMonthDate, 'MMMM yyyy', { locale: sv })}
        </div>
        <button onClick={handleNextMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Kalender Grid */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-lg">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-white/50 pb-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            const isCurrentMonth = isSameMonth(day, monthStart);
            const dayEntries = getEntriesForDay(day);
            const hasEntries = dayEntries.length > 0;
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            
            // Kolla om dagboken eller valvet har inlägg
            const hasJournal = dayEntries.some(e => e.type === 'journal');
            const hasVault = dayEntries.some(e => e.type === 'vault');

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(day)}
                className={`
                  relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all
                  ${!isCurrentMonth ? 'opacity-30' : ''}
                  ${isSelected ? 'bg-white/20 border border-white/40 shadow-inner' : 'hover:bg-white/10'}
                `}
              >
                <span>{format(day, 'd')}</span>
                
                {/* Indikatorer */}
                {hasEntries && (
                  <div className="absolute bottom-1.5 flex gap-1">
                    {hasJournal && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                    {hasVault && <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className="text-center text-xs text-white/50 animate-pulse py-2">
          Hämtar data...
        </div>
      )}

      {/* Modal/Detaljvy för vald dag */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-2xl mt-4 relative"
          >
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <h3 className="text-lg font-medium capitalize">
                {format(selectedDate, 'EEEE d MMMM', { locale: sv })}
              </h3>
              <button onClick={() => setSelectedDate(null)} className="p-1 hover:bg-white/10 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedEntries.length === 0 ? (
              <p className="text-center text-white/50 py-6 italic">
                Ingen aktivitet sparad för denna dag.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {selectedEntries.map(entry => (
                  <div key={entry.id} className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      {entry.type === 'journal' ? (
                        <div className="flex items-center gap-1 text-blue-300">
                          <Book className="w-3 h-3" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Dagbok</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-purple-300">
                          <Shield className="w-3 h-3" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Valv</span>
                        </div>
                      )}
                      <span className="text-[10px] text-white/40 ml-auto">
                        {format(new Date(entry.createdAt.seconds * 1000), 'HH:mm')}
                      </span>
                    </div>
                    <p className="text-sm text-white/90 line-clamp-3">
                      {entry.transcription || entry.content || "Inget textinnehåll."}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
