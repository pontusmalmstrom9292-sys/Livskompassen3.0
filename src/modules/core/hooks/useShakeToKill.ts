import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { executeKillSwitch } from '../security/killSwitch';

const SHAKE_THRESHOLD = 15; // m/s²
const DEBOUNCE_MS = 2000;

function magnitude(x: number, y: number, z: number): number {
  return Math.sqrt(x * x + y * y + z * z);
}

/** Shake-to-Kill: nollställ känslig state och navigera till neutral hemsida. */
export function useShakeToKill(): void {
  const navigate = useNavigate();
  const lastShake = useRef(0);

  useEffect(() => {
    const handler = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc || acc.x == null || acc.y == null || acc.z == null) return;

      const mag = magnitude(acc.x, acc.y, acc.z);
      if (mag < SHAKE_THRESHOLD) return;

      const now = Date.now();
      if (now - lastShake.current < DEBOUNCE_MS) return;
      lastShake.current = now;

      executeKillSwitch();
      navigate('/', { replace: true });
    };

    window.addEventListener('devicemotion', handler);
    return () => window.removeEventListener('devicemotion', handler);
  }, [navigate]);
}
