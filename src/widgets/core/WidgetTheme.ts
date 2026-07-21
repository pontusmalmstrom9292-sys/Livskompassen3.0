/**
 * WidgetTheme — Companion OS design tokens (WIDGET_BIBLE Kapitel 6).
 * Single source for Obsidian, Premium Gold, Ethereal Blue, glass depth.
 * UX Law 07 / 14 / 15: quiet, premium, consistent — no neon, no decoration noise.
 */

export const WIDGET_THEME_VERSION = '1.1.0' as const;

/** Kapitel 6.1 — The Palette of Calm */
export const WidgetPalette = {
  /** Obsidian Midnight — primary deep surface (.cursorrules + bible) */
  obsidian: '#0D0B09',
  /** Deep Space Blue — infinite calm backdrop */
  deepSpaceBlue: '#020617',
  /** Premium Gold — muted metallic accent (frames, icons, primary CTA) */
  premiumGold: '#d4af37',
  /** Alchemical Gold — soft highlight / heading glow (never primary fill alone) */
  premiumGoldLight: '#FDE68A',
  /** Dim gold — secondary labels, inactive icons */
  premiumGoldDim: '#9a7b2f',
  /** Ethereal Blue — ONLY for living activity (waveform, capacity, breath) */
  etherealBlue: '#7BA3C9',
  /** Muted text — secondary copy, high readability / low eye strain */
  mutedText: '#94a3b8',
  /** Primary readable text */
  textPrimary: '#f8fafc',
  /** Dimmer body */
  textDim: '#64748b',
} as const;

export type WidgetPaletteKey = keyof typeof WidgetPalette;

/** Kapitel 6.2 — Safirglas material & depth */
export const WidgetMaterial = {
  /** Frosted dark sapphire glass fill */
  glassFill: 'rgba(5, 11, 20, 0.9)',
  glassFillStrong: 'rgba(2, 6, 23, 0.96)',
  glassBlurPx: 22,
  /** 1px golden border */
  goldBorder: 'rgba(212, 175, 55, 0.48)',
  goldBorderSoft: 'rgba(212, 175, 55, 0.26)',
  /** Soft bloom — dark-blue outer glow (not hard black shadow) */
  softBloom:
    '0 0 32px rgba(2, 6, 23, 0.78), 0 14px 36px rgba(2, 6, 23, 0.58), 0 0 1px rgba(212, 175, 55, 0.2)',
  /** Inset well for protected input / capacity wells */
  insetShadow:
    'inset 0 2px 10px rgba(0, 0, 0, 0.62), inset 0 1px 0 rgba(212, 175, 55, 0.08)',
  /** Subtle top lip reflection */
  glassLip: 'inset 0 1px 0 rgba(212, 175, 55, 0.18)',
  /** Matt metall alternate */
  matteMetalFill: 'rgba(18, 22, 32, 0.94)',
} as const;

/** UX Law 05 — touch targets */
export const WidgetTouch = {
  minDp: 56,
  premiumMinDp: 64,
  premiumMaxDp: 72,
} as const;

/** Kapitel 6.3 — typography */
export const WidgetType = {
  headingTrackingEm: 0.18,
  headingTransform: 'uppercase' as const,
  /** Mockup elevation — ~28px soft glass corners */
  radiusCardPx: 28,
  radiusPillPx: 9999,
  radiusWellPx: 16,
} as const;

/** CSS custom property names — apply once at shell root */
export const WidgetCssVars = {
  '--cw-obsidian': WidgetPalette.obsidian,
  '--cw-deep-space': WidgetPalette.deepSpaceBlue,
  '--cw-gold': WidgetPalette.premiumGold,
  '--cw-gold-light': WidgetPalette.premiumGoldLight,
  '--cw-gold-dim': WidgetPalette.premiumGoldDim,
  '--cw-ethereal': WidgetPalette.etherealBlue,
  '--cw-muted': WidgetPalette.mutedText,
  '--cw-text': WidgetPalette.textPrimary,
  '--cw-text-dim': WidgetPalette.textDim,
  '--cw-glass': WidgetMaterial.glassFill,
  '--cw-glass-strong': WidgetMaterial.glassFillStrong,
  '--cw-glass-blur': `${WidgetMaterial.glassBlurPx}px`,
  '--cw-gold-border': WidgetMaterial.goldBorder,
  '--cw-gold-border-soft': WidgetMaterial.goldBorderSoft,
  '--cw-bloom': WidgetMaterial.softBloom,
  '--cw-inset': WidgetMaterial.insetShadow,
  '--cw-lip': WidgetMaterial.glassLip,
  '--cw-touch-min': `${WidgetTouch.minDp}px`,
  '--cw-touch-premium': `${WidgetTouch.premiumMinDp}px`,
  '--cw-radius-card': `${WidgetType.radiusCardPx}px`,
  '--cw-heading-tracking': `${WidgetType.headingTrackingEm}em`,
} as const;

export type WidgetCssVarMap = typeof WidgetCssVars;

/**
 * Apply Companion Widget tokens to an element (typically the widget shell root).
 * Idempotent — safe to call on remount.
 */
export function applyWidgetTheme(target: HTMLElement | null | undefined): void {
  if (!target) return;
  const style = target.style;
  for (const [key, value] of Object.entries(WidgetCssVars)) {
    style.setProperty(key, value);
  }
  target.dataset.cwTheme = WIDGET_THEME_VERSION;
}

/** Card surface style object for non-CSS consumers (canvas / native bridges). */
export function getSapphireCardSurface(): Readonly<{
  background: string;
  border: string;
  boxShadow: string;
  borderRadius: number;
  backdropFilter: string;
}> {
  return {
    background: WidgetMaterial.glassFill,
    border: `1px solid ${WidgetMaterial.goldBorder}`,
    boxShadow: `${WidgetMaterial.softBloom}, ${WidgetMaterial.glassLip}`,
    borderRadius: WidgetType.radiusCardPx,
    backdropFilter: `blur(${WidgetMaterial.glassBlurPx}px)`,
  };
}

export function isQuietAccent(hex: string): boolean {
  const normalized = hex.trim().toLowerCase();
  return (
    normalized === WidgetPalette.premiumGold.toLowerCase() ||
    normalized === WidgetPalette.premiumGoldLight.toLowerCase() ||
    normalized === WidgetPalette.premiumGoldDim.toLowerCase() ||
    normalized === WidgetPalette.etherealBlue.toLowerCase()
  );
}
