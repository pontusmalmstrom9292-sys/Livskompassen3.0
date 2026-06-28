/** Z-index scale — mirror --ds-z-* in variables.css */
export const zIndex = {
  base: 'var(--ds-z-base)',
  raised: 'var(--ds-z-raised)',
  header: 'var(--ds-z-header)',
  dock: 'var(--ds-z-dock)',
  overlay: 'var(--ds-z-overlay)',
  modal: 'var(--ds-z-modal)',
  toast: 'var(--ds-z-toast)',
} as const;

export type ZIndexToken = keyof typeof zIndex;
