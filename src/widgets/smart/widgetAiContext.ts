/**
 * Widget AI context — quiet state rules (WIDGET_BIBLE 5.4).
 * Heuristics only — never invasive, never neon, never surprise cuts mid-tap.
 */

export type AiMode = 'normal' | 'harbor' | 'single_task' | 'family' | 'anchor_only';

export type WidgetAiSignals = {
  stress: number;
  energy: number;
  sleep: number;
  openTaskCount: number;
  isBarnvecka: boolean;
};

export type WidgetAiSnapshot = {
  mode: AiMode;
  dimVisual: boolean;
  pauseProactive: boolean;
  message: string;
  preferWidgetIds: string[];
  hideWidgetIds: string[];
};

export const DEFAULT_AI_SIGNALS: WidgetAiSignals = {
  stress: 35,
  energy: 60,
  sleep: 65,
  openTaskCount: 3,
  isBarnvecka: false,
};

/**
 * Resolve AI surface. Priority: crash-prevention > stress > overload > barnvecka > normal.
 */
export function resolveWidgetAi(signals: WidgetAiSignals = DEFAULT_AI_SIGNALS): WidgetAiSnapshot {
  const { stress, energy, sleep, openTaskCount, isBarnvecka } = signals;

  /* Scenario 4 — low energy / crash prevention */
  if (energy <= 30 || (energy <= 40 && sleep <= 40)) {
    return {
      mode: 'anchor_only',
      dimVisual: true,
      pauseProactive: true,
      message: 'Låg energi — ett mikrosteg räcker.',
      preferWidgetIds: ['daily_anchor', 'safe_harbor'],
      hideWidgetIds: ['daily_tasks', 'inbox', 'quick_note', 'compass'],
    };
  }

  /* Scenario 1 — high stress */
  if (stress >= 70) {
    return {
      mode: 'harbor',
      dimVisual: true,
      pauseProactive: true,
      message: 'Hög belastning — andas först.',
      preferWidgetIds: ['safe_harbor', 'beacon', 'daily_anchor'],
      hideWidgetIds: ['daily_tasks'],
    };
  }

  /* Scenario 2 — information overload */
  if (openTaskCount >= 6) {
    return {
      mode: 'single_task',
      dimVisual: false,
      pauseProactive: false,
      message: 'Ett nästa steg. Resten väntar.',
      preferWidgetIds: ['daily_tasks', 'daily_anchor'],
      hideWidgetIds: [],
    };
  }

  /* Scenario 3 — barnvecka */
  if (isBarnvecka) {
    return {
      mode: 'family',
      dimVisual: false,
      pauseProactive: false,
      message: 'Barnvecka — närvaro före prestation.',
      preferWidgetIds: ['child_focus', 'safe_harbor', 'daily_tasks'],
      hideWidgetIds: [],
    };
  }

  return {
    mode: 'normal',
    dimVisual: false,
    pauseProactive: false,
    message: '',
    preferWidgetIds: [],
    hideWidgetIds: [],
  };
}
