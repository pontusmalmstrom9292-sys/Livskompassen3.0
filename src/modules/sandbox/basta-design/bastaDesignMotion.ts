import type { Transition } from 'framer-motion';
import {
  EXEC_HOME_ITEM_TRANSITION,
  execHomeStaggerContainer,
  execHomeStaggerItem,
  useExecutiveHomeMotion,
} from '@/core/home/executive/executiveHomeMotion';

const BD_EASE = [0.45, 0, 0.55, 1] as const;

export const BD_SCREEN_TRANSITION: Transition = {
  duration: 0.38,
  ease: BD_EASE,
};

export const BD_ITEM_TRANSITION = EXEC_HOME_ITEM_TRANSITION;
export const bdStaggerContainer = execHomeStaggerContainer;
export const bdStaggerItem = execHomeStaggerItem;

/** Sandbox-flikbyte + stagger — samma timing som prod Hem. */
export function useBastaDesignMotion() {
  const { reduced, staggerRoot, staggerChild } = useExecutiveHomeMotion();

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
    instant: reduced
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: BD_ITEM_TRANSITION },
    staggerRoot,
    staggerChild,
  };
}
