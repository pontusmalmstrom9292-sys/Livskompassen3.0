/**
 * WidgetRouter — destination routing (WIDGET_BIBLE 3.2).
 * background | overlay | module — no continuous work.
 */

export type WidgetRouteMode = 'background' | 'overlay' | 'module';

export type WidgetRouteTarget = {
  mode: WidgetRouteMode;
  /** Module / deep-link path when mode === 'module' */
  path?: string;
  /** Overlay id when mode === 'overlay' */
  overlayId?: string;
  /** Opaque payload for background handlers */
  payload?: Record<string, unknown>;
};

export type WidgetRouteRequest = {
  widgetId: string;
  action: string;
  detail?: Record<string, unknown>;
};

type OverlayOpener = (overlayId: string, detail?: Record<string, unknown>) => void;
type ModuleNavigator = (path: string, detail?: Record<string, unknown>) => void;
type BackgroundRunner = (request: WidgetRouteRequest, target: WidgetRouteTarget) => void | Promise<void>;

const MODULE_MAP: Record<string, string> = {
  inkast: '/inkast',
  dagbok: '/hjartat?tab=reflektion',
  kompass: '/',
  fyren: '/vardagen',
  hamn: '/hamn',
  barn: '/familjen',
  planering: '/vardagen?tab=planering',
  mabra: '/vardagen?tab=mabra',
  valv: '/valvet',
};

let overlayOpener: OverlayOpener | null = null;
let moduleNavigator: ModuleNavigator | null = null;
let backgroundRunner: BackgroundRunner | null = null;

export function setWidgetOverlayOpener(fn: OverlayOpener | null): void {
  overlayOpener = fn;
}

export function setWidgetModuleNavigator(fn: ModuleNavigator | null): void {
  moduleNavigator = fn;
}

export function setWidgetBackgroundRunner(fn: BackgroundRunner | null): void {
  backgroundRunner = fn;
}

export function resolveModulePath(moduleKey: string): string {
  return MODULE_MAP[moduleKey] ?? `/${moduleKey}`;
}

/**
 * Resolve default destination from action + optional moduleKey.
 * Capture / complete stay in background; open_* go module or overlay.
 */
export function resolveWidgetRoute(
  request: WidgetRouteRequest,
  opts?: { moduleKey?: string },
): WidgetRouteTarget {
  const action = request.action;
  const detail = request.detail ?? {};

  if (action === 'cancel' || action === 'primary_capture' || action === 'capture' || action === 'complete') {
    return { mode: 'background', payload: { ...detail, action } };
  }

  if (action === 'overlay' || action === 'secondary' || detail.overlayId) {
    return {
      mode: 'overlay',
      overlayId: String(detail.overlayId ?? `${request.widgetId}_sheet`),
      payload: detail,
    };
  }

  if (action === 'open_recent' || action === 'open_module' || action === 'primary') {
    const key = String(detail.moduleKey ?? opts?.moduleKey ?? request.widgetId);
    const path = String(detail.path ?? resolveModulePath(key));
    return { mode: 'module', path, payload: detail };
  }

  return { mode: 'background', payload: { ...detail, action } };
}

/** Execute a resolved route. Never blocks UI on network. */
export async function routeWidgetAction(
  request: WidgetRouteRequest,
  opts?: { moduleKey?: string; target?: WidgetRouteTarget },
): Promise<WidgetRouteTarget> {
  const target = opts?.target ?? resolveWidgetRoute(request, opts);

  if (target.mode === 'overlay' && target.overlayId && overlayOpener) {
    overlayOpener(target.overlayId, target.payload);
    return target;
  }

  if (target.mode === 'module' && target.path) {
    if (moduleNavigator) {
      moduleNavigator(target.path, target.payload);
    } else if (typeof window !== 'undefined') {
      window.location.assign(target.path);
    }
    return target;
  }

  if (target.mode === 'background' && backgroundRunner) {
    await backgroundRunner(request, target);
  }

  return target;
}
