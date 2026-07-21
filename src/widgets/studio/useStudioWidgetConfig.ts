import { useSyncExternalStore } from 'react';
import {
  getWidgetStudioConfig,
  getWidgetStudioState,
  subscribeWidgetStudio,
} from '../studio/widgetStudioStore';
import type { WidgetStudioConfig } from '../studio/widgetStudioTypes';

function subscribe(cb: () => void): () => void {
  return subscribeWidgetStudio(() => cb());
}

function getSnapshot(): ReturnType<typeof getWidgetStudioState> {
  return getWidgetStudioState();
}

/** Reactive studio config for a single widget. */
export function useStudioWidgetConfig(widgetId: string): WidgetStudioConfig | undefined {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return state.widgets[widgetId] ?? getWidgetStudioConfig(widgetId);
}
