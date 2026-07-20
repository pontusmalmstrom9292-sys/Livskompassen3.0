/**
 * Metrics Collector
 * Samlar latency, errors, token-usage för bättre observability
 */

export interface Metric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  tags?: Record<string, string>;
}

export interface CallableMetrics {
  callable: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  error?: string;
  success: boolean;
}

class MetricsCollector {
  private metrics: Metric[] = [];
  private callableMetrics: CallableMetrics[] = [];
  private readonly MAX_METRICS = 10000;

  recordMetric(name: string, value: number, unit: string, tags?: Record<string, string>): void {
    const metric: Metric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      tags,
    };
    this.metrics.push(metric);
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics.shift();
    }
  }

  startCallable(callable: string): () => CallableMetrics {
    const startTime = Date.now();
    return () => ({
      callable,
      startTime,
      endTime: Date.now(),
      duration: Date.now() - startTime,
      success: true,
    });
  }

  recordCallable(metrics: CallableMetrics): void {
    this.callableMetrics.push(metrics);
    if (this.callableMetrics.length > this.MAX_METRICS) {
      this.callableMetrics.shift();
    }
  }

  getSummary(callable?: string) {
    const relevantMetrics = callable
      ? this.callableMetrics.filter(m => m.callable === callable)
      : this.callableMetrics;

    if (relevantMetrics.length === 0) return null;

    const durations = relevantMetrics.map(m => m.duration || 0);
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;

    return {
      count: relevantMetrics.length,
      avgDuration,
      maxDuration: Math.max(...durations),
      errorRate: relevantMetrics.filter(m => !m.success).length / relevantMetrics.length,
      totalTokens: relevantMetrics.reduce((a, m) => a + (m.totalTokens || 0), 0),
    };
  }

  clear(): void {
    this.metrics = [];
    this.callableMetrics = [];
  }
}

export const metricsCollector = new MetricsCollector();
