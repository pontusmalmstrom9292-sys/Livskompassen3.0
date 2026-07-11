import {
  markAndroidShellHtml,
  watchAndroidDockInsetFix,
} from './androidDockInsetFix';

/**
 * Native shell hooks — Capacitor WebView safe-area / dock trim.
 */
export function initCapacitorShellChrome(): void {
  markAndroidShellHtml();
  watchAndroidDockInsetFix();
}
