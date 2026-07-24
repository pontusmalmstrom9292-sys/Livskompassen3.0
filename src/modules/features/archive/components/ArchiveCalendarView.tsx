import { useState } from 'react';
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
import type { ArchiveEntry } from '../hooks/useArchiveData';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { ChevronLeft, ChevronRight, X, Book, Shield, Clock, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmptyState } from '@/core/ui/EmptyState';
import { Button, useDsReducedMotion } from '@/design-system';

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
  const reducedMotion = useDsReducedMotion();
  const today = new Date();

  // Bygg kalender-grid
  const monthStart = startOfMonth(currentMonthDate);
  const monthEnd = endOfMonth(monthStart);
  // Kalendern börjar alltid på en måndag (veckostart enligt svensk standard)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

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
  const selectedDayMotion = reducedMotion
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 1 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 15 },
        transition: { duration: 0.25, ease: 'easeOut' as const },
      };

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* Kalender Header */}
      <div className="flex items-center justify-between bg-surface-2/70 backdrop-blur-xl border border-border/30 rounded-2xl p-4 shadow-md">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handlePrevMonth}
          className="rounded-full transition-colors hover:bg-surface-3"
          aria-label="Föregående månad"
        >
          <ChevronLeft className="h-5 w-5 text-accent" aria-hidden />
        </Button>
        <div className="font-display-serif text-sm font-semibold uppercase tracking-wider text-text">
          {format(currentMonthDate, 'MMMM yyyy', { locale: sv })}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          className="rounded-full transition-colors hover:bg-surface-3"
          aria-label="Nästa månad"
        >
          <ChevronRight className="h-5 w-5 text-accent" aria-hidden />
        </Button>
      </div>

      {/* Kalender Grid */}
      <div className="bg-surface-2/70 backdrop-blur-xl border border-border/30 rounded-2xl p-4 shadow-md">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'].map(day => (
            <div key={day} className="text-center text-[10px] font-bold uppercase tracking-wider text-text-muted pb-2 border-b border-border/10">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, today);
            const dayEntries = getEntriesForDay(day);
            const hasEntries = dayEntries.length > 0;
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            
            // Kolla om dagboken eller valvet har inlägg
            const hasJournal = dayEntries.some(e => e.type === 'journal');
            const hasVault = dayEntries.some(e => e.type === 'vault');

            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedDate(day)}
                aria-label={`${format(day, 'd MMMM yyyy', { locale: sv })}${hasEntries ? `, ${dayEntries.length} poster` : ''}`}
                aria-pressed={Boolean(isSelected)}
                aria-current={isToday ? 'date' : undefined}
                className={`
                  relative aspect-square flex min-h-11 min-w-11 flex-col items-center justify-center rounded-xl text-xs transition-all duration-[var(--ds-duration-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40
                  ${!isCurrentMonth ? 'text-text-muted/20 hover:bg-transparent cursor-default pointer-events-none' : 'text-text'}
                  ${isSelected 
                    ? 'bg-accent/15 border border-accent/40 text-text shadow-inner ring-1 ring-accent/20' 
                    : isCurrentMonth ? 'hover:bg-surface-3/50 border border-transparent' : ''
                  }
                  ${isToday && !isSelected ? 'ring-1 ring-accent/20' : ''}
                `}
                disabled={!isCurrentMonth}
              >
                <span className={isSelected ? 'font-bold' : ''} aria-hidden>
                  {format(day, 'd')}
                </span>
                
                {/* Indikatorer */}
                {hasEntries && isCurrentMonth && (
                  <div className="absolute bottom-1.5 flex gap-1" aria-hidden>
                    {hasJournal && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
                    {hasVault && <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {loading && (
        <HubPanelSkeleton label="Hämtar kalender…" lines={2} className="py-2" />
      )}

      {/* Modal/Detaljvy för vald dag */}
      <AnimatePresence mode="wait">
        {selectedDate && (
          <motion.div
            {...selectedDayMotion}
            className="calm-card relative mt-4 rounded-2xl p-4 sm:p-5"
          >
            <div className="flex items-center justify-between mb-4 border-b border-border/15 pb-3">
              <h3 className="text-sm font-semibold tracking-wider font-display-serif uppercase text-text">
                {format(selectedDate, 'EEEE d MMMM', { locale: sv })}
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDate(null)}
                className="rounded-full text-text-muted transition hover:bg-surface-3 hover:text-text"
                aria-label="Stäng dagsdetalj"
              >
                <X className="h-4 w-4" aria-hidden />
              </Button>
            </div>

            {selectedEntries.length === 0 ? (
              <EmptyState
                className="border-border/20 bg-transparent py-5 text-center shadow-none"
                title="Tom dag"
                message="Ingen aktivitet sparad för denna dag."
              />
            ) : (
              <div className="flex flex-col gap-3">
                {selectedEntries.map(entry => {
                  let ringClass = 'border border-border/20';
                  if (entry.tags?.includes('red_flag')) {
                    ringClass = 'border border-danger/30';
                  } else if (entry.tags?.includes('insight')) {
                    ringClass = 'border border-amber-500/30';
                  } else if (entry.tags?.includes('boundary')) {
                    ringClass = 'border border-success/30';
                  }

                  return (
                    <div 
                      key={entry.id} 
                      className={`bg-surface-3/40 rounded-xl p-4 flex flex-col gap-2 ${ringClass}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {entry.type === 'journal' ? (
                            <div className="flex items-center gap-1 text-accent">
                              <Book className="w-3.5 h-3.5" />
                              <span className="text-[9px] font-bold uppercase tracking-wider">Dagbok</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-accent-secondary">
                              <Shield className="w-3.5 h-3.5" />
                              <span className="text-[9px] font-bold uppercase tracking-wider">Valvsbevis</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[9px] text-text-muted font-mono">
                          <Clock className="w-3 h-3 text-text-muted" />
                          <span>
                            {format(new Date(entry.createdAt.seconds * 1000), 'HH:mm')}
                          </span>
                        </div>
                      </div>

                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {entry.tags.includes('red_flag') && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-medium bg-danger/15 text-danger border border-danger/20">
                              🚩 Röd flagg
                            </span>
                          )}
                          {entry.tags.includes('insight') && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-medium bg-accent/15 text-accent-light border border-accent/20">
                              💡 Insikt
                            </span>
                          )}
                          {entry.tags.includes('boundary') && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-medium bg-success/15 text-success border border-success/20">
                              🛡️ Gräns
                            </span>
                          )}
                        </div>
                      )}

                      <p className="text-xs text-text leading-relaxed whitespace-pre-wrap select-text mt-1">
                        {entry.transcription || entry.text || entry.content || "Inget textinnehåll."}
                      </p>

                      {/* Render emotional state / indicators */}
                      {(entry.emotion || entry.mood) && (
                        <div className="mt-1 pt-2 border-t border-border/10 flex items-center gap-2">
                          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-surface-3 border border-border/20 text-[9px] text-text-muted">
                            <Heart className="w-2.5 h-2.5 text-danger/80" />
                            <span>Känsla/Mående: {entry.emotion || entry.mood}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
