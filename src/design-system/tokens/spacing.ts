/** Spacing scale — 4px base rhythm. */
export const spacing = {
  0: 'var(--ds-space-0)',
  px: 'var(--ds-space-px)',
  0.5: 'var(--ds-space-0-5)',
  1: 'var(--ds-space-1)',
  1.5: 'var(--ds-space-1-5)',
  2: 'var(--ds-space-2)',
  2.5: 'var(--ds-space-2-5)',
  3: 'var(--ds-space-3)',
  3.5: 'var(--ds-space-3-5)',
  4: 'var(--ds-space-4)',
  5: 'var(--ds-space-5)',
  6: 'var(--ds-space-6)',
  7: 'var(--ds-space-7)',
  8: 'var(--ds-space-8)',
  10: 'var(--ds-space-10)',
  12: 'var(--ds-space-12)',
  16: 'var(--ds-space-16)',
  20: 'var(--ds-space-20)',
  dockClearance: 'var(--ds-space-dock-clearance)',
  touchTarget: 'var(--ds-touch-target)',
} as const;

export type SpacingToken = keyof typeof spacing;
