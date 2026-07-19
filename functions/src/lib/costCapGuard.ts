/**
 * AI daglig + månatlig kostnadstak — stoppar oväntade anrop vid hög förbrukning.
 * Best-effort; fail-open om Firestore-query misslyckas (blockera inte användaren helt).
 *
 * Kanon: infra/gcp/cost-guard/manifest.json → aiCostCaps (100 SEK/mån budget).
 */
import { admin } from './firebaseAdmin';
import { monitor } from './monitoring';

/** ~2.8 SEK/dag AI — lämnar marginal för Firestore/Scheduler/Storage inom 100 SEK/mån. */
const DEFAULT_PROJECT_DAILY_USD = 0.27;
const DEFAULT_USER_DAILY_USD = 0.1;
/** ~84 SEK/mån AI-tak (8 USD). */
const DEFAULT_PROJECT_MONTHLY_USD = 8;

function capFromEnv(envKey: string, fallback: number): number {
  const raw = process.env[envKey]?.trim();
  if (!raw) return fallback;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

async function sumCostUsd(sinceMs: number, userId?: string): Promise<number> {
  const cutoff = admin.firestore.Timestamp.fromMillis(sinceMs);
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
  projectMonthlyUsd?: number;
  userDailyUsd?: number;
}

/** Kontrollera daglig + månatlig AI-kostnad före Gemini-anrop. */
export async function checkAiCostCaps(userId: string): Promise<CostCapCheckResult> {
  const projectDailyCap = capFromEnv('AI_DAILY_COST_CAP_USD', DEFAULT_PROJECT_DAILY_USD);
  const userDailyCap = capFromEnv('AI_DAILY_USER_COST_CAP_USD', DEFAULT_USER_DAILY_USD);
  const projectMonthlyCap = capFromEnv('AI_MONTHLY_COST_CAP_USD', DEFAULT_PROJECT_MONTHLY_USD);

  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  try {
    const [projectDailyUsd, projectMonthlyUsd, userDailyUsd] = await Promise.all([
      sumCostUsd(dayAgo),
      sumCostUsd(monthAgo),
      sumCostUsd(dayAgo, userId),
    ]);

    if (projectMonthlyUsd >= projectMonthlyCap) {
      monitor.log(
        'WARNING',
        `[CostCap] Projekt månadstak nått: ${projectMonthlyUsd.toFixed(4)} >= ${projectMonthlyCap} USD`,
      );
      return {
        allowed: false,
        reason: 'project_monthly_cap',
        projectDailyUsd,
        projectMonthlyUsd,
        userDailyUsd,
      };
    }
    if (projectDailyUsd >= projectDailyCap) {
      monitor.log(
        'WARNING',
        `[CostCap] Projekt dagstak nått: ${projectDailyUsd.toFixed(4)} >= ${projectDailyCap} USD`,
      );
      return {
        allowed: false,
        reason: 'project_daily_cap',
        projectDailyUsd,
        projectMonthlyUsd,
        userDailyUsd,
      };
    }
    if (userDailyUsd >= userDailyCap) {
      monitor.log(
        'WARNING',
        `[CostCap] Användare dagstak nått: uid=${userId} ${userDailyUsd.toFixed(4)} >= ${userDailyCap} USD`,
      );
      return {
        allowed: false,
        reason: 'user_daily_cap',
        projectDailyUsd,
        projectMonthlyUsd,
        userDailyUsd,
      };
    }
    return { allowed: true, projectDailyUsd, projectMonthlyUsd, userDailyUsd };
  } catch (err) {
    monitor.trackError('costCapGuard', err, { userId });
    return { allowed: true };
  }
}
