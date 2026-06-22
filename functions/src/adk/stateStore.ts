import crypto from 'crypto';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import type { StateMutation, SynapseState } from './types';

export function hashPayload(payload: Record<string, unknown>): string {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(payload))
    .digest('hex')
    .slice(0, 16);
}

const TTL_HOURS = 24;

export async function createTrace(contextId: string): Promise<SynapseState> {
  const db = getFirestore();
  const state: SynapseState = {
    contextId,
    traceId: crypto.randomUUID(),
    mutations: [],
    createdAt: new Date().toISOString(),
  };
  
  await db.collection('adk_traces').doc(contextId).set({
    ...state,
    expiresAt: new Date(Date.now() + TTL_HOURS * 3600 * 1000),
  });
  
  return state;
}

export async function getTrace(contextId: string): Promise<SynapseState | undefined> {
  const db = getFirestore();
  const doc = await db.collection('adk_traces').doc(contextId).get();
  if (!doc.exists) return undefined;
  
  const data = doc.data() as SynapseState;
  return {
    contextId: data.contextId,
    traceId: data.traceId,
    mutations: data.mutations || [],
    createdAt: data.createdAt,
  };
}

export async function appendMutation(
  contextId: string,
  mutation: Omit<StateMutation, 'timestamp' | 'payloadHash'> & { payload: Record<string, unknown> }
): Promise<SynapseState> {
  const db = getFirestore();
  const ref = db.collection('adk_traces').doc(contextId);
  
  const newMutation = {
    fromAgentId: mutation.fromAgentId,
    toAgentId: mutation.toAgentId,
    intent: mutation.intent,
    payloadHash: hashPayload(mutation.payload),
    timestamp: new Date().toISOString(),
  };

  return db.runTransaction(async (t) => {
    const doc = await t.get(ref);
    if (!doc.exists) {
      const state: SynapseState = {
        contextId,
        traceId: crypto.randomUUID(),
        mutations: [newMutation],
        createdAt: new Date().toISOString(),
      };
      t.set(ref, {
        ...state,
        expiresAt: new Date(Date.now() + TTL_HOURS * 3600 * 1000),
      });
      return state;
    }

    t.update(ref, {
      mutations: FieldValue.arrayUnion(newMutation),
      expiresAt: new Date(Date.now() + TTL_HOURS * 3600 * 1000),
    });

    const data = doc.data() as SynapseState;
    return {
      ...data,
      mutations: [...(data.mutations || []), newMutation],
    };
  });
}

/** Zero Footprint — rensa ephemeralt synapstillstånd vid utloggning. */
export async function clearSynapseState(contextId: string): Promise<void> {
  const db = getFirestore();
  await db.collection('adk_traces').doc(contextId).delete();
}
