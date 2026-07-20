import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const;
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

  const dismiss = () => setIsBlurred(false);

  return (
    <AnimatePresence>
      {isBlurred && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="pointer-events-auto fixed inset-0 z-[9999] bg-surface-base/30 outline-none"
          role="button"
          tabIndex={0}
          aria-label="Tryck Escape eller klicka för att fortsätta"
          onClick={dismiss}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ' || e.key === 'Tab') {
              e.preventDefault();
              dismiss();
            }
          }}
        />
      )}
    </AnimatePresence>
  );
}
