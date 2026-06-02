/**
 * Runtime typography scale — canonical: docs/design/TYPE-SCALE.md
 */
export const typeScale = {
  eyebrow: 'text-[10px] uppercase tracking-[0.24em] text-text-dim',
  titleHub: 'font-display-serif text-xl font-light text-accent',
  leadHub: 'text-sm leading-relaxed text-text-muted',
  titleSection: 'font-display-serif text-sm font-semibold text-accent',
  body: 'text-sm text-text',
  label: 'text-xs uppercase tracking-widest text-text-dim',
} as const;

export type TypeScaleKey = keyof typeof typeScale;

/** Hub header block (eyebrow + title + lead) — maps to home-page__* BEM aliases. */
export function hubHeaderClasses(): {
  eyebrow: string;
  title: string;
  lead: string;
} {
  return {
    eyebrow: `home-page__eyebrow ${typeScale.eyebrow}`,
    title: `home-page__title ${typeScale.titleHub}`,
    lead: `home-page__lead ${typeScale.leadHub}`,
  };
}

/** In-hub section label (same eyebrow token as hub header). */
export const sectionEyebrowClass = `home-page__eyebrow ${typeScale.eyebrow}`;
