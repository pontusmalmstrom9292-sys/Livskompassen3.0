export const elevation = {
  0: 'var(--ds-elevation-0)',
  1: 'var(--ds-elevation-1)',
  2: 'var(--ds-elevation-2)',
  3: 'var(--ds-elevation-3)',
  4: 'var(--ds-elevation-4)',
  card: 'var(--ds-elevation-card)',
  cardHover: 'var(--ds-elevation-card-hover)',
  wallet: 'var(--ds-elevation-wallet)',
  dock: 'var(--ds-elevation-dock)',
} as const;

export type ElevationToken = keyof typeof elevation;
