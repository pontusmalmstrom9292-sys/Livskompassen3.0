/**
 * AI daglig kostnadstak — stoppar oväntade Pro-anrop vid hög förbrukning.
 * Best-effort; fail-open om Firestore-query misslyckas (blockera inte användaren helt).
 */
import * as admin from 'firebase-admin';
import { monitor } from './monitoring';

const DEFAULT_PROJECT_DAILY_USD = 3;
const DEFAULT_USER_DAILY_USD = 0.5;

function capFromEnv(envKey: string, fallback: number): number {
  const raw = process.env[envKey]?.trim();
  if (!raw) return fallback;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

async function sumDailyCostUsd(userId?: string): Promise<number> {
  const cutoff = admin.firestore.Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000);
  let q = admin
    .firestore()
    .collection('ai_cost_log')
    .where('createdAt', '>=', cutoff) as FirebaseFirestore.Query;

  if (userId) {
    q = q.where('userId', '==', userId);
  }

  const agg = await q.aggregate({ total: admin.firestore.AggregateField.sum('estimatedCostUsd') }).get();
  return (agg.data().total as number) ?? 0;
}

export interface CostCapCheckResult {
  allowed: boolean;
  reason?: string;
  projectDailyUsd?: number;
  userDailyUsd?: number;
}

/** Kontrollera daglig AI-kostnad före dyra anrop (t.ex. Pro-tier). */
export async function checkAiCostCaps(userId: string): Promise<CostCapCheckResult> {
  const projectCap = capFromEnv('AI_DAILY_COST_CAP_USD', DEFAULT_PROJECT_DAILY_USD);
  const userCap = capFromEnv('AI_DAILY_USER_COST_CAP_USD', DEFAULT_USER_DAILY_USD);

  try {
    const [projectDailyUsd, userDailyUsd] = await Promise.all([
      sumDailyCostUsd(),
      sumDailyCostUsd(userId),
    ]);

    if (projectDailyUsd >= projectCap) {
      monitor.log('WARNING', `[CostCap] Projekt dagstak nått: ${projectDailyUsd.toFixed(4)} >= ${projectCap} USD`);
      return { allowed: false, reason: 'project_daily_cap', projectDailyUsd, userDailyUsd };
    }
    if (userDailyUsd >= userCap) {
      monitor.log('WARNING', `[CostCap] Användare dagstak nått: uid=${userId} ${userDailyUsd.toFixed(4)} >= ${userCap} USD`);
      return { allowed: false, reason: 'user_daily_cap', projectDailyUsd, userDailyUsd };
    }
    return { allowed: true, projectDailyUsd, userDailyUsd };
  } catch (err) {
    monitor.trackError('costCapGuard', err, { userId });
    return { allowed: true };
  }
}
