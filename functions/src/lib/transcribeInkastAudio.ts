import { createGenAI } from './genaiClient';
import { INKAST_MAX_AUDIO_BYTES } from './inkastConstants';

const MODEL = 'gemini-2.5-flash';

const TRANSCRIBE_PROMPT =
  'Transkribera ljudet till svensk text. Endast transkript — ingen kommentar, ingen JADE.';

/** Audio → text för G10 Inkast (samma pipeline som dokument-extraktion). */
export async function transcribeInkastAudio(
  buffer: Buffer,
  mimeType: string,
  fileName: string,
): Promise<string> {
  if (buffer.length > INKAST_MAX_AUDIO_BYTES) {
    throw new Error(
      `Ljudfilen är för stor (max ${INKAST_MAX_AUDIO_BYTES / (1024 * 1024)} MB).`,
    );
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
        text: `${TRANSCRIBE_PROMPT}\n\nFilnamn: ${fileName}`,
      },
    ],
    config: { temperature: 0.1, maxOutputTokens: 8192 },
  });

  const text = (response.text ?? '').trim();
  if (text.length < 8) {
    throw new Error('Kunde inte transkribera ljudfilen.');
  }
  return text.slice(0, 12_000);
}
