import { useCallback, useEffect, useRef, useState } from 'react';

export const CHAMELEON_MORPH_MS = 350;

/** Opacitet/färgskiftning vid mode-byte — shell står still (Chameleon spec). */
export function useChameleonMorph<T>(value: T) {
  const [displayed, setDisplayed] = useState(value);
  const [fading, setFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const morphTo = useCallback(
    (next: T) => {
      if (Object.is(next, displayed)) return;
      clearTimer();
      setFading(true);
      timerRef.current = setTimeout(() => {
        setDisplayed(next);
        timerRef.current = setTimeout(() => {
          setFading(false);
          timerRef.current = null;
        }, CHAMELEON_MORPH_MS);
      }, CHAMELEON_MORPH_MS / 2);
    },
    [clearTimer, displayed],
  );

  useEffect(() => {
    morphTo(value);
  }, [value, morphTo]);

  useEffect(() => clearTimer, [clearTimer]);

  return { displayed, fading, morphTo, morphMs: CHAMELEON_MORPH_MS };
}
