import { useEffect } from 'react';
import { flushCaptureDraftQueue } from '../captureDraftSync';

type Options = {
  onFlushed?: (count: number) => void;
};

/** Synkar capture-utkast (pending/failed) när enheten går online + var 30:e sekund. */
export function useCaptureOfflineFlush(userId: string | undefined, options?: Options) {
  const onFlushed = options?.onFlushed;

  useEffect(() => {
    if (!userId) return;

    const flush = () => {
      if (!navigator.onLine) return;
      void flushCaptureDraftQueue().then((count) => {
        if (count > 0) onFlushed?.(count);
      });
    };

    flush();
    window.addEventListener('online', flush);
    const interval = window.setInterval(flush, 30_000);
    return () => {
      window.removeEventListener('online', flush);
      window.clearInterval(interval);
    };
  }, [userId, onFlushed]);
}
