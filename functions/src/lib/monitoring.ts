/**
 * Observability & Monitoring — structured logging, metric helpers, and alerting hooks.
 * Integrates with Cloud Monitoring via structured JSON logs (severity-based alerting).
 *
 * Usage: import { monitor } from '../lib/monitoring';
 *        monitor.trackLatency('analyzeMessage', startMs);
 *        monitor.trackError('knowledgeVaultQuery', error);
 *        monitor.trackVertexQuota(tokensUsed, model);
 */

import { GCP_PROJECT_ID, GCP_REGION } from '../config';

export type Severity = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export interface MetricEntry {
  metric: string;
  value: number;
  labels: Record<string, string>;
  timestamp: string;
}

export interface AlertCondition {
  metric: string;
  threshold: number;
  window: string;
  severity: Severity;
}

/** Structured log entry compatible with Cloud Logging JSON payload. */
function structuredLog(severity: Severity, message: string, metadata?: Record<string, unknown>): void {
  const entry = {
    severity,
    message,
    timestamp: new Date().toISOString(),
    'logging.googleapis.com/labels': {
      project: GCP_PROJECT_ID,
      region: GCP_REGION,
      service: 'livskompassen-functions',
    },
    ...metadata,
  };
  if (severity === 'ERROR' || severity === 'CRITICAL') {
    console.error(JSON.stringify(entry));
  } else if (severity === 'WARNING') {
    console.warn(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

/** Track function execution latency for Cloud Monitoring dashboards. */
function trackLatency(functionName: string, startMs: number, metadata?: Record<string, unknown>): void {
  const durationMs = Date.now() - startMs;
  structuredLog('INFO', `[Latency] ${functionName}: ${durationMs}ms`, {
    'metric.type': 'custom.googleapis.com/functions/latency_ms',
    'metric.labels': { function_name: functionName },
    'metric.value': durationMs,
    ...metadata,
  });
}

/** Track errors with structured context for alerting rules. */
function trackError(functionName: string, error: unknown, metadata?: Record<string, unknown>): void {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  structuredLog('ERROR', `[Error] ${functionName}: ${message}`, {
    'metric.type': 'custom.googleapis.com/functions/error_count',
    'metric.labels': { function_name: functionName },
    'metric.value': 1,
    errorMessage: message,
    stackTrace: stack,
    ...metadata,
  });
}

/** Track Vertex AI token usage for quota monitoring and cost alerts. */
function trackVertexQuota(tokensUsed: number, model: string, metadata?: Record<string, unknown>): void {
  structuredLog('INFO', `[VertexQuota] model=${model} tokens=${tokensUsed}`, {
    'metric.type': 'custom.googleapis.com/vertex/tokens_used',
    'metric.labels': { model },
    'metric.value': tokensUsed,
    ...metadata,
  });
}

/** Track WORM write operations for audit trail. */
function trackWormWrite(collection: string, docId: string, userId: string): void {
  structuredLog('INFO', `[WORM-Write] ${collection}/${docId} by uid=${userId}`, {
    'metric.type': 'custom.googleapis.com/worm/write_count',
    'metric.labels': { collection },
    'metric.value': 1,
    collection,
    docId,
    userId,
  });
}

/** Track DCAP alert metrics for trend analysis. */
function trackDcapAlert(riskScore: number, action: string, userId: string): void {
  structuredLog(riskScore >= 70 ? 'WARNING' : 'INFO', `[DCAP] riskScore=${riskScore} action=${action}`, {
    'metric.type': 'custom.googleapis.com/dcap/alert_score',
    'metric.labels': { action },
    'metric.value': riskScore,
    userId,
  });
}

/** Track agent invocation for cost and performance analysis. */
function trackAgentInvocation(agentId: string, durationMs: number, success: boolean): void {
  structuredLog('INFO', `[Agent] ${agentId} duration=${durationMs}ms success=${success}`, {
    'metric.type': 'custom.googleapis.com/agents/invocation',
    'metric.labels': { agent_id: agentId, success: String(success) },
    'metric.value': durationMs,
  });
}

/** Predefined alert conditions for Cloud Monitoring policies. */
export const ALERT_CONDITIONS: AlertCondition[] = [
  {
    metric: 'custom.googleapis.com/functions/error_count',
    threshold: 5,
    window: '5m',
    severity: 'ERROR',
  },
  {
    metric: 'custom.googleapis.com/functions/latency_ms',
    threshold: 10000,
    window: '5m',
    severity: 'WARNING',
  },
  {
    metric: 'custom.googleapis.com/vertex/tokens_used',
    threshold: 100000,
    window: '1h',
    severity: 'WARNING',
  },
  {
    metric: 'custom.googleapis.com/dcap/alert_score',
    threshold: 70,
    window: '15m',
    severity: 'CRITICAL',
  },
];

export const monitor = {
  log: structuredLog,
  trackLatency,
  trackError,
  trackVertexQuota,
  trackWormWrite,
  trackDcapAlert,
  trackAgentInvocation,
};
