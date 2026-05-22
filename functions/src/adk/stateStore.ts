import crypto from 'crypto';
import type { StateMutation, SynapseState } from './types';

const stateByContext = new Map<string, SynapseState>();

export function hashPayload(payload: Record<string, unknown>): string {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(payload))
    .digest('hex')
    .slice(0, 16);
}

export function createTrace(contextId: string): SynapseState {
  const state: SynapseState = {
    contextId,
    traceId: crypto.randomUUID(),
    mutations: [],
    createdAt: new Date().toISOString(),
  };
  stateByContext.set(contextId, state);
  return state;
}

export function getTrace(contextId: string): SynapseState | undefined {
  return stateByContext.get(contextId);
}

export function appendMutation(
  contextId: string,
  mutation: Omit<StateMutation, 'timestamp' | 'payloadHash'> & { payload: Record<string, unknown> }
): SynapseState {
  const existing = stateByContext.get(contextId) ?? createTrace(contextId);
  existing.mutations.push({
    fromAgentId: mutation.fromAgentId,
    toAgentId: mutation.toAgentId,
    intent: mutation.intent,
    payloadHash: hashPayload(mutation.payload),
    timestamp: new Date().toISOString(),
  });
  stateByContext.set(contextId, existing);
  return existing;
}

/** Zero Footprint — rensa ephemeralt synapstillstånd vid utloggning. */
export function clearSynapseState(contextId: string): void {
  stateByContext.delete(contextId);
}
