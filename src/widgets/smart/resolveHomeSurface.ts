/**
 * Merge Studio + time + AI into one home surface (WIDGET_BIBLE 5.3–5.5).
 */

import { getWidgetStudioState } from '../studio/widgetStudioStore';
import { resolveSmartTime, type DayPeriod, type SmartTimeSnapshot } from './smartTimeContext';
import {
  DEFAULT_AI_SIGNALS,
  resolveWidgetAi,
  type AiMode,
  type WidgetAiSignals,
  type WidgetAiSnapshot,
} from './widgetAiContext';

export type CompanionHomeSurface = {
  period: DayPeriod;
  time: SmartTimeSnapshot;
  ai: WidgetAiSnapshot;
  mode: AiMode;
  featuredWidgetIds: string[];
  visibleWidgetIds: string[];
  dimVisual: boolean;
  banner: string;
  smartTimeEnabled: boolean;
  smartAiEnabled: boolean;
};

const ALL_IDS = [
  'quick_capture',
  'compass',
  'quick_note',
  'inbox',
  'daily_anchor',
  'child_focus',
  'beacon',
  'daily_tasks',
  'journal',
  'safe_harbor',
];

function unique(ids: string[]): string[] {
  return Array.from(new Set(ids));
}

export function resolveHomeSurface(opts?: {
  now?: Date;
  signals?: WidgetAiSignals;
}): CompanionHomeSurface {
  const studio = getWidgetStudioState();
  const time = resolveSmartTime(opts?.now);
  const aiEnabled = studio.smartAiEnabled;
  const ai = aiEnabled
    ? resolveWidgetAi(opts?.signals ?? DEFAULT_AI_SIGNALS)
    : {
        mode: 'normal' as const,
        dimVisual: false,
        pauseProactive: false,
        message: '',
        preferWidgetIds: [] as string[],
        hideWidgetIds: [] as string[],
      };

  const enabled = ALL_IDS.filter((id) => studio.widgets[id]?.enabled !== false);
  const pinned = ALL_IDS.filter(
    (id) => enabled.includes(id) && studio.widgets[id]?.homePin === true,
  );

  let featured: string[] = [];
  if (aiEnabled && ai.mode !== 'normal') {
    /* Stress/energi overrides pins — calm first. */
    featured = ai.preferWidgetIds.filter((id) => enabled.includes(id));
  } else if (studio.smartTimeEnabled) {
    featured = unique([
      ...pinned,
      ...time.suggestedWidgetIds.filter((id) => enabled.includes(id)),
    ]);
  } else {
    featured = unique([...pinned, ...enabled]).slice(0, 3);
  }

  const hide = new Set(aiEnabled ? ai.hideWidgetIds : []);

  let visible = enabled.filter((id) => !hide.has(id));

  if (aiEnabled && ai.mode === 'anchor_only') {
    visible = enabled.filter((id) => ai.preferWidgetIds.includes(id));
  }

  /* Featured first, then remaining — calm order */
  const rest = visible.filter((id) => !featured.includes(id));
  visible = unique([...featured, ...rest]);

  const bannerParts = [
    aiEnabled && ai.message ? ai.message : '',
    studio.smartTimeEnabled && !(aiEnabled && ai.message) ? time.message : '',
  ].filter(Boolean);

  return {
    period: time.period,
    time,
    ai,
    mode: ai.mode,
    featuredWidgetIds: featured,
    visibleWidgetIds: visible,
    dimVisual: ai.dimVisual,
    banner: bannerParts[0] ?? '',
    smartTimeEnabled: studio.smartTimeEnabled,
    smartAiEnabled: aiEnabled,
  };
}
