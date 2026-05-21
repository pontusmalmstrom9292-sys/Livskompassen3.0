import { GoogleGenAI } from '@google/genai';
import { LIVSKOMPASSEN_SYSTEM_CONFIG, SPEGLINGS_COACHEN_SYSTEM_PROMPT } from '../sharedRules';
import { GCP_PROJECT_ID, GCP_REGION } from '../config';

const ai = new GoogleGenAI({
  project: GCP_PROJECT_ID,
  location: GCP_REGION,
});

export const askKnowledgeVault = async (prompt: string): Promise<string> => {
  try {
    console.log(`[Knowledge Vault v2.0] Behandlar förfrågan med uppdaterade systemlagar...`);

    // Anrop enligt den nya @google/genai-standarden
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro', // Det nya paketet använder universella modellnamn
      contents: prompt,
      config: {
        // Här tvingar vi in dina globala regler i molnhjärnan!
        systemInstruction: LIVSKOMPASSEN_SYSTEM_CONFIG.aiPersona.systemInstruction,
        temperature: 0.2, // Håller AI:n fokuserad och strukturerad
      }
    });

    return response.text || "Inget svar genererades.";
  } catch (error) {
    console.error("[Knowledge Vault] Fel vid anrop till det nya Google Gen AI SDK:", error);
    throw new Error("Kunde inte nå den uppgraderade AI-motorn.");
  }
};

export const askSpeglingsCoach = async (reflection: string, mood?: string): Promise<string> => {
  const prompt = mood
    ? `Humör från dagbok: ${mood}\nKänsla/reflektion: ${reflection}`
    : reflection;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: prompt,
      config: {
        systemInstruction: SPEGLINGS_COACHEN_SYSTEM_PROMPT,
        temperature: 0.2,
        maxOutputTokens: 220,
      },
    });

    const text = response.text?.trim();
    if (!text) throw new Error('Tomt speglings-svar.');
    return text;
  } catch (error) {
    console.error('[Speglings-Coachen] Fel:', error);
    throw new Error('Speglings-Coachen kunde inte svara.');
  }
};