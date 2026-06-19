import { useCallback, useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, limit } from 'firebase/firestore';
import { db } from '@/core/firebase/firestore';

export type DcapAlertRow = {
  id: string;
  riskScore: number;
  recommendedAction: string;
  status: string;
  createdAt?: { toDate?: () => Date };
};

type UseDcapAlertsOptions = {
  /** Valv PIN-gated — ingen lyssning utan upplåst session. */
  enabled?: boolean;
};

/** P1.4 — Valv PIN-gated DCAP HITL review list (exkluderar redan granskade). */
export function useDcapAlerts(userId: string | undefined, options: UseDcapAlertsOptions = {}) {
  const { enabled = true } = options;
  const [alerts, setAlerts] = useState<DcapAlertRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewedAlertIds, setReviewedAlertIds] = useState<Set<string>>(() => new Set());

  const recomputePending = useCallback(
    (rawAlerts: DcapAlertRow[], reviewed: Set<string>) =>
      rawAlerts.filter(
        (row) => row.status === 'pending_human_review' && !reviewed.has(row.id),
      ),
    [],
  );

  useEffect(() => {
    if (!userId || !enabled) {
      setAlerts([]);
      setReviewedAlertIds(new Set());
      setLoading(false);
      return;
    }

    setLoading(true);
    let rawAlerts: DcapAlertRow[] = [];
    let reviewed = new Set<string>();

    const alertsQuery = query(
      collection(db, 'dcap_alerts'),
      where('ownerId', '==', userId),
      limit(30),
    );
    const reviewsQuery = query(
      collection(db, 'dcap_alert_reviews'),
      where('ownerId', '==', userId),
      limit(60),
    );

    const sync = () => {
      setAlerts(recomputePending(rawAlerts, reviewed));
      setLoading(false);
    };

    const unsubAlerts = onSnapshot(
      alertsQuery,
      (snap) => {
        rawAlerts = snap.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            riskScore: typeof data.riskScore === 'number' ? data.riskScore : 0,
            recommendedAction: String(data.recommendedAction ?? ''),
            status: String(data.status ?? ''),
            createdAt: data.createdAt,
          };
        });
        sync();
      },
      () => {
        rawAlerts = [];
        sync();
      },
    );

    const unsubReviews = onSnapshot(
      reviewsQuery,
      (snap) => {
        reviewed = new Set(
          snap.docs
            .map((docSnap) => docSnap.data().alertId)
            .filter((id): id is string => typeof id === 'string' && id.length > 0),
        );
        setReviewedAlertIds(reviewed);
        sync();
      },
      () => {
        reviewed = new Set();
        sync();
      },
    );

    return () => {
      unsubAlerts();
      unsubReviews();
    };
  }, [userId, enabled, recomputePending]);

  return { alerts, loading, reviewedAlertIds };
}
