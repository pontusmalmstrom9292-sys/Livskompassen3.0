/**
 * Android Capacitor bridge helpers for secure file export / download.
 * Uses window.LivskompassenNative when running inside the Titanium shell.
 */

export type LivskompassenNativeBridge = {
  downloadSecureUrl?: (url: string, fileName: string, mimeType: string) => void;
  shareBase64File?: (base64Payload: string, fileName: string, mimeType: string) => void;
  shareVaultFile?: (content: string, fileName: string, mimeType: string) => void;
  /** Resets Android SessionSentry idle timer while user is active in Valvet. */
  userInteracted?: () => void;
  /** Persist home-screen widget payload (SecurePrefs → AppWidget update). */
  setWidgetData?: (key: string, value: string) => void;
  /** Read WIS queue/draft or last_action_* for background sync (no UI). */
  getWidgetData?: (key: string) => string;
  /** Dynamic app-icon shortcut for dagens utvecklingskort. */
  updateUtvecklingskortShortcut?: (text: string) => void;
  /** AppSearch — index drawer module for Android global search. */
  indexShortcut?: (id: string, label: string, path: string) => void;
  /** Edge-to-edge: sync Android status/nav bar with app theme. */
  setSystemTheme?: (colorHex: string, isDark: boolean) => void;
};

declare global {
  interface Window {
    LivskompassenNative?: LivskompassenNativeBridge;
  }
}

export function getLivskompassenNative(): LivskompassenNativeBridge | null {
  if (typeof window === 'undefined') return null;
  return window.LivskompassenNative ?? null;
}

/**
 * Prefer native https DownloadManager / Base64 share on Android WebView.
 * Returns true if native handled the export (caller should not window.open).
 */
export function downloadViaNativeAndroid(opts: {
  downloadUrl?: string;
  pdfBase64?: string;
  fileName: string;
  mimeType?: string;
}): boolean {
  const native = getLivskompassenNative();
  if (!native) return false;

  const mime = opts.mimeType ?? 'application/pdf';
  const name = opts.fileName || 'livskompassen-export.pdf';

  if (opts.downloadUrl && native.downloadSecureUrl) {
    native.downloadSecureUrl(opts.downloadUrl, name, mime);
    return true;
  }
  if (opts.pdfBase64 && native.shareBase64File) {
    native.shareBase64File(opts.pdfBase64, name, mime);
    return true;
  }
  return false;
}
