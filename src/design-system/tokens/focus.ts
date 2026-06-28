/** Focus ring tokens — mirror --ds-focus-* in variables.css */
export const focus = {
  ring: 'var(--ds-focus-ring)',
  offset: 'var(--ds-focus-offset)',
} as const;

export type FocusToken = keyof typeof focus;
