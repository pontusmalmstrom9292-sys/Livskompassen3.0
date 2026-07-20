import { useEffect } from 'react';
import { useTheme } from '../theme';
import { getLivskompassenNative } from '@/shared/utils/nativeSecureDownload';

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
    const isDark = theme.background === 'obsidian' || theme.background === 'midnight';

    // Delay slightly to ensure DOM/CSS variables are updated if needed
    const timeout = setTimeout(() => {
      native.setSystemTheme(bgColor, isDark);
    }, 100);

    return () => clearTimeout(timeout);
  }, [themeId, themes]);
}
