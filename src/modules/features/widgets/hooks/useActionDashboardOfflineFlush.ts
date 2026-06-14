import { useEffect } from 'react';
import { flushActionDashboardQueue } from '../api/actionDashboardApi';

type Options = {
  onFlushed?: (count: number) => void;
};

/** Synkar ActionDashboard-kö när enheten går online. */
export function useActionDashboardOfflineFlush(userId: string | undefined, options?: Options) {
  const onFlushed = options?.onFlushed;

  useEffect(() => {
    if (!userId) return;

    const flush = () => {
      if (!navigator.onLine) return;
      void flushActionDashboardQueue(userId).then((count) => {
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
