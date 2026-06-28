/** Framer Motion presets aligned with --ds-duration-* and --ds-ease-* tokens. */
export const dsEasePremium = [0.45, 0, 0.55, 1] as const;
export const dsEaseEnter = [0.16, 1, 0.3, 1] as const;

export const dsMotionDuration = {
  fast: 0.15,
  normal: 0.25,
  morph: 0.35,
  slow: 0.52,
} as const;

export const dsStaggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
} as const;

export const dsFadeUpItem = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: dsMotionDuration.normal, ease: dsEasePremium },
  },
} as const;

export const dsPanelIn = {
  hidden: { opacity: 0, y: 8, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: dsMotionDuration.normal, ease: dsEaseEnter },
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.985,
    transition: { duration: dsMotionDuration.fast, ease: dsEasePremium },
  },
} as const;
