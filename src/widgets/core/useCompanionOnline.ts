/**
 * Tiny hook — online/offline for Companion widget headers.
 */

import { useEffect, useState } from 'react';
import { flushWidgetSyncQueue } from './WidgetSync';

export function useCompanionOnline(): boolean {
  const [online, setOnline] = useState(
    typeof navigator === 'undefined' ? true : navigator.onLine !== false,
  );

  useEffect(() => {
    const onOnline = () => {
      setOnline(true);
      void flushWidgetSyncQueue();
    };
    const onOffline = () => setOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  return online;
}
