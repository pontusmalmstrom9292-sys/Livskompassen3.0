import {
  DAGBOK_SNABB_COACHEN_SYSTEM_PROMPT,
  LIVSKOMPASSEN_SYSTEM_CONFIG,
  KBT_TRANSFORMATOR_SYSTEM_PROMPT,
  MABRA_COACHEN_SYSTEM_PROMPT,
  VIT_CHAT_COACH_SYSTEM_PROMPT,
  SPEGLINGS_COACHEN_SYSTEM_PROMPT,
  UPPGIFTS_KROSSAREN_SYSTEM_PROMPT,
  VOICE_TO_VAULT_SYSTEM_PROMPT,
  MABRA_NUTRITION_COACH_SYSTEM_PROMPT,
  MABRA_MOVEMENT_COACH_SYSTEM_PROMPT,
} from '../sharedRules';
import { createGenAI } from '../lib/genaiClient';
import { GEMINI_PRO, GEMINI_FLASH } from '../lib/modelRouter';
import { appendAdaptationSemanticContext } from '../lib/adaptationSemanticContext';
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
import {
  type MabraCoachBankEntry,
  type MabraCoachExercise,
  type MabraCoachHub,
  parafraseCoachFromBank,
} from '../lib/mabraContentBank';
import type { CoachTone } from '../../../shared/adaptation/adaptationTypes';

const SPEGLINGS_MODEL = GEMINI_FLASH;
const MABRA_COACH_MODEL = GEMINI_FLASH;
const DAGBOK_SNABB_MODEL = GEMINI_FLASH;

export const askKnowledgeVault = async (prompt: string): Promise<string> => {
  try {
    console.log(`[Knowledge Vault v2.0] Behandlar förfrågan med uppdaterade systemlagar...`);

    const ai = createGenAI();
    const response = await ai.models.generateContent({
      model: GEMINI_PRO,
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

function vitChatFallback(projectId: string, bankEntry?: MabraCoachBankEntry): string {
  if (bankEntry) {
    return `${bankEntry.text_sv} Du behöver inte ha ett svar än — bara märka.`;
  }
  const line =
    projectId === 'learn_together'
      ? 'Ett steg i taget räcker. Vad känns viktigast att utforska — utan att lösa allt?'
      : 'Du behöver inte ha ett svar än. Vad märker du hos dig just nu?';
  return line;
}

export const askVitChatCoach = async (
  projectId: string,
  userMessage: string,
  bankEntry: MabraCoachBankEntry | undefined,
  geminiApiKey?: string,
): Promise<string> => {
  const context = [
    `Vit-projekt: ${projectId}`,
    bankEntry
      ? `Godkänd bankrad (bankId: ${bankEntry.bankId}): ${bankEntry.text_sv}`
      : '',
    `Användarens meddelande: ${userMessage.trim()}`,
    'Parafrasera endast bankraden — skapa inga nya frågekort eller fakta.',
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const ai = createGenAI(geminiApiKey);
    const response = await ai.models.generateContent({
      model: MABRA_COACH_MODEL,
      contents: context,
      config: {
        systemInstruction: VIT_CHAT_COACH_SYSTEM_PROMPT,
        temperature: 0.2,
      },
    });

    const text = response.text?.trim();
    if (!text) throw new Error('Tomt vit-chat-svar.');
    return text;
  } catch (error) {
    console.error('[Vit-Chat-Coachen] Fel — degraded fallback:', error);
    return vitChatFallback(projectId, bankEntry);
  }
};

export const askMabraCoach = async (
  hubSymptom: MabraCoachHub,
  exerciseType: MabraCoachExercise,
  bankEntry: MabraCoachBankEntry,
  optionalNote?: string,
  geminiApiKey?: string,
  adaptationContext?: string | null,
  coachTone: CoachTone = 'standard',
): Promise<string> => {
  const context = [
    `Symptom-hub: ${hubSymptom}`,
    `Övning: ${exerciseType}`,
    `Godkänd bankrad (bankId: ${bankEntry.bankId}): ${bankEntry.text_sv}`,
    'Parafrasera bankraden i 2–3 korta meningar efter övningen — inga nya fakta eller frågekort.',
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
        systemInstruction: appendAdaptationSemanticContext(
          MABRA_COACHEN_SYSTEM_PROMPT,
          adaptationContext,
        ),
        temperature: 0.2,
      },
    });

    const text = response.text?.trim();
    if (!text) throw new Error('Tomt måbra-coach-svar.');
    return text;
  } catch (error) {
    console.error('[Måbra-Coachen] Fel — degraded fallback:', error);
    return parafraseCoachFromBank(bankEntry, hubSymptom, exerciseType, coachTone);
  }
};

export const askMabraNutritionCoach = async (
  message: string,
  geminiApiKey?: string,
): Promise<string> => {
  try {
    const ai = createGenAI(geminiApiKey);
    const response = await ai.models.generateContent({
      model: MABRA_COACH_MODEL,
      contents: message.trim(),
      config: {
        systemInstruction: MABRA_NUTRITION_COACH_SYSTEM_PROMPT,
        temperature: 0.2,
      },
    });

    const text = response.text?.trim();
    if (!text) throw new Error('Tomt nutrition-coach-svar.');
    return text;
  } catch (error) {
    console.error('[Nutrition-Coachen] Fel — degraded fallback:', error);
    return 'Lyssna på din kropp. Finns det något litet, näringsrikt du kan lägga till din nästa måltid utan stress?';
  }
};

export const askMabraMovementCoach = async (
  message: string,
  geminiApiKey?: string,
): Promise<string> => {
  try {
    const ai = createGenAI(geminiApiKey);
    const response = await ai.models.generateContent({
      model: MABRA_COACH_MODEL,
      contents: message.trim(),
      config: {
        systemInstruction: MABRA_MOVEMENT_COACH_SYSTEM_PROMPT,
        temperature: 0.2,
      },
    });

    const text = response.text?.trim();
    if (!text) throw new Error('Tomt movement-coach-svar.');
    return text;
  } catch (error) {
    console.error('[Movement-Coachen] Fel — degraded fallback:', error);
    return 'Ett mikrosteg är bättre än inget. Kanske en minuts stretch eller en kort bensträckare?';
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

export const askUppgiftsKrossaren = async (
  task: string,
  geminiApiKey?: string,
): Promise<string[]> => {
  try {
    const ai = createGenAI(geminiApiKey);
    const response = await ai.models.generateContent({
      model: GEMINI_FLASH,
      contents: `Bryt ner denna uppgift: ${task}`,
      config: {
        systemInstruction: UPPGIFTS_KROSSAREN_SYSTEM_PROMPT,
        temperature: 0.1,
      },
    });

    const text = response.text?.trim() ?? '{}';
    const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim()) as { atoms?: string[] };
    
    if (Array.isArray(parsed.atoms) && parsed.atoms.length > 0) {
      return parsed.atoms;
    }
    throw new Error('Inga atomer hittades i JSON');
  } catch (error) {
    console.error('[Uppgifts-Krossaren] Fel — degraded fallback:', error);
    return [
      `1. Förbered dig för: ${task.slice(0, 50)}`,
      `2. Utför första lilla steget av uppgiften.`,
    ];
  }
};

export interface VoiceToVaultResult {
  intent: 'task' | 'vault_fact';
  summary: string;
  confidence: number;
  originalText: string;
}

export const askVoiceParser = async (
  transcribedText: string,
  geminiApiKey?: string,
): Promise<VoiceToVaultResult> => {
  try {
    const ai = createGenAI(geminiApiKey);
    const response = await ai.models.generateContent({
      model: GEMINI_FLASH,
      contents: `Analysera denna text: ${transcribedText}`,
      config: {
        systemInstruction: VOICE_TO_VAULT_SYSTEM_PROMPT,
        temperature: 0.1,
      },
    });

    const text = response.text?.trim() ?? '{}';
    const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim()) as VoiceToVaultResult;
    
    if (parsed.intent && parsed.summary) {
      return parsed;
    }
    throw new Error('Ogiltigt JSON-svar från Voice Parser');
  } catch (error) {
    console.error('[Voice-Parser] Fel — degraded fallback:', error);
    // Fallback if parsing fails - default to task
    return {
      intent: 'task',
      summary: transcribedText.slice(0, 50) + (transcribedText.length > 50 ? '...' : ''),
      confidence: 0,
      originalText: transcribedText,
    };
  }
};