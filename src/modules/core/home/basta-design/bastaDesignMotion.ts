import { useReducedMotion } from 'framer-motion';
import type { Transition, Variants } from 'framer-motion';

const BD_EASE = [0.45, 0, 0.55, 1] as const;

export const BD_SCREEN_TRANSITION: Transition = {
  duration: 0.38,
  ease: BD_EASE,
};

export const BD_ITEM_TRANSITION: Transition = {
  duration: 0.52,
  ease: BD_EASE,
};

export const bdStaggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

export const bdStaggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: BD_ITEM_TRANSITION,
  },
};

export function useBastaDesignMotion() {
  const reduced = useReducedMotion() ?? false;

  return {
    reduced,
    screen: reduced
      ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -8 },
        },
    screenTransition: reduced ? { duration: 0 } : BD_SCREEN_TRANSITION,
    staggerContainer: reduced ? undefined : bdStaggerContainer,
    staggerItem: reduced ? undefined : bdStaggerItem,
  };
}
