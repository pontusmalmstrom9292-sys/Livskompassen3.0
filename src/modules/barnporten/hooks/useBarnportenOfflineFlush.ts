import { useEffect } from 'react';
import { flushBarnportenOfflineQueue } from '../api/saveBarnportenLog';

/** Synkar barnporten-kö när enheten går online. */
export function useBarnportenOfflineFlush(userId: string | undefined) {
  useEffect(() => {
    if (!userId) return;

    const flush = () => {
      if (!navigator.onLine) return;
      void flushBarnportenOfflineQueue(userId);
    };

    flush();
    window.addEventListener('online', flush);
    return () => window.removeEventListener('online', flush);
  }, [userId]);
}
