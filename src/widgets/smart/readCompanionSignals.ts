/**
 * Derive Companion AI signals from local widget cache (no cross-RAG).
 * Offline-first — memory/IndexedDB only.
 */

import { getCached } from '../core/WidgetCache';
import { DEFAULT_AI_SIGNALS, type WidgetAiSignals } from './widgetAiContext';

type BeaconLike = {
  energy?: number;
  stress?: number;
  sleep?: number;
  capacity?: number;
};

type TaskLike = { id: string; done?: boolean };

type MoodLike = { mood?: string };

type StudioOverride = Partial<WidgetAiSignals> & { at?: number };

const BARNVECKA_KEY = 'cw:prefs:barnvecka';
export const STUDIO_SIGNAL_OVERRIDE_KEY = 'widget:studio:signal_override';

function clamp(n: number, min = 0, max = 100): number {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.round(n)));
}

export function getBarnveckaPref(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(BARNVECKA_KEY) === '1';
  } catch {
    return false;
  }
}

export function setBarnveckaPref(on: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(BARNVECKA_KEY, on ? '1' : '0');
  } catch {
    /* ignore */
  }
}

/** Soft mood → energy/stress blend (journal check-in). */
export function applyJournalMoodToSignals(
  mood: string | undefined,
  base: Pick<WidgetAiSignals, 'energy' | 'stress'>,
): Pick<WidgetAiSignals, 'energy' | 'stress'> {
  if (!mood) return base;
  let { energy, stress } = base;
  if (mood === 'very_low') {
    energy = Math.min(energy, 28);
    stress = Math.max(stress, 72);
  } else if (mood === 'low') {
    energy = Math.min(energy, 38);
    stress = Math.max(stress, 58);
  } else if (mood === 'good') {
    energy = Math.max(energy, 55);
    stress = Math.min(stress, 42);
  } else if (mood === 'great') {
    energy = Math.max(energy, 68);
    stress = Math.min(stress, 32);
  }
  return { energy, stress };
}

/**
 * Read live signals for smart surface. Safe defaults when cache empty.
 * Studio demo override (local only) wins when present.
 */
export function readCompanionAiSignals(
  overrides?: Partial<WidgetAiSignals>,
): WidgetAiSignals {
  const beacon = getCached<BeaconLike>('widget:beacon:metrics');
  const tasks = getCached<TaskLike[]>('widget:daily_tasks:tasks');
  const journal = getCached<MoodLike>('widget:journal:last');
  const studioDemo = getCached<StudioOverride>(STUDIO_SIGNAL_OVERRIDE_KEY);

  /* Empty cache → 0 open tasks (not DEFAULT 3 — avoids false single_task). */
  const openTaskCount = Array.isArray(tasks)
    ? tasks.filter((t) => t && !t.done).length
    : 0;

  let energy =
    typeof beacon?.energy === 'number' ? beacon.energy : DEFAULT_AI_SIGNALS.energy;
  let stress =
    typeof beacon?.stress === 'number' ? beacon.stress : DEFAULT_AI_SIGNALS.stress;
  let sleep =
    typeof beacon?.sleep === 'number' ? beacon.sleep : DEFAULT_AI_SIGNALS.sleep;

  if (typeof beacon?.capacity === 'number' && beacon.capacity < 35) {
    energy = Math.min(energy, beacon.capacity + 5);
  }

  /* Journal always blends — so surface can switch after mood tap. */
  const blended = applyJournalMoodToSignals(
    journal?.mood ? String(journal.mood) : undefined,
    { energy, stress },
  );
  energy = blended.energy;
  stress = blended.stress;

  /* Anchor done today → gentle calm reward (never overrides high stress fully). */
  const anchor = getCached<{ at?: number; doneToday?: boolean }>('widget:daily_anchor:last');
  if (anchor?.at) {
    const d = new Date(anchor.at);
    const now = new Date();
    const sameDay =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();
    if (sameDay) {
      stress = Math.min(stress, Math.max(28, stress - 8));
      energy = Math.max(energy, Math.min(72, energy + 4));
    }
  }

  /* Harbor breath recently → slight stress ease. */
  const breath = getCached<{ at?: number }>('widget:safe_harbor:breath');
  if (typeof breath?.at === 'number' && Date.now() - breath.at < 15 * 60_000) {
    stress = Math.min(stress, Math.max(24, stress - 6));
  }

  const base: WidgetAiSignals = {
    stress: clamp(stress),
    energy: clamp(energy),
    sleep: clamp(sleep),
    openTaskCount: Math.max(0, openTaskCount),
    isBarnvecka: getBarnveckaPref(),
  };

  const withDemo: WidgetAiSignals = studioDemo
    ? {
        stress: clamp(
          typeof studioDemo.stress === 'number' ? studioDemo.stress : base.stress,
        ),
        energy: clamp(
          typeof studioDemo.energy === 'number' ? studioDemo.energy : base.energy,
        ),
        sleep: clamp(
          typeof studioDemo.sleep === 'number' ? studioDemo.sleep : base.sleep,
        ),
        openTaskCount: Math.max(
          0,
          typeof studioDemo.openTaskCount === 'number'
            ? studioDemo.openTaskCount
            : base.openTaskCount,
        ),
        isBarnvecka:
          typeof studioDemo.isBarnvecka === 'boolean'
            ? studioDemo.isBarnvecka
            : base.isBarnvecka,
      }
    : base;

  return {
    stress: clamp(overrides?.stress ?? withDemo.stress),
    energy: clamp(overrides?.energy ?? withDemo.energy),
    sleep: clamp(overrides?.sleep ?? withDemo.sleep),
    openTaskCount: Math.max(0, overrides?.openTaskCount ?? withDemo.openTaskCount),
    isBarnvecka: overrides?.isBarnvecka ?? withDemo.isBarnvecka,
  };
}
