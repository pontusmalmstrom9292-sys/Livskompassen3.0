import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/** Any of these clears the privacy blur — must include wheel/touchmove so scroll never feels "stuck". */
const ACTIVITY_EVENTS = [
  'pointerdown',
  'keydown',
  'touchstart',
  'touchmove',
  'scroll',
  'wheel',
] as const;
const BLUR_IDLE_MS = 30 * 1000; // 30 seconds for stealth blur

export function InactivityBlurOverlay() {
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    let timer: number;

    const reset = () => {
      setIsBlurred(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setIsBlurred(true), BLUR_IDLE_MS);
    };

    reset();

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, reset, { passive: true });
    }

    return () => {
      window.clearTimeout(timer);
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, reset);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isBlurred && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          /* Visual-only: never capture hits — scroll/tap must reach the page (window listeners clear blur). */
          className="pointer-events-none fixed inset-0 z-[9999] bg-surface-base/30"
          aria-hidden
        />
      )}
    </AnimatePresence>
  );
}
