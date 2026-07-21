/**
 * WidgetAnimations — micro-motion tokens (WIDGET_BIBLE 3.2 / UX Law 08).
 * Purpose only: press, rotate, breathe, open/close. No decorative loops in JS.
 */

export const WidgetMotion = {
  pressScale: 0.97,
  pressMs: 120,
  openMs: 280,
  closeMs: 220,
  compassRotateMs: 520,
  breatheMs: 4200,
  easePremium: 'cubic-bezier(0.22, 1, 0.36, 1)',
  easeSoft: 'cubic-bezier(0.33, 1, 0.68, 1)',
} as const;

export type WidgetMotionName = 'press' | 'compassRotate' | 'breathe' | 'open' | 'close';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** CSS class names applied by companion-widgets.css */
export const WidgetAnimClass = {
  press: 'cw-anim-press',
  compassRotate: 'cw-anim-compass',
  breathe: 'cw-anim-breathe',
  open: 'cw-anim-open',
  close: 'cw-anim-close',
} as const;

export function motionDurationMs(name: WidgetMotionName): number {
  if (prefersReducedMotion()) return 0;
  switch (name) {
    case 'press':
      return WidgetMotion.pressMs;
    case 'compassRotate':
      return WidgetMotion.compassRotateMs;
    case 'breathe':
      return WidgetMotion.breatheMs;
    case 'open':
      return WidgetMotion.openMs;
    case 'close':
      return WidgetMotion.closeMs;
    default:
      return WidgetMotion.openMs;
  }
}

/**
 * Transient press feedback on an element — single timeout, cleared on dispose.
 * No intervals while idle.
 */
export function playPressAnimation(el: HTMLElement | null): () => void {
  if (!el || prefersReducedMotion()) return () => undefined;
  el.classList.add(WidgetAnimClass.press);
  const t = window.setTimeout(() => {
    el.classList.remove(WidgetAnimClass.press);
  }, WidgetMotion.pressMs);
  return () => {
    window.clearTimeout(t);
    el.classList.remove(WidgetAnimClass.press);
  };
}

export function playCompassRotate(el: HTMLElement | null): () => void {
  if (!el || prefersReducedMotion()) return () => undefined;
  el.classList.remove(WidgetAnimClass.compassRotate);
  // force reflow for re-trigger
  void el.offsetWidth;
  el.classList.add(WidgetAnimClass.compassRotate);
  const t = window.setTimeout(() => {
    el.classList.remove(WidgetAnimClass.compassRotate);
  }, WidgetMotion.compassRotateMs);
  return () => {
    window.clearTimeout(t);
    el.classList.remove(WidgetAnimClass.compassRotate);
  };
}

/** Toggle breathe class while mounted — CSS handles the loop; JS only adds/removes. */
export function setBreatheActive(el: HTMLElement | null, active: boolean): void {
  if (!el) return;
  if (prefersReducedMotion() || !active) {
    el.classList.remove(WidgetAnimClass.breathe);
    return;
  }
  el.classList.add(WidgetAnimClass.breathe);
}

export function getMotionCssVars(): Record<string, string> {
  return {
    '--cw-press-scale': String(WidgetMotion.pressScale),
    '--cw-press-ms': `${WidgetMotion.pressMs}ms`,
    '--cw-open-ms': `${WidgetMotion.openMs}ms`,
    '--cw-close-ms': `${WidgetMotion.closeMs}ms`,
    '--cw-compass-ms': `${WidgetMotion.compassRotateMs}ms`,
    '--cw-breathe-ms': `${WidgetMotion.breatheMs}ms`,
    '--cw-ease-premium': WidgetMotion.easePremium,
    '--cw-ease-soft': WidgetMotion.easeSoft,
  };
}
