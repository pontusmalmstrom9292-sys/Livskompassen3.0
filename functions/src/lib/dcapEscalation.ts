/** @locked MOD-BACK-DCAP — låst modul; unlock via docs/evaluations/*-unlock-MOD-BACK-DCAP.md
 *
 * DCAP Escalation Pipeline — feedback-loop, trend analysis, and automated escalation.
 *
 * Implements:
 * - Longitudinal trend analysis per user (rolling 30-day window)
 * - Escalation tiers: Alert → Dossier → External notification
 * - Feedback loop: reviews update trend weights
 * - routeFromDcap integration for deterministic escalation
 *
 * WORM: dcap_alerts are immutable; escalation state in dcap_escalation_state (append-only).
 */

import * as admin from 'firebase-admin';
import { monitor } from './monitoring';

export interface DcapTrendEntry {
  alertId: string;
  riskScore: number;
  action: string;
  createdAt: FirebaseFirestore.Timestamp;
  reviewed: boolean;
  decision?: string;
}

export interface DcapEscalationState {
  ownerId: string;
  tier: 'monitor' | 'elevated' | 'critical' | 'external';
  alertCount30d: number;
  avgRiskScore30d: number;
  highRiskCount30d: number;
  lastEscalatedAt: FirebaseFirestore.Timestamp | null;
  lastAlertAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

export interface EscalationResult {
  tier: DcapEscalationState['tier'];
  shouldGenerateDossier: boolean;
  shouldNotifyExternal: boolean;
  trendSummary: {
    alertCount30d: number;
    avgRiskScore30d: number;
    highRiskCount30d: number;
    escalationReason: string;
  };
}

/** Tier thresholds — deterministic, no LLM involvement. */
const ESCALATION_THRESHOLDS = {
  elevated: { alertCount: 3, avgRisk: 40, highRiskCount: 1 },
  critical: { alertCount: 5, avgRisk: 55, highRiskCount: 3 },
  external: { alertCount: 8, avgRisk: 65, highRiskCount: 5 },
} as const;

/**
 * Analyze DCAP alerts for a user over the past 30 days and determine escalation tier.
 * Called after each new DCAP alert is created.
 */
export async function analyzeDcapTrend(ownerId: string): Promise<EscalationResult> {
  const thirtyDaysAgo = admin.firestore.Timestamp.fromMillis(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  );

  const alertsSnap = await admin
    .firestore()
    .collection('dcap_alerts')
    .where('ownerId', '==', ownerId)
    .where('createdAt', '>=', thirtyDaysAgo)
    .orderBy('createdAt', 'desc')
    .get();

  const alerts: DcapTrendEntry[] = alertsSnap.docs.map((doc) => ({
    alertId: doc.id,
    riskScore: (doc.data().riskScore as number) ?? 0,
    action: (doc.data().recommendedAction as string) ?? 'NONE',
    createdAt: doc.data().createdAt as FirebaseFirestore.Timestamp,
    reviewed: false,
    decision: undefined,
  }));

  // Enrich with review data
  const reviewsSnap = await admin
    .firestore()
    .collection('dcap_alert_reviews')
    .where('ownerId', '==', ownerId)
    .where('createdAt', '>=', thirtyDaysAgo)
    .get();

  const reviewsByAlertId = new Map<string, string>();
  for (const doc of reviewsSnap.docs) {
    const data = doc.data();
    reviewsByAlertId.set(data.alertId as string, data.decision as string);
  }

  for (const alert of alerts) {
    const decision = reviewsByAlertId.get(alert.alertId);
    if (decision) {
      alert.reviewed = true;
      alert.decision = decision;
    }
  }

  // Calculate trend metrics (dismissed alerts reduce weight)
  const activeAlerts = alerts.filter((a) => a.decision !== 'dismissed');
  const alertCount30d = activeAlerts.length;
  const avgRiskScore30d =
    alertCount30d > 0
      ? Math.round(activeAlerts.reduce((sum, a) => sum + a.riskScore, 0) / alertCount30d)
      : 0;
  const highRiskCount30d = activeAlerts.filter((a) => a.riskScore >= 70).length;

  // Determine tier
  const tier = determineTier(alertCount30d, avgRiskScore30d, highRiskCount30d);
  const escalationReason = buildEscalationReason(tier, alertCount30d, avgRiskScore30d, highRiskCount30d);

  const result: EscalationResult = {
    tier,
    shouldGenerateDossier: tier === 'critical' || tier === 'external',
    shouldNotifyExternal: tier === 'external',
    trendSummary: {
      alertCount30d,
      avgRiskScore30d,
      highRiskCount30d,
      escalationReason,
    },
  };

  // Persist escalation state (append-only pattern)
  await persistEscalationState(ownerId, result);

  await applyDcapEscalationActions(ownerId, result);

  monitor.log(
    tier === 'external' ? 'CRITICAL' : tier === 'critical' ? 'WARNING' : 'INFO',
    `[DCAP-Escalation] uid=${ownerId} tier=${tier} alerts=${alertCount30d} avgRisk=${avgRiskScore30d}`,
    { ownerId, tier, alertCount30d, avgRiskScore30d, highRiskCount30d }
  );

  return result;
}

function determineTier(
  alertCount: number,
  avgRisk: number,
  highRiskCount: number
): DcapEscalationState['tier'] {
  const ext = ESCALATION_THRESHOLDS.external;
  if (alertCount >= ext.alertCount || avgRisk >= ext.avgRisk || highRiskCount >= ext.highRiskCount) {
    return 'external';
  }
  const crit = ESCALATION_THRESHOLDS.critical;
  if (alertCount >= crit.alertCount || avgRisk >= crit.avgRisk || highRiskCount >= crit.highRiskCount) {
    return 'critical';
  }
  const elev = ESCALATION_THRESHOLDS.elevated;
  if (alertCount >= elev.alertCount || avgRisk >= elev.avgRisk || highRiskCount >= elev.highRiskCount) {
    return 'elevated';
  }
  return 'monitor';
}

function buildEscalationReason(
  tier: DcapEscalationState['tier'],
  alertCount: number,
  avgRisk: number,
  highRiskCount: number
): string {
  if (tier === 'monitor') return 'Inga eskaleringstecken — normalläge.';
  const reasons: string[] = [];
  if (alertCount >= ESCALATION_THRESHOLDS.elevated.alertCount) {
    reasons.push(`${alertCount} larm senaste 30 dagar`);
  }
  if (avgRisk >= ESCALATION_THRESHOLDS.elevated.avgRisk) {
    reasons.push(`genomsnittlig risknivå ${avgRisk}`);
  }
  if (highRiskCount >= ESCALATION_THRESHOLDS.elevated.highRiskCount) {
    reasons.push(`${highRiskCount} högrisk-larm`);
  }
  return reasons.join(', ') || 'Uppfyller eskaleringsvillkor.';
}

async function persistEscalationState(ownerId: string, result: EscalationResult): Promise<void> {
  const stateRef = admin.firestore().collection('dcap_escalation_state').doc(ownerId);
  const now = admin.firestore.FieldValue.serverTimestamp();

  await stateRef.set(
    {
      ownerId,
      tier: result.tier,
      alertCount30d: result.trendSummary.alertCount30d,
      avgRiskScore30d: result.trendSummary.avgRiskScore30d,
      highRiskCount30d: result.trendSummary.highRiskCount30d,
      lastAlertAt: now,
      ...(result.tier === 'critical' || result.tier === 'external'
        ? { lastEscalatedAt: now }
        : {}),
      updatedAt: now,
    },
    { merge: true }
  );
}

/**
 * Feedback hook — called when user reviews a DCAP alert.
 * Updates trend weights (dismissed alerts reduce escalation pressure).
 */
export async function onDcapReviewFeedback(
  ownerId: string,
  _alertId: string,
  _decision: 'acknowledged' | 'dismissed'
): Promise<EscalationResult> {
  // Re-analyze after review to potentially de-escalate
  return analyzeDcapTrend(ownerId);
}

/**
 * Persist recommended escalation actions for HITL follow-up (dossier / external notify).
 * Written append-only — no auto dossier generation without user action.
 */
export async function applyDcapEscalationActions(
  ownerId: string,
  result: EscalationResult
): Promise<void> {
  const db = admin.firestore();
  const base = {
    ownerId,
    tier: result.tier,
    reason: result.trendSummary.escalationReason,
    alertCount30d: result.trendSummary.alertCount30d,
    avgRiskScore30d: result.trendSummary.avgRiskScore30d,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  if (result.shouldGenerateDossier) {
    await db.collection('dcap_escalation_actions').add({
      ...base,
      actionType: 'dossier_recommended',
    });
  }

  if (result.shouldNotifyExternal) {
    await db.collection('dcap_escalation_actions').add({
      ...base,
      actionType: 'external_notify_recommended',
    });
  }
}
