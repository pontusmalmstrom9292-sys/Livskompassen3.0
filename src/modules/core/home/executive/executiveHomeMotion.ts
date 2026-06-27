import { useReducedMotion } from 'framer-motion';
import type { Transition, Variants } from 'framer-motion';

/** Executive Midnight — lugn easing, ingen bounce. */
const EXEC_HOME_EASE = [0.45, 0, 0.55, 1] as const;

export const EXEC_HOME_ITEM_TRANSITION: Transition = {
  duration: 0.52,
  ease: EXEC_HOME_EASE,
};

export const execHomeStaggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

export const execHomeStaggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: EXEC_HOME_ITEM_TRANSITION,
  },
};

export function useExecutiveHomeMotion() {
  const reduced = useReducedMotion() ?? false;

  return {
    reduced,
    staggerRoot: reduced
      ? {}
      : {
          variants: execHomeStaggerContainer,
          initial: 'hidden' as const,
          animate: 'visible' as const,
        },
    staggerChild: reduced ? {} : { variants: execHomeStaggerItem },
  };
}
