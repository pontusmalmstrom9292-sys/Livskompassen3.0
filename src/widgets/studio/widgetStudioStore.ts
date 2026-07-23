/**
 * Widget Studio store — local-first via WidgetCache (WIDGET_BIBLE 5.1 / 3.4).
 */

import { CORE_PACK_DEFINITIONS } from '../pack/registerCorePack';
import { getCached, hydrateWidgetCache, setCached } from '../core/WidgetCache';
import { clampHomePins, defaultConfigForWidget, guideWidgetConfig } from './guidedCustomization';
import type { WidgetStudioConfig, WidgetStudioState } from './widgetStudioTypes';
import { STUDIO_CACHE_KEY } from './widgetStudioTypes';
import type { StudioModuleKey } from './widgetStudioTypes';

type Listener = (state: WidgetStudioState) => void;

const listeners = new Set<Listener>();

function moduleFromKey(moduleKey: string | undefined): StudioModuleKey {
  const allowed: StudioModuleKey[] = [
    'inkast',
    'dagbok',
    'fyren',
    'hamn',
    'barn',
    'planering',
    'kompass',
    'mabra',
  ];
  if (moduleKey && (allowed as string[]).includes(moduleKey)) {
    return moduleKey as StudioModuleKey;
  }
  return 'inkast';
}

export function buildDefaultStudioState(): WidgetStudioState {
  /** First-run calm surface — few widgets on, rest available in Studio. */
  const calmOn = new Set([
    'quick_capture',
    'safe_harbor',
    'daily_anchor',
    'journal',
    'inbox',
  ]);
  const widgets: Record<string, WidgetStudioConfig> = {};
  for (const def of CORE_PACK_DEFINITIONS) {
    const accent =
      def.id === 'beacon' ? 'ethereal' : def.id === 'safe_harbor' ? 'gold' : 'gold';
    const animation =
      def.id === 'beacon' || def.id === 'safe_harbor'
        ? 'breathe'
        : def.id === 'compass'
          ? 'slow_rotate'
          : 'static';
    widgets[def.id] = defaultConfigForWidget(def.id, {
      enabled: calmOn.has(def.id),
      size: def.size,
      moduleKey: moduleFromKey(def.moduleKey),
      accent,
      animation,
      shortcuts:
        def.id === 'inbox'
          ? ['text', 'voice', 'photo', 'link']
          : def.id === 'quick_note'
            ? ['text', 'voice', 'photo']
            : ['text'],
    });
  }
  return {
    version: 1,
    updatedAt: Date.now(),
    smartTimeEnabled: true,
    smartAiEnabled: false,
    widgets,
  };
}

function readMemory(): WidgetStudioState {
  const cached = getCached<WidgetStudioState>(STUDIO_CACHE_KEY);
  if (cached?.version === 1 && cached.widgets) {
    const guided: Record<string, WidgetStudioConfig> = {};
    for (const [id, cfg] of Object.entries(cached.widgets)) {
      guided[id] = guideWidgetConfig(cfg);
    }
    return { ...cached, widgets: guided };
  }
  return buildDefaultStudioState();
}

let memory = readMemory();

function emit(): void {
  listeners.forEach((fn) => {
    try {
      fn(memory);
    } catch {
      /* ignore */
    }
  });
}

export async function hydrateWidgetStudio(): Promise<WidgetStudioState> {
  await hydrateWidgetCache();
  memory = mergeMissingPackWidgets(readMemory());
  await setCached(STUDIO_CACHE_KEY, memory);
  emit();
  return memory;
}

/** Add newly registered pack widgets without wiping user prefs. */
function mergeMissingPackWidgets(state: WidgetStudioState): WidgetStudioState {
  const defaults = buildDefaultStudioState();
  let changed = false;
  const widgets = { ...state.widgets };
  for (const [id, cfg] of Object.entries(defaults.widgets)) {
    if (!widgets[id]) {
      widgets[id] = cfg;
      changed = true;
    }
  }
  if (!changed) return state;
  return { ...state, widgets, updatedAt: Date.now() };
}

/** Reset enabled flags to calm first-run set (keeps size/material prefs). */
export async function resetStudioToCalmDefaults(): Promise<WidgetStudioState> {
  const calm = buildDefaultStudioState();
  const widgets: Record<string, WidgetStudioConfig> = {};
  for (const [id, calmCfg] of Object.entries(calm.widgets)) {
    const prev = memory.widgets[id];
    widgets[id] = guideWidgetConfig({
      ...(prev ?? calmCfg),
      enabled: calmCfg.enabled,
      widgetId: id,
    });
  }
  return saveWidgetStudioState({
    ...memory,
    smartTimeEnabled: true,
    smartAiEnabled: false,
    widgets,
  });
}

export function getWidgetStudioState(): WidgetStudioState {
  return memory;
}

export function getWidgetStudioConfig(widgetId: string): WidgetStudioConfig | undefined {
  return memory.widgets[widgetId];
}

export async function saveWidgetStudioState(next: WidgetStudioState): Promise<WidgetStudioState> {
  const guidedWidgets: Record<string, WidgetStudioConfig> = {};
  for (const [id, cfg] of Object.entries(next.widgets)) {
    guidedWidgets[id] = guideWidgetConfig(cfg);
  }
  memory = {
    ...next,
    version: 1,
    updatedAt: Date.now(),
    widgets: clampHomePins(guidedWidgets),
  };
  await setCached(STUDIO_CACHE_KEY, memory);
  emit();
  return memory;
}

export async function patchWidgetStudioConfig(
  widgetId: string,
  patch: Partial<WidgetStudioConfig>,
): Promise<WidgetStudioConfig> {
  const prev = memory.widgets[widgetId] ?? buildDefaultStudioState().widgets[widgetId];
  if (!prev) {
    throw new Error(`unknown_widget:${widgetId}`);
  }
  const merged = guideWidgetConfig({ ...prev, ...patch, widgetId });
  const widgets = clampHomePins(
    { ...memory.widgets, [widgetId]: merged },
    patch.homePin ? widgetId : undefined,
  );
  await saveWidgetStudioState({
    ...memory,
    widgets,
  });
  return memory.widgets[widgetId] ?? merged;
}

export async function setStudioSmartFlags(flags: {
  smartTimeEnabled?: boolean;
  smartAiEnabled?: boolean;
}): Promise<WidgetStudioState> {
  return saveWidgetStudioState({
    ...memory,
    smartTimeEnabled: flags.smartTimeEnabled ?? memory.smartTimeEnabled,
    smartAiEnabled: flags.smartAiEnabled ?? memory.smartAiEnabled,
  });
}

export function subscribeWidgetStudio(listener: Listener): () => void {
  listeners.add(listener);
  listener(memory);
  return () => listeners.delete(listener);
}
