import { useCallback, useRef } from 'react';

type LongPressOptions = {
  onLongPress: () => void;
  onClick?: () => void;
  delayMs?: number;
};

export function useLongPress({ onLongPress, onClick, delayMs = 3000 }: LongPressOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggered = useRef(false);

  const start = useCallback(() => {
    longPressTriggered.current = false;
    timerRef.current = setTimeout(() => {
      longPressTriggered.current = true;
      onLongPress();
    }, delayMs);
  }, [onLongPress, delayMs]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const click = useCallback(() => {
    if (!longPressTriggered.current) {
      onClick?.();
    }
  }, [onClick]);

  return {
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
