import { useEffect, useState } from 'react';
import { subscribeWeaverPendingForUser } from '../api/weaverApprovalService';

/** Read-only antal väntande Vävaren-förslag (drawer-badge m.m.). */
export function useWeaverPendingCount(userId: string | undefined): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      setCount(0);
      return;
    }
    return subscribeWeaverPendingForUser(userId, (rows) => setCount(rows.length));
  }, [userId]);

  return count;
}
