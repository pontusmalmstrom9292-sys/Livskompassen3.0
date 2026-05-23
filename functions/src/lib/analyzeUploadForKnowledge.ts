import { createGenAI } from './genaiClient';

const MODEL = 'gemini-2.5-flash';
const MAX_BYTES = 4 * 1024 * 1024;

const KNOWLEDGE_EXTRACT_PROMPT = `Du indexerar dokument till ett privat kunskapsarkiv.
Extrahera: kort titel (max 120 tecken), sammanfattning, datum om de finns, parter, och faktabaserade punkter.
Neutral ton — ingen rådgivning, ingen JADE.
Svara som ren text med rubriker: ## Sammanfattning, ## Fakta, ## Datum och parter (om relevant).
Max 5500 tecken totalt.`;

export async function analyzeUploadForKnowledge(
  buffer: Buffer,
  mimeType: string,
  fileName: string,
): Promise<{ title: string; content: string }> {
  if (buffer.length > MAX_BYTES) {
    throw new Error(`Filen är för stor (max ${MAX_BYTES / (1024 * 1024)} MB).`);
  }

  const ai = createGenAI();
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        inlineData: {
          data: buffer.toString('base64'),
          mimeType,
        },
      },
      {
        text: `${KNOWLEDGE_EXTRACT_PROMPT}\n\nFilnamn: ${fileName}`,
      },
    ],
    config: { temperature: 0.15, maxOutputTokens: 4096 },
  });

  const text = (response.text ?? '').trim();
  if (text.length < 40) {
    throw new Error('Kunde inte extrahera text från dokumentet.');
  }

  const title = fileName.replace(/\.[^.]+$/, '').slice(0, 120) || 'Uppladdat dokument';
  return {
    title,
    content: text.slice(0, 48_000),
  };
}
