import { LIVSKOMPASSEN_SYSTEM_CONFIG, SPEGLINGS_COACHEN_SYSTEM_PROMPT } from '../sharedRules';
import { createGenAI } from '../lib/genaiClient';

const SPEGLINGS_MODEL = 'gemini-2.5-flash';

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