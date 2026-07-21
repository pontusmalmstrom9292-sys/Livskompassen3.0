/**
 * WidgetFramework — Companion OS motor (WIDGET_BIBLE 3.2).
 * Lifecycle, registration, Action → Cache → Sync wiring.
 * No continuous background work (3.6).
 */

import { onAnyWidgetAction, type WidgetActionEvent } from './WidgetActions';
import {
  getCached,
  hydrateWidgetCache,
  setCached,
  subscribeWidgetCache,
} from './WidgetCache';
import {
  bindWidgetSyncLifecycle,
  queueWidgetSync,
  setWidgetSyncTransport,
  type WidgetSyncTransport,
} from './WidgetSync';
import { applyWidgetTheme, WIDGET_THEME_VERSION } from './WidgetTheme';

export type WidgetSize = 'xs' | 'small' | 'medium' | 'large';

/** Hierarchy levels — bible 1.9 */
export type WidgetLevel = 1 | 2 | 3 | 4;

export type WidgetDefinition = {
  id: string;
  title: string;
  size: WidgetSize;
  level: WidgetLevel;
  /** Optional default route / module deep-link key */
  moduleKey?: string;
};

export type WidgetInstanceState = {
  id: string;
  mounted: boolean;
  lastActionAt: number | null;
  offlinePending: boolean;
};

export type WidgetFrameworkStatus = {
  ready: boolean;
  themeVersion: string;
  registered: string[];
  mounted: string[];
};

type FrameworkListener = (status: WidgetFrameworkStatus) => void;

const registry = new Map<string, WidgetDefinition>();
const mounted = new Set<string>();
const statusListeners = new Set<FrameworkListener>();

let ready = false;
let unbindSync: (() => void) | null = null;
let unbindActions: (() => void) | null = null;
let unbindCache: (() => void) | null = null;
let bootPromise: Promise<void> | null = null;

const STATE_KEY = 'framework:meta';

function snapshot(): WidgetFrameworkStatus {
  return {
    ready,
    themeVersion: WIDGET_THEME_VERSION,
    registered: Array.from(registry.keys()).sort(),
    mounted: Array.from(mounted).sort(),
  };
}

function emit(): void {
  const s = snapshot();
  statusListeners.forEach((fn) => {
    try {
      fn(s);
    } catch {
      /* ignore */
    }
  });
}

async function persistMeta(): Promise<void> {
  await setCached(STATE_KEY, {
    registeredIds: Array.from(registry.keys()),
    updatedAt: Date.now(),
  });
}

/**
 * Default action pipeline: record last action in cache, enqueue sync envelope.
 * Widgets may still register their own handlers for domain logic.
 */
async function handleFrameworkAction(event: WidgetActionEvent): Promise<void> {
  const key = `widget:${event.widgetId}:lastAction`;
  await setCached(key, event);

  if (event.action === 'cancel') {
    await queueWidgetSync({
      type: 'cancel',
      source: `widget_${event.widgetId}`,
      payload: { gesture: event.gesture, at: event.at, detail: event.detail },
    });
    return;
  }

  await queueWidgetSync({
    type: event.action,
    source: `widget_${event.widgetId}`,
    payload: {
      gesture: event.gesture,
      at: event.at,
      detail: event.detail,
    },
  });
}

/**
 * Boot the Companion Widget motor once.
 * Hydrates cache, binds sync lifecycle, applies theme to optional root.
 */
export function bootWidgetFramework(opts?: {
  root?: HTMLElement | null;
  transport?: WidgetSyncTransport | null;
}): Promise<void> {
  if (bootPromise) return bootPromise;

  bootPromise = (async () => {
    if (opts?.root) applyWidgetTheme(opts.root);
    if (opts?.transport !== undefined) setWidgetSyncTransport(opts.transport ?? null);

    await hydrateWidgetCache();

    unbindSync = bindWidgetSyncLifecycle();
    unbindActions = onAnyWidgetAction((event) => {
      void handleFrameworkAction(event);
    });
    unbindCache = subscribeWidgetCache(() => {
      /* reserved for future UI bridge — no polling */
    });

    ready = true;
    emit();
    await persistMeta();
  })().catch((err) => {
    bootPromise = null;
    ready = false;
    throw err;
  });

  return bootPromise;
}

export function shutdownWidgetFramework(): void {
  unbindSync?.();
  unbindActions?.();
  unbindCache?.();
  unbindSync = null;
  unbindActions = null;
  unbindCache = null;
  mounted.clear();
  ready = false;
  bootPromise = null;
  emit();
}

export function registerWidget(definition: WidgetDefinition): void {
  if (!definition.id.trim()) {
    throw new Error('WidgetFramework: id required');
  }
  registry.set(definition.id, Object.freeze({ ...definition }));
  void persistMeta();
  emit();
}

export function unregisterWidget(id: string): void {
  registry.delete(id);
  mounted.delete(id);
  void persistMeta();
  emit();
}

export function getWidgetDefinition(id: string): WidgetDefinition | undefined {
  return registry.get(id);
}

export function listWidgets(): WidgetDefinition[] {
  return Array.from(registry.values());
}

export function mountWidget(id: string, themeRoot?: HTMLElement | null): WidgetInstanceState {
  if (!registry.has(id)) {
    throw new Error(`WidgetFramework: unknown widget "${id}"`);
  }
  if (themeRoot) applyWidgetTheme(themeRoot);
  mounted.add(id);
  emit();
  const last = getCached<WidgetActionEvent>(`widget:${id}:lastAction`);
  return {
    id,
    mounted: true,
    lastActionAt: last?.at ?? null,
    offlinePending: false,
  };
}

export function unmountWidget(id: string): void {
  mounted.delete(id);
  emit();
}

export function isWidgetFrameworkReady(): boolean {
  return ready;
}

export function getWidgetFrameworkStatus(): WidgetFrameworkStatus {
  return snapshot();
}

export function subscribeWidgetFramework(listener: FrameworkListener): () => void {
  statusListeners.add(listener);
  listener(snapshot());
  return () => statusListeners.delete(listener);
}

export function setFrameworkTransport(transport: WidgetSyncTransport | null): void {
  setWidgetSyncTransport(transport);
}
