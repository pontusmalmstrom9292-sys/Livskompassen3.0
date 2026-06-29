/** Typography tokens — Executive Midnight prod pair: Cormorant display + Inter body. */
export const typography = {
  fontDisplay: 'var(--ds-font-display)',
  fontBody: 'var(--ds-font-body)',
  fontChrome: 'var(--ds-font-chrome)',
  fontMono: 'var(--ds-font-mono)',
  size2xs: 'var(--ds-font-size-2xs)',
  sizeXs: 'var(--ds-font-size-xs)',
  sizeSm: 'var(--ds-font-size-sm)',
  sizeMd: 'var(--ds-font-size-md)',
  sizeLg: 'var(--ds-font-size-lg)',
  sizeXl: 'var(--ds-font-size-xl)',
  size2xl: 'var(--ds-font-size-2xl)',
  size3xl: 'var(--ds-font-size-3xl)',
  lineTight: 'var(--ds-line-height-tight)',
  lineSnug: 'var(--ds-line-height-snug)',
  lineNormal: 'var(--ds-line-height-normal)',
  lineRelaxed: 'var(--ds-line-height-relaxed)',
  trackingTight: 'var(--ds-letter-spacing-tight)',
  trackingNormal: 'var(--ds-letter-spacing-normal)',
  trackingWide: 'var(--ds-letter-spacing-wide)',
  trackingWider: 'var(--ds-letter-spacing-wider)',
  trackingWidest: 'var(--ds-letter-spacing-widest)',
  weightRegular: 'var(--ds-font-weight-regular)',
  weightMedium: 'var(--ds-font-weight-medium)',
  weightSemibold: 'var(--ds-font-weight-semibold)',
  weightBold: 'var(--ds-font-weight-bold)',
} as const;

/** Tailwind class presets for common text roles. */
export const textStyles = {
  eyebrow:
    'text-[length:var(--ds-font-size-2xs)] uppercase tracking-[var(--ds-letter-spacing-widest)] text-text-dim',
  titleHub:
    'font-[family-name:var(--ds-font-display)] text-[length:var(--ds-font-size-xl)] font-light text-accent',
  titleSection:
    'font-[family-name:var(--ds-font-display)] text-[length:var(--ds-font-size-sm)] font-semibold text-accent',
  body: 'text-[length:var(--ds-font-size-sm)] text-text',
  label:
    'text-[length:var(--ds-font-size-xs)] uppercase tracking-[var(--ds-letter-spacing-wide)] text-text-dim',
  chromeTitle:
    'font-[family-name:var(--ds-font-chrome)] tracking-[var(--ds-letter-spacing-wider)] uppercase text-accent',
} as const;

export type TypographyToken = keyof typeof typography;
export type TextStyleKey = keyof typeof textStyles;
