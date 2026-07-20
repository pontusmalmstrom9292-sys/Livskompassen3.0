import { useCallback, useEffect, useRef } from 'react';

/**
 * Schedules a one-shot timeout that clears on unmount / reschedule.
 * Use for ephemeral UI flashes (save notices, copy-ok, etc.).
 */
export function useFlashTimeout() {
  const timerRef = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const schedule = useCallback(
    (fn: () => void, ms: number) => {
      clear();
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        fn();
      }, ms);
    },
    [clear],
  );

  useEffect(() => () => clear(), [clear]);

  return { schedule, clear };
}
