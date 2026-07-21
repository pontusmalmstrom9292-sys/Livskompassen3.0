/**
 * Subscribe to Companion sync queue status (no polling loops beyond events).
 */

import { useEffect, useState } from 'react';
import {
  flushWidgetSyncQueue,
  getWidgetSyncSnapshot,
  subscribeWidgetSyncStatus,
  type WidgetSyncStatus,
} from '../core/WidgetSync';

const EMPTY: WidgetSyncStatus = {
  pending: 0,
  lastFlushAt: null,
  lastError: null,
  flushing: false,
};

export function useWidgetSyncStatus(): WidgetSyncStatus & {
  retry: () => Promise<void>;
} {
  const [status, setStatus] = useState<WidgetSyncStatus>(EMPTY);

  useEffect(() => {
    let alive = true;
    void getWidgetSyncSnapshot().then((s) => {
      if (alive) setStatus(s);
    });
    return subscribeWidgetSyncStatus((next) => {
      if (alive) setStatus(next);
    });
  }, []);

  return {
    ...status,
    retry: async () => {
      await flushWidgetSyncQueue();
    },
  };
}
