/**
 * WidgetActions — gesture → standardized action + haptic (WIDGET_BIBLE 3.5 / UX Law 09).
 * Hardcoded haptic support; no continuous timers.
 */

export type WidgetGesture = 'tap' | 'longPress' | 'doubleTap' | 'swipe';

/** Haptic intensity mapped 1:1 to bible 3.5 */
export type WidgetHapticProfile = 'light' | 'mediumHeavy' | 'doubleMicro' | 'softFade';

export type WidgetActionKind =
  | 'primary'
  | 'secondary'
  | 'primary_capture'
  | 'open_recent'
  | 'open_module'
  | 'overlay'
  | 'complete'
  | 'cancel'
  | 'custom';

export type WidgetActionEvent = {
  widgetId: string;
  gesture: WidgetGesture;
  action: WidgetActionKind;
  /** Optional payload (e.g. swipe direction) */
  detail?: Record<string, unknown>;
  at: number;
};

export type WidgetActionHandler = (event: WidgetActionEvent) => void | Promise<void>;

type NativeHapticBridge = {
  triggerHaptic?: (type: 'success' | 'error') => void;
  triggerNavigationHaptic?: () => void;
  triggerRecordingHaptic?: () => void;
};

const GESTURE_TO_HAPTIC: Record<WidgetGesture, WidgetHapticProfile> = {
  tap: 'light',
  longPress: 'mediumHeavy',
  doubleTap: 'doubleMicro',
  swipe: 'softFade',
};

const GESTURE_TO_ACTION: Record<WidgetGesture, WidgetActionKind> = {
  tap: 'primary',
  longPress: 'secondary',
  doubleTap: 'open_recent',
  swipe: 'cancel',
};

/** Vibration patterns (ms) — web fallback when native bridge absent */
const HAPTIC_PATTERNS: Record<WidgetHapticProfile, number | number[]> = {
  light: 12,
  mediumHeavy: [18, 42, 28],
  doubleMicro: [8, 36, 8],
  softFade: [6, 24, 4],
};

const handlers = new Map<string, Set<WidgetActionHandler>>();
const globalHandlers = new Set<WidgetActionHandler>();

function getNativeBridge(): NativeHapticBridge | undefined {
  if (typeof window === 'undefined') return undefined;
  return (window as Window & { LivskompassenNative?: NativeHapticBridge }).LivskompassenNative;
}

/**
 * Hardcoded haptic feedback — UX Law 09 / bible 3.5.
 * Prefer Android bridge; fall back to Vibration API; never throw.
 */
export function triggerWidgetHaptic(profile: WidgetHapticProfile): void {
  const native = getNativeBridge();
  try {
    if (native) {
      if (profile === 'light' && native.triggerRecordingHaptic) {
        native.triggerRecordingHaptic();
        return;
      }
      if (profile === 'doubleMicro' && native.triggerNavigationHaptic) {
        native.triggerNavigationHaptic();
        return;
      }
      if ((profile === 'mediumHeavy' || profile === 'softFade') && native.triggerHaptic) {
        native.triggerHaptic(profile === 'mediumHeavy' ? 'success' : 'success');
        return;
      }
      if (native.triggerHaptic) {
        native.triggerHaptic('success');
        return;
      }
    }
  } catch {
    /* fall through to vibrate */
  }

  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(HAPTIC_PATTERNS[profile]);
    } catch {
      /* haptics optional on desktop */
    }
  }
}

export function hapticForGesture(gesture: WidgetGesture): WidgetHapticProfile {
  return GESTURE_TO_HAPTIC[gesture];
}

export function defaultActionForGesture(gesture: WidgetGesture): WidgetActionKind {
  return GESTURE_TO_ACTION[gesture];
}

/**
 * Dispatch a gesture: haptic FIRST (immediate feel), then handlers.
 * UI must already have optimistic cache updates when needed.
 */
export async function dispatchWidgetGesture(input: {
  widgetId: string;
  gesture: WidgetGesture;
  action?: WidgetActionKind;
  detail?: Record<string, unknown>;
  /** Set false only for silent system events (rare). Default true. */
  haptic?: boolean;
}): Promise<WidgetActionEvent> {
  const action = input.action ?? defaultActionForGesture(input.gesture);
  const event: WidgetActionEvent = {
    widgetId: input.widgetId,
    gesture: input.gesture,
    action,
    detail: input.detail,
    at: Date.now(),
  };

  if (input.haptic !== false) {
    triggerWidgetHaptic(hapticForGesture(input.gesture));
  }

  const scoped = handlers.get(input.widgetId);
  const run: WidgetActionHandler[] = [
    ...(scoped ? Array.from(scoped) : []),
    ...Array.from(globalHandlers),
  ];

  for (const handler of run) {
    await handler(event);
  }

  return event;
}

export function onWidgetAction(widgetId: string, handler: WidgetActionHandler): () => void {
  let set = handlers.get(widgetId);
  if (!set) {
    set = new Set();
    handlers.set(widgetId, set);
  }
  set.add(handler);
  return () => {
    set?.delete(handler);
    if (set && set.size === 0) handlers.delete(widgetId);
  };
}

export function onAnyWidgetAction(handler: WidgetActionHandler): () => void {
  globalHandlers.add(handler);
  return () => globalHandlers.delete(handler);
}

/** Long-press detector helper — no intervals while idle; only while pointer down. */
export function createLongPressController(opts: {
  widgetId: string;
  ms?: number;
  onFire?: (event: WidgetActionEvent) => void;
}): {
  onPointerDown: (e: Pick<PointerEvent, 'pointerId'>) => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
  dispose: () => void;
} {
  const delay = opts.ms ?? 480;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const clear = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return {
    onPointerDown: () => {
      clear();
      timer = setTimeout(() => {
        timer = null;
        void dispatchWidgetGesture({ widgetId: opts.widgetId, gesture: 'longPress' }).then(
          (ev) => opts.onFire?.(ev),
        );
      }, delay);
    },
    onPointerUp: clear,
    onPointerCancel: clear,
    dispose: clear,
  };
}

/**
 * Double-tap helper — delays single action so a second tap within window wins.
 * No continuous timers when idle.
 */
export function createDoubleTapController(opts: {
  windowMs?: number;
  onSingle: () => void;
  onDouble: () => void;
}): {
  onActivate: () => void;
  dispose: () => void;
} {
  const windowMs = opts.windowMs ?? 340;
  let lastAt = 0;
  let singleTimer: ReturnType<typeof setTimeout> | null = null;

  const clearSingle = () => {
    if (singleTimer !== null) {
      clearTimeout(singleTimer);
      singleTimer = null;
    }
  };

  return {
    onActivate: () => {
      const now = Date.now();
      if (now - lastAt < windowMs) {
        clearSingle();
        lastAt = 0;
        opts.onDouble();
        return;
      }
      lastAt = now;
      clearSingle();
      singleTimer = setTimeout(() => {
        singleTimer = null;
        opts.onSingle();
      }, windowMs);
    },
    dispose: clearSingle,
  };
}
