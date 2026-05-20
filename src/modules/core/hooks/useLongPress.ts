import { useCallback, useRef, useState } from 'react';

type LongPressOptions = {
  onLongPress: () => void;
  onClick?: () => void;
  delayMs?: number;
};

export function useLongPress({ onLongPress, onClick, delayMs = 3000 }: LongPressOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const longPressTriggered = useRef(false);
  const startTimeRef = useRef(0);
  const [progress, setProgress] = useState(0);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setProgress(0);
  }, []);

  const start = useCallback(() => {
    longPressTriggered.current = false;
    startTimeRef.current = Date.now();
    setProgress(0);

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      setProgress(Math.min(1, elapsed / delayMs));
    }, 50);

    timerRef.current = setTimeout(() => {
      longPressTriggered.current = true;
      setProgress(1);
      clearTimers();
      onLongPress();
    }, delayMs);
  }, [onLongPress, delayMs, clearTimers]);

  const cancel = useCallback(() => {
    clearTimers();
  }, [clearTimers]);

  const click = useCallback(() => {
    if (!longPressTriggered.current) {
      onClick?.();
    }
  }, [onClick]);

  return {
    progress,
    isHolding: progress > 0 && progress < 1,
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: (e: React.TouchEvent) => {
      cancel();
      if (!longPressTriggered.current) {
        e.preventDefault();
        onClick?.();
      }
    },
    onClick: click,
  };
}
