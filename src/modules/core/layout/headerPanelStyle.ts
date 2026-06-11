import { REDESIGN_A_THEME_ID } from '../theme/themePackRedesignA';

export const HEADER_PANEL_STYLES = ['ember', 'obsidian', 'aurora'] as const;

export type HeaderPanelStyle = (typeof HEADER_PANEL_STYLES)[number];

/** Samma panelstil som `AppHeaderBar` — dock följer header. */
export function resolveHeaderPanelStyle(): HeaderPanelStyle {
  if (typeof document !== 'undefined') {
    if (document.documentElement.dataset.theme === REDESIGN_A_THEME_ID) {
      return 'obsidian';
    }
    if (document.documentElement.dataset.panelStyle === 'obsidian') {
      return 'obsidian';
    }
  }
  const v = import.meta.env.VITE_HEADER_PANEL_STYLE;
  if (typeof v === 'string' && HEADER_PANEL_STYLES.includes(v as HeaderPanelStyle)) {
    return v as HeaderPanelStyle;
  }
  return 'ember';
}
