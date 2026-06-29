import { Compass } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BentoCard } from '@/shared/ui/BentoCard';
import {
  buildWeeklyAvailableTasks,
  EXPLORE_MAX_SKIPS,
  isoWeekKey,
  needsWeeklyRegeneration,
  pickCurrentExploreTask,
  type ExploreFilter,
} from '../lib/exploreTaskPicker';
import {
  clearExploreSkipCount,
  readExploreSkipCount,
  writeExploreSkipCount,
} from '../lib/exploreSkipStorage';
import {
  getMabraExploreQueue,
  saveMabraExploreQueue,
} from '../api/mabraExploreQueueService';
import { useMabra30Capacity } from '../lib/mabra30Capacity';

const FILTER_OPTIONS: { id: ExploreFilter; label: string }[] = [
  { id: 'budget_low', label: 'Låg budget' },
  { id: 'social_safe', label: 'Socialt tryggt' },
  { id: 'solo', label: 'Solo' },
  { id: 'energy_low', label: 'Låg energi' },
];

const COPY = {
  eyebrow: 'Prova något nytt',
  lead: 'En veckoutmaning i taget — inga poäng, inga streaks.',
  filterHint: 'Välj minst ett filter. Du kan byta nästa vecka.',
  generate: 'Skapa veckans utmaning',
  skip: 'Hoppa över',
  skipLimit: 'Max fem hopp den här veckan — välj en uppgift eller pausa.',
  complete: 'Markera som klar',
  doneTitle: 'Bra — klart för den här gången',
  doneLead: 'Nästa vecka kan du få en ny slump. Inget räknas som missat.',
  empty: 'Inga uppgifter matchar filtren just nu. Prova ett annat filter.',
  loading: 'Laddar kö…',
  saveError: 'Kunde inte spara — du kan fortsätta lokalt.',
} as const;

type Props = {
  uid?: string;
  onComplete?: (taskId: string) => void;
};

export function MabraExplorePanel({ uid, onComplete }: Props) {
  const weekKey = useMemo(() => isoWeekKey(), []);
  const { capacityLevel } = useMabra30Capacity(uid);
  const defaultFilters = useMemo(
    (): ExploreFilter[] => (capacityLevel === 1 ? ['energy_low'] : ['solo']),
    [capacityLevel],
  );
  const [filters, setFilters] = useState<ExploreFilter[]>(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [availableTasks, setAvailableTasks] = useState<
    ReturnType<typeof buildWeeklyAvailableTasks>
  >([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [skipCount, setSkipCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setFilters(defaultFilters);
  }, [defaultFilters]);

  const toggleFilter = (id: ExploreFilter) => {
    setFilters((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((f) => f !== id);
        return next.length > 0 ? next : prev;
      }
      return [...prev, id];
    });
  };

  const loadQueue = useCallback(async () => {
    setLoading(true);
    setSaveError(null);
    const anonKey = uid ?? 'anon';
    try {
      const skips = readExploreSkipCount(anonKey, weekKey);
      setSkipCount(skips);

      if (!uid) {
        const generated = buildWeeklyAvailableTasks({ uid: anonKey, weekKey, filters });
        setAvailableTasks(generated);
        setCompletedTasks([]);
        setLoading(false);
        return;
      }

      const row = await getMabraExploreQueue(uid);

      const mustRegenerate =
        !row || needsWeeklyRegeneration(row.lastGenerated) || row.availableTasks.length === 0;

      if (mustRegenerate) {
        const generated = buildWeeklyAvailableTasks({ uid, weekKey, filters });
        setAvailableTasks(generated);
        setCompletedTasks(row?.completedTasks ?? []);
        if (generated.length > 0) {
          await saveMabraExploreQueue(uid, {
            availableTasks: generated,
            completedTasks: row?.completedTasks ?? [],
          });
          clearExploreSkipCount(uid, weekKey);
          setSkipCount(0);
        }
      } else {
        setAvailableTasks(row.availableTasks);
        setCompletedTasks(row.completedTasks);
      }
    } catch {
      setSaveError(COPY.saveError);
    } finally {
      setLoading(false);
    }
  }, [uid, weekKey, filters]);

  useEffect(() => {
    void loadQueue();
  }, [loadQueue]);

  const { task: currentTask } = useMemo(
    () =>
      pickCurrentExploreTask({
        availableTasks,
        completedIds: completedTasks,
        skipCount,
        uid: uid ?? 'anon',
        weekKey,
      }),
    [availableTasks, completedTasks, skipCount, uid, weekKey],
  );

  const handleSkip = () => {
    if (!currentTask) return;
    if (skipCount >= EXPLORE_MAX_SKIPS) return;
    const anonKey = uid ?? 'anon';
    const next = skipCount + 1;
    writeExploreSkipCount(anonKey, weekKey, next);
    setSkipCount(next);
  };

  const handleComplete = async () => {
    if (!currentTask) return;
    if (!uid) {
      setDone(true);
      onComplete?.(currentTask.id);
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const nextCompleted = [...completedTasks, currentTask.id];
      await saveMabraExploreQueue(uid, {
        availableTasks,
        completedTasks: nextCompleted,
        mergeCompletedAppendOnly: true,
      });
      setCompletedTasks(nextCompleted);
      clearExploreSkipCount(uid, weekKey);
      setSkipCount(0);
      setDone(true);
      onComplete?.(currentTask.id);
    } catch {
      setSaveError(COPY.saveError);
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async () => {
    if (filters.length === 0) return;
    setSaving(true);
    setSaveError(null);
    const anonKey = uid ?? 'anon';
    try {
      const generated = buildWeeklyAvailableTasks({
        uid: anonKey,
        weekKey,
        filters,
        excludeIds: completedTasks,
      });
      setAvailableTasks(generated);
      clearExploreSkipCount(anonKey, weekKey);
      setSkipCount(0);
      setDone(false);
      if (generated.length > 0 && uid) {
        await saveMabraExploreQueue(uid, {
          availableTasks: generated,
          completedTasks,
        });
      }
    } catch {
      setSaveError(COPY.saveError);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <BentoCard title={COPY.eyebrow} icon={<Compass className="h-4 w-4" />} glow="green">
        <p className="text-sm text-text-muted">{COPY.loading}</p>
      </BentoCard>
    );
  }

  return (
    <BentoCard title={COPY.eyebrow} icon={<Compass className="h-4 w-4" />} glow="green">
      <p className="mb-3 text-sm text-text-muted">{COPY.lead}</p>
      {capacityLevel === 1 ? (
        <p className="mb-2 text-xs text-text-dim">Lugn kapacitet — lågenergi-filter är förvalt.</p>
      ) : null}
      <p className="mb-2 text-xs text-text-dim">{COPY.filterHint}</p>

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((opt) => {
          const active = filters.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleFilter(opt.id)}
              className={
                active
                  ? 'rounded-xl border border-accent/40 bg-surface-3 px-3 py-1.5 text-xs text-accent'
                  : 'rounded-xl border border-border bg-surface-2 px-3 py-1.5 text-xs text-text-muted hover:bg-surface-3'
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {saveError && <p className="mb-3 text-xs text-amber-400/90">{saveError}</p>}

      {done ? (
        <div className="space-y-2 text-center">
          <p className="text-base text-success">{COPY.doneTitle}</p>
          <p className="text-sm text-text-muted">{COPY.doneLead}</p>
        </div>
      ) : currentTask ? (
        <div className="space-y-3">
          <div className="rounded-xl border border-border-strong bg-surface/40 px-4 py-3">
            <p className="text-sm font-medium text-accent">{currentTask.titel}</p>
            <p className="mt-2 text-sm text-text-muted">{currentTask.rule_sv}</p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => void handleComplete()}
              className="ds-btn ds-btn--secondary w-full"
            >
              {COPY.complete}
            </button>
            <button
              type="button"
              disabled={saving || skipCount >= EXPLORE_MAX_SKIPS}
              onClick={handleSkip}
              className="ds-btn ds-btn--ghost text-sm"
            >
              {skipCount >= EXPLORE_MAX_SKIPS ? COPY.skipLimit : COPY.skip}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-text-muted">{COPY.empty}</p>
          <button
            type="button"
            disabled={saving}
            onClick={() => void handleRegenerate()}
            className="ds-btn ds-btn--secondary w-full"
          >
            {COPY.generate}
          </button>
        </div>
      )}
    </BentoCard>
  );
}
