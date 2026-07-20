import { useEffect } from 'react';
import { useTheme } from '../theme';
import { getLivskompassenNative } from '@/shared/utils/nativeSecureDownload';

/** True when hex background needs light system icons (dark chrome). */
function isDarkHex(colorHex: string): boolean {
  const h = colorHex.replace('#', '').trim();
  if (h.length < 6) return true;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return true;
  return (r * 299 + g * 587 + b * 114) / 1000 < 140;
}

/**
 * LIQUID UI - Chrome Fusion.
 * Syncs the Android System Navigation Bar and Status Bar colors with the active theme.
 * Creates a seamless "Edge-to-Edge" experience where the app and OS melt together.
 */
export function useSystemChromeFusion() {
  const { themeId, themes } = useTheme();

  useEffect(() => {
    const native = getLivskompassenNative();
    if (!native?.setSystemTheme) return;

    const theme = themes.find((t) => t.id === themeId);
    if (!theme) return;

    const bgColor = theme.cssVars['--bg'] || '#0D0B09';
    const isDark = theme.background === 'obsidian' || isDarkHex(bgColor);

    // Delay slightly to ensure DOM/CSS variables are updated if needed
    const timeout = setTimeout(() => {
      native.setSystemTheme?.(bgColor, isDark);
    }, 100);

    return () => clearTimeout(timeout);
  }, [themeId, themes]);
}
