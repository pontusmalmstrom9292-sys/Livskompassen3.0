/**
 * AI Cost Tracker — per-call token usage and cost logging.
 *
 * Tracks Vertex AI / Gemini token usage per user, per model, per function.
 * Aggregates into Firestore for dashboard reporting.
 * Integrates with Cloud Monitoring structured logs.
 */

import * as admin from 'firebase-admin';
import { monitor } from './monitoring';

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  model: string;
  functionName: string;
  userId: string;
}

export interface CostEntry {
  userId: string;
  model: string;
  functionName: string;
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
  createdAt: FirebaseFirestore.Timestamp;
}

/** Approximate cost per 1M tokens (as of 2025, Gemini 1.5 Pro). */
const COST_PER_1M_TOKENS: Record<string, { input: number; output: number }> = {
  'gemini-1.5-pro': { input: 3.50, output: 10.50 },
  'gemini-1.5-flash': { input: 0.075, output: 0.30 },
  'gemini-2.0-flash': { input: 0.10, output: 0.40 },
  'text-embedding-004': { input: 0.025, output: 0 },
  default: { input: 1.00, output: 3.00 },
};

function estimateCost(usage: TokenUsage): number {
  const rates = COST_PER_1M_TOKENS[usage.model] ?? COST_PER_1M_TOKENS['default'];
  const inputCost = (usage.inputTokens / 1_000_000) * rates.input;
  const outputCost = (usage.outputTokens / 1_000_000) * rates.output;
  return Math.round((inputCost + outputCost) * 1_000_000) / 1_000_000;
}

/**
 * Record token usage for a single AI call.
 * Logs to structured logging and persists to Firestore for aggregation.
 */
export async function trackTokenUsage(usage: TokenUsage): Promise<void> {
  const cost = estimateCost(usage);
  const totalTokens = usage.inputTokens + usage.outputTokens;

  monitor.trackVertexQuota(totalTokens, usage.model, {
    functionName: usage.functionName,
    userId: usage.userId,
    inputTokens: usage.inputTokens,
    outputTokens: usage.outputTokens,
    estimatedCostUsd: cost,
  });

  // Persist to Firestore for dashboard aggregation
  try {
    await admin.firestore().collection('ai_cost_log').add({
      userId: usage.userId,
      model: usage.model,
      functionName: usage.functionName,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      estimatedCostUsd: cost,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (err) {
    // Best-effort — don't fail the main operation
    monitor.trackError('costTracker', err, { userId: usage.userId });
  }
}

/**
 * Get aggregated cost summary for a user (last N days).
 */
export async function getUserCostSummary(
  userId: string,
  days: number = 30
): Promise<{
  totalCostUsd: number;
  totalTokens: number;
  callCount: number;
  byModel: Record<string, { tokens: number; cost: number; calls: number }>;
}> {
  const cutoff = admin.firestore.Timestamp.fromMillis(
    Date.now() - days * 24 * 60 * 60 * 1000
  );

  const snap = await admin
    .firestore()
    .collection('ai_cost_log')
    .where('userId', '==', userId)
    .where('createdAt', '>=', cutoff)
    .get();

  let totalCostUsd = 0;
  let totalTokens = 0;
  const byModel: Record<string, { tokens: number; cost: number; calls: number }> = {};

  for (const doc of snap.docs) {
    const data = doc.data();
    const cost = (data.estimatedCostUsd as number) ?? 0;
    const tokens = ((data.inputTokens as number) ?? 0) + ((data.outputTokens as number) ?? 0);
    const model = (data.model as string) ?? 'unknown';

    totalCostUsd += cost;
    totalTokens += tokens;

    if (!byModel[model]) {
      byModel[model] = { tokens: 0, cost: 0, calls: 0 };
    }
    byModel[model].tokens += tokens;
    byModel[model].cost += cost;
    byModel[model].calls += 1;
  }

  return { totalCostUsd, totalTokens, callCount: snap.size, byModel };
}
