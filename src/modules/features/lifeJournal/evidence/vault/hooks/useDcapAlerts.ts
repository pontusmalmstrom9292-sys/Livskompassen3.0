import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, limit } from 'firebase/firestore';
import { db } from '@/core/firebase/firestore';

export type DcapAlertRow = {
  id: string;
  riskScore: number;
  recommendedAction: string;
  status: string;
  createdAt?: { toDate?: () => Date };
};

/** P1.4 — Valv PIN-gated DCAP HITL review list. */
export function useDcapAlerts(userId: string | undefined) {
  const [alerts, setAlerts] = useState<DcapAlertRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setAlerts([]);
      setLoading(false);
      return;
    }

    const ref = collection(db, 'dcap_alerts');
    const q = query(ref, where('ownerId', '==', userId), limit(30));

    const unsub = onSnapshot(
      q,
      (snap) => {
        setAlerts(
          snap.docs
            .map((docSnap) => {
              const data = docSnap.data();
              return {
                id: docSnap.id,
                riskScore: typeof data.riskScore === 'number' ? data.riskScore : 0,
                recommendedAction: String(data.recommendedAction ?? ''),
                status: String(data.status ?? ''),
                createdAt: data.createdAt,
              };
            })
            .filter((row) => row.status === 'pending_human_review'),
        );
        setLoading(false);
      },
      () => setLoading(false),
    );

    return () => unsub();
  }, [userId]);

  return { alerts, loading };
}
