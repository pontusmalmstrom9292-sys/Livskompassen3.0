import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { admin } from '../../lib/firebaseAdmin';
import { askSpeglingsCoach, askDagbokSnabbCoach } from '../../agents/vertexAgent';
import { trimSpeglingsMirror } from '../shared';
import { guardSensitiveCallableV2 } from '../../lib/callableGuards';
import { createSiloGuard, Silo } from '../../lib/siloEnforcer';

const compareVaultGuard = createSiloGuard('compareVaultEvidence', Silo.VALV);

export const speglingsMirror = onCall(
  { region: 'europe-west1', secrets: ['GEMINI_API_KEY'] },
  async (request) => {
    await guardSensitiveCallableV2(request, 'speglingsMirror', 30);

    const reflection = request.data.reflection;
    const mood = typeof request.data.mood === 'string' ? request.data.mood : undefined;

    if (!reflection || typeof reflection !== 'string') {
      throw new HttpsError('invalid-argument', 'Fältet "reflection" (string) krävs.');
    }

    if (reflection.length > 4000) {
      throw new HttpsError('invalid-argument', 'Reflection får vara max 4000 tecken.');
    }

    const rawMirror = await askSpeglingsCoach(reflection, mood, process.env.GEMINI_API_KEY);
    const mirror = trimSpeglingsMirror(rawMirror);
    return { mirror };
  }
);

export const compareVaultEvidence = onCall(
  { region: 'europe-west1' },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'compareVaultEvidence', 30);
    const searchText = request.data.searchText;
    if (!searchText || typeof searchText !== 'string') {
      throw new HttpsError('invalid-argument', 'searchText krävs.');
    }

    // 1. Läs hela valvet som fallback om Vector Search saknar embeddings
    compareVaultGuard.assertCollections(['reality_vault']);
    const db = admin.firestore();
    const vaultSnap = await db
      .collection('reality_vault')
      .where('ownerId', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();
    
    let docs = vaultSnap.docs
      .map((d) => ({ id: d.id, ...(d.data() as any) }))
      .filter((d) => d.category !== 'vävaren_metadata');

    // Token-match fallback ifall Vector Search misslyckades eller inga ANN-resultat
    const { matchVaultEvidence } = await import('../../lib/vaultRagTokenFallback');
    const matches = matchVaultEvidence(searchText, docs as any[]);
    return { matches: matches.slice(0, 5) };
  }
);

export const journalQuickMirror = onCall(
  { region: 'europe-west1', secrets: ['GEMINI_API_KEY'] },
  async (request) => {
    await guardSensitiveCallableV2(request, 'journalQuickMirror', 30);

    const mood = request.data.mood;
    if (!mood || typeof mood !== 'string' || mood.length > 80) {
      throw new HttpsError('invalid-argument', 'Fältet "mood" (string, max 80) krävs.');
    }

    const tags = Array.isArray(request.data.tags)
      ? request.data.tags.filter((t: unknown) => typeof t === 'string').slice(0, 10)
      : [];

    const optionalText = typeof request.data.optionalText === 'string' ? request.data.optionalText : undefined;
    if (optionalText && optionalText.length > 500) {
      throw new HttpsError('invalid-argument', 'optionalText max 500 tecken.');
    }

    const result = await askDagbokSnabbCoach(mood, tags, optionalText, process.env.GEMINI_API_KEY);
    return result;
  }
);
