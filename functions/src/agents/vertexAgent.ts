import {
  DAGBOK_SNABB_COACHEN_SYSTEM_PROMPT,
  LIVSKOMPASSEN_SYSTEM_CONFIG,
  KBT_TRANSFORMATOR_SYSTEM_PROMPT,
  MABRA_COACHEN_SYSTEM_PROMPT,
  SPEGLINGS_COACHEN_SYSTEM_PROMPT,
} from '../sharedRules';
import { createGenAI } from '../lib/genaiClient';
import {
  journalQuickMirrorFallback,
  parseJournalQuickMirrorJson,
  type JournalQuickMirrorResult,
} from '../lib/journalQuickMirrorParse';
import {
  kbtTransformFallback,
  parseKbtTransformJson,
  type KbtTransformResult,
} from '../lib/kbtTransformatorParse';

const SPEGLINGS_MODEL = 'gemini-2.5-flash';
const MABRA_COACH_MODEL = 'gemini-2.5-flash';
const DAGBOK_SNABB_MODEL = 'gemini-2.5-flash';

export const askKnowledgeVault = async (prompt: string): Promise<string> => {
  try {
    console.log(`[Knowledge Vault v2.0] Behandlar förfrågan med uppdaterade systemlagar...`);

    const ai = createGenAI();
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: prompt,
      config: {
        systemInstruction: LIVSKOMPASSEN_SYSTEM_CONFIG.aiPersona.systemInstruction,
        temperature: 0.2,
      }
    });

    return response.text || "Inget svar genererades.";
  } catch (error) {
    console.error("[Knowledge Vault] Fel vid anrop till det nya Google Gen AI SDK:", error);
    throw new Error("Kunde inte nå den uppgraderade AI-motorn.");
  }
};

function mirrorFeelingFallback(reflection: string): string {
  const trimmed = reflection.trim();
  const lead = trimmed
    ? `Det du beskriver — "${trimmed.slice(0, 120)}${trimmed.length > 120 ? '…' : ''}" — är en begriplig reaktion.`
    : 'Du behöver inte formulera perfekt. Det du känner räcker som start.';
  return `${lead} Jag fixar inget här; jag speglar bara. Nästa steg är att skilja känsla från fakta (VIVIR).`;
}

export function isSpeglingsFallback(text: string, reflection: string): boolean {
  return text === mirrorFeelingFallback(reflection);
}

function mabraCoachFallback(hubSymptom: string, exerciseType: string): string {
  const hubLine =
    hubSymptom === 'panic_rsd'
      ? 'Kroppen fick en paus — det räcker som steg.'
      : hubSymptom === 'self_critical'
        ? 'Du gav dig ett ögonblick utan att prestera.'
        : 'Du är här nu — det är ett steg i sig.';
  const exerciseLine =
    exerciseType === 'breathing'
      ? 'Andningen är gjord.'
      : exerciseType === 'grounding'
        ? 'Groundingen är gjord.'
        : 'Reframing-övningen är gjord.';
  return `${exerciseLine} ${hubLine} Inget mer krävs av dig just nu.`;
}

export const askMabraCoach = async (
  hubSymptom: string,
  exerciseType: string,
  optionalNote?: string,
  geminiApiKey?: string
): Promise<string> => {
  const context = [
    `Symptom-hub: ${hubSymptom}`,
    `Övning: ${exerciseType}`,
    optionalNote?.trim() ? `Valfri rad från användaren: ${optionalNote.trim()}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const ai = createGenAI(geminiApiKey);
    const response = await ai.models.generateContent({
      model: MABRA_COACH_MODEL,
      contents: context,
      config: {
        systemInstruction: MABRA_COACHEN_SYSTEM_PROMPT,
        temperature: 0.2,
      },
    });

    const text = response.text?.trim();
    if (!text) throw new Error('Tomt måbra-coach-svar.');
    return text;
  } catch (error) {
    console.error('[Måbra-Coachen] Fel — degraded fallback:', error);
    return mabraCoachFallback(hubSymptom, exerciseType);
  }
};

export const askKbtTransformator = async (
  thought: string,
  geminiApiKey?: string,
): Promise<KbtTransformResult> => {
  try {
    const ai = createGenAI(geminiApiKey);
    const response = await ai.models.generateContent({
      model: MABRA_COACH_MODEL,
      contents: thought.trim(),
      config: {
        systemInstruction: KBT_TRANSFORMATOR_SYSTEM_PROMPT,
        temperature: 0.2,
      },
    });
    const text = response.text?.trim();
    if (!text) throw new Error('Tomt KBT-svar.');
    return parseKbtTransformJson(text);
  } catch (error) {
    console.error('[KBT-Transformator] Fel — degraded fallback:', error);
    return kbtTransformFallback(thought);
  }
};

export const askSpeglingsCoach = async (
  reflection: string,
  mood?: string,
  geminiApiKey?: string
): Promise<string> => {
  const prompt = mood
    ? `Humör från dagbok: ${mood}\nKänsla/reflektion: ${reflection}`
    : reflection;

  try {
    const ai = createGenAI(geminiApiKey);
    const response = await ai.models.generateContent({
      model: SPEGLINGS_MODEL,
      contents: prompt,
      config: {
        systemInstruction: SPEGLINGS_COACHEN_SYSTEM_PROMPT,
        temperature: 0.2,
      },
    });

    const text = response.text?.trim();
    if (!text) throw new Error('Tomt speglings-svar.');
    return text;
  } catch (error) {
    console.error('[Speglings-Coachen] Fel — degraded fallback:', error);
    return mirrorFeelingFallback(reflection);
  }
};

export const askDagbokSnabbCoach = async (
  mood: string,
  tags: string[],
  optionalText?: string,
  geminiApiKey?: string,
): Promise<JournalQuickMirrorResult> => {
  const context = [
    `Humör: ${mood}`,
    tags.length ? `Taggar: ${tags.join(', ')}` : 'Taggar: (inga)',
    optionalText?.trim() ? `Valfri rad: ${optionalText.trim()}` : 'Valfri rad: (tom)',
  ].join('\n');

  try {
    const ai = createGenAI(geminiApiKey);
    const response = await ai.models.generateContent({
      model: DAGBOK_SNABB_MODEL,
      contents: context,
      config: {
        systemInstruction: DAGBOK_SNABB_COACHEN_SYSTEM_PROMPT,
        temperature: 0.2,
      },
    });

    const text = response.text?.trim();
    if (!text) throw new Error('Tomt dagbok-snabb-svar.');
    return parseJournalQuickMirrorJson(text);
  } catch (error) {
    console.error('[Dagbok Snabb] Fel — degraded fallback:', error);
    return journalQuickMirrorFallback(mood, optionalText);
  }
};