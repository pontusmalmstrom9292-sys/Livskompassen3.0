import { Capacitor } from '@capacitor/core';

const DOCK_SHELL_SELECTOR = '.dock-shell--basta-v2';
const DOCK_BAR_SELECTOR = '.basta-dock-bar--v2';
/** Intern luft under etiketter — aldrig safe-area här (orsakade ~1 cm gap). */
const BAR_BOTTOM_PX = '4px';
/** Minsta lyft om Capacitor inte hunnit injicera än. */
const SHELL_BOTTOM_FALLBACK_PX = 10;

let trimObserver: MutationObserver | null = null;
let trimScheduled = false;

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
 * Dubbel padding på bar gav ~1 cm gap; noll på shell gav "för långt ned".
 */
export function trimAndroidBastaDockInsets(): void {
  if (!isAndroidCapacitorShell()) return;

  const root = document.documentElement;
  root.classList.add('platform-capacitor-android');

  const shell = document.querySelector<HTMLElement>(DOCK_SHELL_SELECTOR);
  const bar = document.querySelector<HTMLElement>(DOCK_BAR_SELECTOR);
  if (!shell || !bar) return;

  const safeBottom = readCapacitorSafeBottomPx();
  const shellBottom = Math.max(SHELL_BOTTOM_FALLBACK_PX, Math.round(safeBottom));

  root.style.setProperty('--lk-android-shell-inset', `${shellBottom}px`);
  shell.style.setProperty('padding-bottom', `${shellBottom}px`, 'important');
  shell.style.setProperty('padding-top', '0px', 'important');

  bar.style.setProperty('padding-bottom', BAR_BOTTOM_PX, 'important');

  bar.querySelectorAll<HTMLElement>('.basta-dock-bar__side').forEach((side) => {
    side.style.setProperty('padding-bottom', '0px', 'important');
    side.style.setProperty('min-height', 'unset', 'important');
  });
}

function scheduleTrim(): void {
  if (trimScheduled) return;
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
  scheduleTrim();

  const root = document.documentElement;
  trimObserver = new MutationObserver(() => scheduleTrim());
  trimObserver.observe(root, { attributes: true, attributeFilter: ['style', 'class'] });

  window.addEventListener('resize', scheduleTrim);
  window.visualViewport?.addEventListener('resize', scheduleTrim);

  const bodyObserver = new MutationObserver(() => scheduleTrim());
  bodyObserver.observe(document.body, { childList: true, subtree: true });

  return () => {
    trimObserver?.disconnect();
    trimObserver = null;
    bodyObserver.disconnect();
    window.removeEventListener('resize', scheduleTrim);
    window.visualViewport?.removeEventListener('resize', scheduleTrim);
  };
}
