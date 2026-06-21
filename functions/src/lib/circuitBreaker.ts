/**
 * Circuit Breaker — per-agent failure isolation for ADK orchestration.
 *
 * States: CLOSED (normal) → OPEN (failing, reject calls) → HALF_OPEN (test one call)
 *
 * Prevents cascading failures when an agent (Vertex AI, external service) is down.
 * Resets automatically after cooldown period.
 */

import { monitor } from './monitoring';

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerConfig {
  /** Number of failures before opening circuit. Default: 5 */
  failureThreshold: number;
  /** Milliseconds before attempting recovery. Default: 30000 (30s) */
  cooldownMs: number;
  /** Milliseconds window to count failures in. Default: 60000 (1min) */
  windowMs: number;
}

interface CircuitRecord {
  state: CircuitState;
  failures: number[];
  lastFailure: number;
  openedAt: number;
}

const DEFAULT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  cooldownMs: 30_000,
  windowMs: 60_000,
};

const circuits = new Map<string, CircuitRecord>();
const configs = new Map<string, CircuitBreakerConfig>();

/** Register a circuit breaker for an agent with custom config. */
export function registerCircuit(agentId: string, config?: Partial<CircuitBreakerConfig>): void {
  configs.set(agentId, { ...DEFAULT_CONFIG, ...config });
  if (!circuits.has(agentId)) {
    circuits.set(agentId, { state: 'CLOSED', failures: [], lastFailure: 0, openedAt: 0 });
  }
}

/** Check if a call to this agent is allowed. */
export function canCall(agentId: string): boolean {
  const record = getOrCreateRecord(agentId);
  const config = configs.get(agentId) ?? DEFAULT_CONFIG;
  const now = Date.now();

  if (record.state === 'CLOSED') return true;

  if (record.state === 'OPEN') {
    if (now - record.openedAt >= config.cooldownMs) {
      record.state = 'HALF_OPEN';
      monitor.log('INFO', `[CircuitBreaker] ${agentId} → HALF_OPEN (cooldown elapsed)`);
      return true;
    }
    return false;
  }

  // HALF_OPEN: allow one test call
  return true;
}

/** Record a successful call — resets circuit if HALF_OPEN. */
export function recordSuccess(agentId: string): void {
  const record = getOrCreateRecord(agentId);
  if (record.state === 'HALF_OPEN') {
    record.state = 'CLOSED';
    record.failures = [];
    monitor.log('INFO', `[CircuitBreaker] ${agentId} → CLOSED (recovery successful)`);
  }
}

/** Record a failed call — may trip the circuit. */
export function recordFailure(agentId: string): void {
  const record = getOrCreateRecord(agentId);
  const config = configs.get(agentId) ?? DEFAULT_CONFIG;
  const now = Date.now();

  record.lastFailure = now;

  if (record.state === 'HALF_OPEN') {
    // Failed during test — re-open
    record.state = 'OPEN';
    record.openedAt = now;
    monitor.log('WARNING', `[CircuitBreaker] ${agentId} → OPEN (half-open test failed)`);
    return;
  }

  // Prune old failures outside window
  record.failures = record.failures.filter((t) => now - t < config.windowMs);
  record.failures.push(now);

  if (record.failures.length >= config.failureThreshold) {
    record.state = 'OPEN';
    record.openedAt = now;
    monitor.log('WARNING', `[CircuitBreaker] ${agentId} → OPEN (${record.failures.length} failures in window)`, {
      agentId,
      failures: record.failures.length,
    });
    monitor.trackAgentInvocation(agentId, 0, false);
  }
}

/** Get circuit state for diagnostics. */
export function getCircuitState(agentId: string): { state: CircuitState; failures: number } {
  const record = getOrCreateRecord(agentId);
  return { state: record.state, failures: record.failures.length };
}

/** Reset all circuits — for testing or manual recovery. */
export function resetAllCircuits(): void {
  circuits.clear();
}

function getOrCreateRecord(agentId: string): CircuitRecord {
  let record = circuits.get(agentId);
  if (!record) {
    record = { state: 'CLOSED', failures: [], lastFailure: 0, openedAt: 0 };
    circuits.set(agentId, record);
  }
  return record;
}

/**
 * Wrap an async agent call with circuit breaker protection.
 * Throws CircuitOpenError if circuit is open.
 */
export async function withCircuitBreaker<T>(
  agentId: string,
  fn: () => Promise<T>
): Promise<T> {
  if (!canCall(agentId)) {
    const error = new Error(`Circuit OPEN for agent ${agentId} — call rejected.`);
    error.name = 'CircuitOpenError';
    monitor.log('WARNING', `[CircuitBreaker] Rejected call to ${agentId} (circuit OPEN)`);
    throw error;
  }

  const startMs = Date.now();
  try {
    const result = await fn();
    recordSuccess(agentId);
    monitor.trackAgentInvocation(agentId, Date.now() - startMs, true);
    return result;
  } catch (err) {
    recordFailure(agentId);
    monitor.trackAgentInvocation(agentId, Date.now() - startMs, false);
    throw err;
  }
}
