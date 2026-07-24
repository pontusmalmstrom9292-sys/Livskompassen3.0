import { Capacitor } from '@capacitor/core';

const DOCK_SHELL_SELECTOR = '.dock-shell--basta-v2';
const DOCK_BAR_SELECTOR = '.basta-dock-bar--v2';
/** Intern luft under etiketter — aldrig safe-area här (orsakade ~1 cm gap). */
const BAR_BOTTOM_PX = '4px';
/** Minsta lyft om Capacitor inte hunnit injicera än. */
const SHELL_BOTTOM_FALLBACK_PX = 4;

let trimObserver: MutationObserver | null = null;
let trimScheduled = false;
let applyingTrim = false;
let lastAppliedShellBottom = -1;
let lastAppliedSafeBottom = -1;

/** Capacitor Android WebView (https://localhost) eller native platform. */
export function isAndroidCapacitorShell(): boolean {
  if (typeof window === 'undefined') return false;

  const cap = Capacitor;
  if (cap.getPlatform() === 'android') return true;

  const isNative =
    typeof cap.isNativePlatform === 'function'
      ? cap.isNativePlatform()
      : cap.getPlatform() !== 'web';

  if (!isNative) return false;

  return /Android/i.test(navigator.userAgent);
}

export function markAndroidShellHtml(): void {
  if (!isAndroidCapacitorShell()) return;
  document.documentElement.classList.add('platform-capacitor-android');
}

function readCapacitorSafeBottomPx(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--safe-area-inset-bottom')
    .trim();
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

/**
 * Capacitor SystemBars: safe-area ska bara ligga på shell (gestyrad), inte i nav-baren.
 * MainActivity MUST stay full-bleed (content padding-bottom = 0) — native pad + this
 * trim stacked ~1 cm gap. Dubbel padding på bar gav samma gap; noll på shell (utan
 * native pad) gav "för långt ned".
 *
 * Idempotent — skippar om värden oförändrade (undviker MutationObserver↔style-loop
 * som körde trim varje rAF och gav hackig scroll).
 */
export function trimAndroidBastaDockInsets(): void {
  if (!isAndroidCapacitorShell()) return;

  const root = document.documentElement;
  if (!root.classList.contains('platform-capacitor-android')) {
    root.classList.add('platform-capacitor-android');
  }

  const shell = document.querySelector<HTMLElement>(DOCK_SHELL_SELECTOR);
  const bar = document.querySelector<HTMLElement>(DOCK_BAR_SELECTOR);
  if (!shell || !bar) return;

  const safeBottom = readCapacitorSafeBottomPx();
  const shellBottom = Math.max(SHELL_BOTTOM_FALLBACK_PX, Math.round(safeBottom));

  const unchanged =
    safeBottom === lastAppliedSafeBottom &&
    shellBottom === lastAppliedShellBottom &&
    root.style.getPropertyValue('--lk-android-shell-inset') === `${shellBottom}px` &&
    shell.style.paddingBottom === `${shellBottom}px` &&
    bar.style.paddingBottom === BAR_BOTTOM_PX;

  if (unchanged) return;

  lastAppliedSafeBottom = safeBottom;
  lastAppliedShellBottom = shellBottom;

  applyingTrim = true;
  try {
    root.style.setProperty('--lk-android-shell-inset', `${shellBottom}px`);
    shell.style.setProperty('padding-bottom', `${shellBottom}px`, 'important');
    shell.style.setProperty('padding-top', '0px', 'important');
    bar.style.setProperty('padding-bottom', BAR_BOTTOM_PX, 'important');

    bar.querySelectorAll<HTMLElement>('.basta-dock-bar__side').forEach((side) => {
      side.style.setProperty('padding-bottom', '0px', 'important');
      side.style.setProperty('min-height', 'unset', 'important');
    });
  } finally {
    // Allow nested observers to settle before accepting new mutations.
    requestAnimationFrame(() => {
      applyingTrim = false;
    });
  }
}

function scheduleTrim(): void {
  if (trimScheduled || applyingTrim) return;
  trimScheduled = true;
  requestAnimationFrame(() => {
    trimScheduled = false;
    trimAndroidBastaDockInsets();
  });
}

/** Håll koll — Capacitor injicerar safe-area efter DOM ready. */
export function watchAndroidDockInsetFix(): () => void {
  if (!isAndroidCapacitorShell()) return () => undefined;

  markAndroidShellHtml();
  lastAppliedShellBottom = -1;
  lastAppliedSafeBottom = -1;
  scheduleTrim();

  const root = document.documentElement;
  // Only class changes on <html> — NOT style (our own --lk-android-shell-inset writes).
  trimObserver = new MutationObserver(() => {
    if (applyingTrim) return;
    scheduleTrim();
  });
  trimObserver.observe(root, { attributes: true, attributeFilter: ['class'] });

  window.addEventListener('resize', scheduleTrim);
  window.visualViewport?.addEventListener('resize', scheduleTrim);

  // Dock may mount late — watch only direct body children, not full subtree thrash.
  const bodyObserver = new MutationObserver(() => {
    if (applyingTrim) return;
    scheduleTrim();
  });
  bodyObserver.observe(document.body, { childList: true, subtree: false });

  // One delayed pass after Capacitor SystemBars injects CSS vars.
  const t1 = window.setTimeout(() => scheduleTrim(), 400);
  const t2 = window.setTimeout(() => scheduleTrim(), 1200);

  return () => {
    trimObserver?.disconnect();
    trimObserver = null;
    bodyObserver.disconnect();
    window.removeEventListener('resize', scheduleTrim);
    window.visualViewport?.removeEventListener('resize', scheduleTrim);
    window.clearTimeout(t1);
    window.clearTimeout(t2);
  };
}
