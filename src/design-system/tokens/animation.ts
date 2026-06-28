export const animation = {
  durationInstant: 'var(--ds-duration-instant)',
  durationFast: 'var(--ds-duration-fast)',
  durationNormal: 'var(--ds-duration-normal)',
  durationMorph: 'var(--ds-duration-morph)',
  durationSlow: 'var(--ds-duration-slow)',
  easePremium: 'var(--ds-ease-premium)',
  easeEnter: 'var(--ds-ease-enter)',
  easeExit: 'var(--ds-ease-exit)',
  easeSpring: 'var(--ds-ease-spring)',
} as const;

/** CSS transition shorthand helpers. */
export const transitions = {
  fast: `var(--ds-duration-fast) var(--ds-ease-premium)`,
  normal: `var(--ds-duration-normal) var(--ds-ease-premium)`,
  morph: `var(--ds-duration-morph) var(--ds-ease-enter)`,
  slow: `var(--ds-duration-slow) var(--ds-ease-premium)`,
} as const;

export type AnimationToken = keyof typeof animation;
