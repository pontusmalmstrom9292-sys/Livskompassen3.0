import { useEffect, useState } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { OBSIDIAN_DEPTH_THEME_ID } from '../theme/themePackObsidianDepth';
import { REDESIGN_A_THEME_ID } from '../theme/themePackRedesignA';
import { resolveThemeId } from '../theme/themeRegistry';
import { THEME_APPLIED_EVENT } from '../theme/themeEvents';

export const HEADER_PANEL_STYLES = ['ember', 'obsidian', 'aurora'] as const;

export type HeaderPanelStyle = (typeof HEADER_PANEL_STYLES)[number];

export { THEME_APPLIED_EVENT } from '../theme/themeEvents';

export function resolveHeaderPanelStyleFromTheme(themeId: string): HeaderPanelStyle {
  const id = resolveThemeId(themeId);
  if (id === REDESIGN_A_THEME_ID || id === OBSIDIAN_DEPTH_THEME_ID) {
    return 'obsidian';
  }
  const v = import.meta.env.VITE_HEADER_PANEL_STYLE;
  if (typeof v === 'string' && HEADER_PANEL_STYLES.includes(v as HeaderPanelStyle)) {
    return v as HeaderPanelStyle;
  }
  return 'ember';
}

/** React-hook — följer themeId + applyTheme (även Theme Lab preview). */
export function useHeaderPanelStyle(): HeaderPanelStyle {
  const { themeId } = useTheme();
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const onThemeApplied = () => setRevision((n) => n + 1);
    window.addEventListener(THEME_APPLIED_EVENT, onThemeApplied);
    return () => window.removeEventListener(THEME_APPLIED_EVENT, onThemeApplied);
  }, []);

  void revision;

  const domTheme =
    typeof document !== 'undefined' ? document.documentElement.dataset.theme : undefined;
  return resolveHeaderPanelStyleFromTheme(domTheme ?? themeId);
}

/** @deprecated Använd useHeaderPanelStyle i React-komponenter. */
export function resolveHeaderPanelStyle(): HeaderPanelStyle {
  if (typeof document !== 'undefined') {
    const activeTheme = document.documentElement.dataset.theme;
    if (activeTheme) {
      return resolveHeaderPanelStyleFromTheme(activeTheme);
    }
  }
  return resolveHeaderPanelStyleFromTheme('');
}
