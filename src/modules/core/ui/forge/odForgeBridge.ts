import { OBSIDIAN_DEPTH_THEME_ID } from '../../theme/themePackObsidianDepth';

/**
 * Fas 2 prod-wire — sätt till true efter «godkänn Forge» i Theme Lab.
 * Aktiverar `od-forge-bridge` på documentElement + OdForgeHomeShell i HomeHeroKanon.
 */
export const FORGE_PROD_WIRE_ENABLED = false;

export function isOdForgeBridgeActive(themeId: string): boolean {
  return FORGE_PROD_WIRE_ENABLED && themeId === OBSIDIAN_DEPTH_THEME_ID;
}

export function applyOdForgeBridgeClass(enabled: boolean): void {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('od-forge-bridge', enabled);
}
