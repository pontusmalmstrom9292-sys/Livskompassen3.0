import * as admin from 'firebase-admin';
import { GoogleGenAI } from '@google/genai';
import { VÄVAREN_SYSTEM_PROMPT } from '../sharedRules';
import { GCP_PROJECT_ID, GCP_REGION } from '../config';

const ai = new GoogleGenAI({
  project: GCP_PROJECT_ID,
  location: GCP_REGION,
});

export type ThreatLevel = 'none' | 'low' | 'medium' | 'high';

export interface WeaverResult {
  emotions: string[];
  actors: string[];
  threatLevel: ThreatLevel;
  threatScore?: number;
  ragAnchors: { source: string; docId: string; excerpt?: string }[];
}

function truncate(text: string, max = 120): string {
  return text.length <= max ? text : `${text.slice(0, max)}…`;
}

async function fetchRagContext(uid: string): Promise<string> {
  const db = admin.firestore();
  const [journalSnap, vaultSnap] = await Promise.all([
    db.collection('journal').where('userId', '==', uid).orderBy('createdAt', 'desc').limit(5).get(),
    db.collection('reality_vault').where('userId', '==', uid).orderBy('createdAt', 'desc').limit(5).get(),
  ]);

  const journalLines = journalSnap.docs.map(
    (d) => `[journal:${d.id}] ${truncate(String(d.data().text ?? ''))}`
  );
  const vaultLines = vaultSnap.docs.map(
    (d) => `[reality_vault:${d.id}] ${truncate(String(d.data().truth ?? ''))}`
  );

  return [...journalLines, ...vaultLines].join('\n') || '(ingen tidigare kontext)';
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
  const ragContext = await fetchRagContext(uid);

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
