import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { weaveJournalEntry as runWeaver } from '../../agents/weaverAgent';
import { approveWeaverPending, rejectWeaverPending } from '../../lib/weaverPending';
import { assertVaultSession } from '../../lib/vaultSessionGate';
import { adkOrchestrator } from '../../adk';
import { emitSynapse } from '../../adk/synapses/synapseBus';
import { geminiApiKey } from '../../lib/geminiSecret';
import { guardSensitiveCallableV2 } from '../../lib/callableGuards';

export const weaveJournalEntry = onCall(
  { region: 'europe-west1' },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'weaveJournalEntry', 15);
    // Lager 1: async tagging efter journal-save — kräver inte Valv-session.
    // Skriver endast weaver_pending (HITL); reality_vault via approveWeaverMetadata + assertVaultSession.

    const { journalEntryId, mood, text } = request.data;
    if (!journalEntryId || !mood || !text) {
      throw new HttpsError('invalid-argument', 'journalEntryId, mood och text krävs.');
    }

    return runWeaver(uid, journalEntryId, mood, text);
  }
);

export const approveWeaverMetadata = onCall(
  { region: 'europe-west1' },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'approveWeaverMetadata', 20);
    await assertVaultSession(uid, request.data);
    const pendingId = typeof request.data?.pendingId === 'string' ? request.data.pendingId.trim() : '';
    if (!pendingId) {
      throw new HttpsError('invalid-argument', 'pendingId krävs.');
    }
    try {
      return await approveWeaverPending(uid, pendingId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Godkännande misslyckades.';
      throw new HttpsError('failed-precondition', msg);
    }
  }
);

export const rejectWeaverMetadata = onCall(
  { region: 'europe-west1' },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'rejectWeaverMetadata', 20);
    await assertVaultSession(uid, request.data);
    const pendingId = typeof request.data?.pendingId === 'string' ? request.data.pendingId.trim() : '';
    if (!pendingId) {
      throw new HttpsError('invalid-argument', 'pendingId krävs.');
    }
    try {
      await rejectWeaverPending(uid, pendingId);
      return { status: 'dismissed' };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Avvisning misslyckades.';
      throw new HttpsError('failed-precondition', msg);
    }
  }
);

export const journalWovenToKampspar = onCall(
  { region: 'europe-west1', secrets: [geminiApiKey] },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'journalWovenToKampspar', 10);

    if (request.data?.optIn !== true) {
      throw new HttpsError(
        'invalid-argument',
        'optIn: true krävs — journal_woven körs endast med explicit samtycke.'
      );
    }

    const journalEntryId = typeof request.data.journalEntryId === 'string' ? request.data.journalEntryId.trim() : '';
    const mood = typeof request.data.mood === 'string' ? request.data.mood.trim() : '';
    const text = typeof request.data.text === 'string' ? request.data.text : '';

    if (!journalEntryId || !mood) {
      throw new HttpsError('invalid-argument', 'journalEntryId och mood krävs.');
    }

    const result = await emitSynapse(adkOrchestrator, {
      trigger: 'journal_woven',
      contextId: uid,
      payload: {
        ownerId: uid,
        journalEntryId,
        mood,
        text,
        optIn: true,
      },
    });

    return result;
  }
);
