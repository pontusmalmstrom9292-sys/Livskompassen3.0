import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import type { ArchiveEntry } from '../hooks/useArchiveData';
import { 
  Book, 
  Shield, 
  PenLine, 
  ChevronDown, 
  ChevronUp, 
  Folder, 
  AlertTriangle, 
  Lightbulb, 
  CheckSquare,
  Clock,
  Heart,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmptyState } from '@/core/ui/EmptyState';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { Button } from '@/design-system';

interface ArchiveListViewProps {
  entries: ArchiveEntry[];
  loading: boolean;
  onLoadMore: () => void;
  hideLoadMore?: boolean;
  capacityScore: number;
}

export function ArchiveListView({ entries, loading, onLoadMore, hideLoadMore = false, capacityScore }: ArchiveListViewProps) {
  const navigate = useNavigate();
  const [expandedShelves, setExpandedShelves] = useState<Record<string, boolean>>({});
  const [expandedDrawers, setExpandedDrawers] = useState<Record<string, boolean>>({});

  // Group entries by Year-Month
  const groupedByMonth = useMemo(
    () =>
      entries.reduce<Record<string, { date: Date; entries: ArchiveEntry[] }>>((acc, entry) => {
        if (!entry.createdAt) return acc;
        const date = new Date(entry.createdAt.seconds * 1000);
        const key = format(date, 'yyyy-MM');
        if (!acc[key]) {
          acc[key] = { date, entries: [] };
        }
        acc[key].entries.push(entry);
        return acc;
      }, {}),
    [entries],
  );

  const sortedMonths = useMemo(
    () => Object.keys(groupedByMonth).sort((a, b) => b.localeCompare(a)),
    [groupedByMonth],
  );

  // Auto-expand the first shelf if capacity is normal and there are shelves available
  useEffect(() => {
    if (sortedMonths.length > 0 && capacityScore >= 5.0) {
      const firstMonth = sortedMonths[0];
      setExpandedShelves(prev => {
        if (Object.keys(prev).length === 0) {
          return { [firstMonth]: true };
        }
        return prev;
      });
    }
  }, [sortedMonths, capacityScore]);

  const toggleShelf = (monthKey: string) => {
    setExpandedShelves(prev => ({
      ...prev,
      [monthKey]: !prev[monthKey]
    }));
  };

  const toggleDrawer = (drawerKey: string) => {
    setExpandedDrawers(prev => ({
      ...prev,
      [drawerKey]: !prev[drawerKey]
    }));
  };

  const getDrawersForMonth = (monthKey: string, monthEntries: ArchiveEntry[]) => {
    return [
      {
        id: `${monthKey}-journal`,
        label: 'Dagboken',
        icon: Book,
        colorClass: 'text-accent',
        entries: monthEntries.filter(e => e.type === 'journal'),
      },
      {
        id: `${monthKey}-vault`,
        label: 'Verklighetsvalvet',
        icon: Shield,
        colorClass: 'text-accent-secondary',
        entries: monthEntries.filter(e => e.type === 'vault'),
      },
      {
        id: `${monthKey}-red_flags`,
        label: '🚩 Röda flaggor',
        icon: AlertTriangle,
        colorClass: 'text-danger',
        entries: monthEntries.filter(e => e.tags?.includes('red_flag')),
      },
      {
        id: `${monthKey}-insights`,
        label: '💡 Självinsikter & Lärdomar',
        icon: Lightbulb,
        colorClass: 'text-amber-400',
        entries: monthEntries.filter(e => e.tags?.includes('insight')),
      },
      {
        id: `${monthKey}-boundaries`,
        label: '🛡️ Personliga Gränser',
        icon: CheckSquare,
        colorClass: 'text-success',
        entries: monthEntries.filter(e => e.tags?.includes('boundary')),
      },
    ].filter(drawer => drawer.entries.length > 0);
  };

  if (entries.length === 0 && loading) {
    return <HubPanelSkeleton label="Hämtar arkivhyllor…" lines={4} className="py-8" />;
  }

  if (entries.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12">
        <EmptyState
          className="max-w-sm text-center"
          title="Ditt arkiv är tomt"
          message="När du skriver reflektioner eller sparar bevis i Valvet samlas de här — säkert och strukturerat."
          action={
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/hjartat?tab=reflektion')}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border/30 bg-surface-2 px-6 py-3 text-sm focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              <PenLine className="h-4 w-4 text-accent" aria-hidden />
              Skriv din första reflektion
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* Capacity Gate Informative Banner */}
      {capacityScore < 5.0 && (
        <div className="p-4 rounded-2xl bg-surface-2/70 border-b-2 border-accent/40 shadow-[0_4px_15px_-2px_rgba(212,175,55,0.15)] text-xs text-text-muted leading-relaxed">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-semibold text-accent uppercase tracking-wider">Kognitiv avlastning aktiv</span>
          </div>
          Eftersom din kognitiva orkester indikerar lägre tillgänglig kapacitet ({Math.round(capacityScore * 10)}%), har vi stängt alla arkivhyllor och lådor för att skydda dig mot kognitiv överbelastning. Du kan tryggt öppna enskilda lådor i din egen takt när du känner dig redo.
        </div>
      )}

      {/* Shelves & Drawers Container */}
      <div className="flex flex-col gap-4">
        {sortedMonths.map((monthKey) => {
          const { date: monthDate, entries: monthEntries } = groupedByMonth[monthKey];
          const isShelfExpanded = !!expandedShelves[monthKey];
          const monthDrawers = getDrawersForMonth(monthKey, monthEntries);

          return (
            <div key={monthKey} className="flex flex-col gap-2">
              {/* Shelf header card (Hylla) */}
              <button
                type="button"
                onClick={() => toggleShelf(monthKey)}
                aria-expanded={isShelfExpanded}
                className="flex w-full items-center justify-between p-4 bg-surface-2/70 hover:bg-surface-3/80 border border-border/30 rounded-2xl cursor-pointer transition-all duration-[var(--ds-duration-normal)] shadow-md backdrop-blur-xl text-left min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                    <Folder className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold tracking-wider font-display-serif uppercase text-text">
                      {format(monthDate, 'MMMM yyyy', { locale: sv })}
                    </h3>
                    <p className="text-[10px] text-text-muted uppercase tracking-widest mt-0.5">
                      {monthEntries.length} {monthEntries.length === 1 ? 'post' : 'poster'} i hyllan
                    </p>
                  </div>
                </div>
                <div>
                  {isShelfExpanded ? (
                    <ChevronUp className="w-5 h-5 text-accent" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-accent" />
                  )}
                </div>
              </button>

              {/* Drawers under this shelf */}
              <AnimatePresence initial={false}>
                {isShelfExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden flex flex-col gap-2 pl-4 border-l border-border/20 ml-5"
                  >
                    {monthDrawers.map((drawer) => {
                      const isDrawerExpanded = !!expandedDrawers[drawer.id];
                      const DrawerIcon = drawer.icon;

                      return (
                        <div key={drawer.id} className="flex flex-col gap-2 mt-1">
                          {/* Drawer pulling row */}
                          <button
                            type="button"
                            onClick={() => toggleDrawer(drawer.id)}
                            aria-expanded={isDrawerExpanded}
                            className="flex w-full items-center justify-between p-3 rounded-xl border border-border/20 bg-surface-3/50 hover:bg-surface-3 cursor-pointer transition-all duration-[var(--ds-duration-fast)] text-left min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                          >
                            <div className="flex items-center gap-3">
                              <DrawerIcon className={`w-4 h-4 ${drawer.colorClass}`} />
                              <span className="text-xs font-medium text-text">{drawer.label}</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-accent/10 text-accent-light border border-accent/20">
                                {drawer.entries.length}
                              </span>
                            </div>
                            <div>
                              {isDrawerExpanded ? (
                                <ChevronUp className="w-4 h-4 text-text-muted" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-text-muted" />
                              )}
                            </div>
                          </button>

                          {/* Drawer Content */}
                          <AnimatePresence initial={false}>
                            {isDrawerExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: 'easeInOut' }}
                                className="overflow-hidden flex flex-col gap-3 pl-3 pt-1 pb-2"
                              >
                                {drawer.entries.map((entry) => {
                                  // Determine tag classes
                                  let ringClass = 'border border-border/20';
                                  if (entry.tags?.includes('red_flag')) {
                                    ringClass = 'border border-danger/30 ring-1 ring-danger/10';
                                  } else if (entry.tags?.includes('insight')) {
                                    ringClass = 'border border-amber-500/30 ring-1 ring-amber-500/10';
                                  } else if (entry.tags?.includes('boundary')) {
                                    ringClass = 'border border-success/30 ring-1 ring-emerald-500/10';
                                  }

                                  return (
                                    <div
                                      key={entry.id}
                                      className={`calm-card glow-bottom-blue flex flex-col gap-3 rounded-2xl p-4 sm:p-5 ${ringClass}`}
                                    >
                                      {/* Entry header */}
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          {entry.type === 'journal' ? (
                                            <div className="flex items-center gap-1.5 text-accent">
                                              <Book className="w-3.5 h-3.5" />
                                              <span className="text-[10px] font-bold uppercase tracking-wider">Dagbok</span>
                                            </div>
                                          ) : (
                                            <div className="flex items-center gap-1.5 text-accent-secondary">
                                              <Shield className="w-3.5 h-3.5" />
                                              <span className="text-[10px] font-bold uppercase tracking-wider">Valvsbevis</span>
                                              <Lock className="w-3 h-3 ml-1 opacity-70" aria-label="WORM-skyddad" />
                                            </div>
                                          )}
                                        </div>

                                        <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-mono">
                                          <Clock className="w-3 h-3 text-text-muted" />
                                          <span>
                                            {format(new Date(entry.createdAt.seconds * 1000), 'd MMM yyyy HH:mm', { locale: sv })}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Tags list inside entry */}
                                      {entry.tags && entry.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                          {entry.tags.includes('red_flag') && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-medium bg-danger/15 text-danger border border-danger/20">
                                              🚩 Röd flagg
                                            </span>
                                          )}
                                          {entry.tags.includes('insight') && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-medium bg-accent/15 text-accent-light border border-accent/20">
                                              💡 Insikt
                                            </span>
                                          )}
                                          {entry.tags.includes('boundary') && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-medium bg-success/15 text-success border border-success/20">
                                              🛡️ Gräns
                                            </span>
                                          )}
                                        </div>
                                      )}

                                      {/* Entry content body */}
                                      <div className="text-text text-xs leading-relaxed whitespace-pre-wrap select-text">
                                        {entry.transcription || entry.text || entry.content || (
                                          <span className="text-text-muted italic">Inget textinnehåll sparat.</span>
                                        )}
                                      </div>

                                      {/* Render forensic specifics if Vault Entry */}
                                      {entry.type === 'vault' && (entry.truth || entry.action) && (
                                        <div className="mt-2 pt-3 border-t border-border/10 flex flex-col gap-2 text-[11px]">
                                          {entry.truth && (
                                            <div>
                                              <span className="font-semibold text-accent uppercase tracking-wider block mb-0.5 text-[9px]">Objektiv Sanning</span>
                                              <p className="text-text/90 italic bg-surface-3/30 p-2 rounded-lg border border-border/10 select-text">
                                                "{entry.truth}"
                                              </p>
                                            </div>
                                          )}
                                          {entry.action && (
                                            <div>
                                              <span className="font-semibold text-accent uppercase tracking-wider block mb-0.5 text-[9px]">Vidtagen åtgärd</span>
                                              <p className="text-text/90 select-text">
                                                {entry.action}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {/* Render emotional state / indicators */}
                                      {(entry.emotion || entry.mood) && (
                                        <div className="mt-2 pt-2 border-t border-border/10 flex items-center gap-2">
                                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-3 border border-border/20 text-[10px] text-text-muted">
                                            <Heart className="w-3 h-3 text-danger/80" />
                                            <span>Känsla/Mående: {entry.emotion || entry.mood}</span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Load more / pagination */}
      {!hideLoadMore && (
      <div className="pt-6 flex justify-center">
        <button
          onClick={onLoadMore}
          disabled={loading}
          className="px-6 py-2 rounded-full bg-surface-2 hover:bg-surface-3 border border-border/30 text-xs font-semibold uppercase tracking-wider text-text transition-colors disabled:opacity-50 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          {loading ? 'Hämtar...' : 'Ladda äldre hylla'}
        </button>
      </div>
      )}
    </div>
  );
}
