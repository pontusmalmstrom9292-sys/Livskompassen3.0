import * as admin from 'firebase-admin';
import { VÄVAREN_SYSTEM_PROMPT } from '../sharedRules';
import { fetchWeaverRagContext } from '../lib/kampsparRag';
import { createGenAI } from '../lib/genaiClient';

const ai = createGenAI();

export type ThreatLevel = 'none' | 'low' | 'medium' | 'high';

export interface WeaverResult {
  emotions: string[];
  actors: string[];
  threatLevel: ThreatLevel;
  threatScore?: number;
  ragAnchors: { source: string; docId: string; excerpt?: string }[];
}

async function fetchRagContext(uid: string, text: string): Promise<string> {
  return fetchWeaverRagContext(uid, text);
}

function parseWeaverJson(raw: string): WeaverResult | null {
  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleaned) as WeaverResult;
    if (!Array.isArray(parsed.emotions) || !Array.isArray(parsed.actors)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function weaveJournalEntry(
  uid: string,
  journalEntryId: string,
  mood: string,
  text: string
): Promise<{ vaultMetadataId?: string; status: string }> {
  const ragContext = await fetchRagContext(uid, text);

  const prompt = `Journalpost (id: ${journalEntryId}):
Humör: ${mood}
Text: ${text}

RAG-kontext:
${ragContext}

Returnera JSON:
{"emotions":["..."],"actors":["..."],"threatLevel":"none|low|medium|high","threatScore":0,"ragAnchors":[{"source":"journal|reality_vault","docId":"...","excerpt":"..."}]}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: prompt,
      config: {
        systemInstruction: VÄVAREN_SYSTEM_PROMPT,
        temperature: 0.1,
      },
    });

    const raw = response.text ?? '';
    const tags = parseWeaverJson(raw);
    if (!tags) {
      console.warn('[Vävaren] Kunde inte parsa JSON för', journalEntryId);
      return { status: 'deferred' };
    }

    const summary = `Taggar: ${tags.emotions.join(', ')} | aktörer: ${tags.actors.join(', ')} | hot: ${tags.threatLevel}`;

    const docRef = await admin.firestore().collection('reality_vault').add({
      userId: uid,
      ownerId: uid,
      category: 'vävaren_metadata',
      action: 'journal_tagging',
      truth: summary,
      journalEntryId,
      sourceMood: mood,
      weaverTags: { ...tags, model: 'gemini-1.5-pro', journalEntryId },
      isLocked: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { vaultMetadataId: docRef.id, status: 'ok' };
  } catch (err) {
    console.error('[Vävaren] Fel:', err);
    return { status: 'deferred' };
  }
}
