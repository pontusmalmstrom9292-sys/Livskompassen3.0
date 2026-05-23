import { createGenAI } from './genaiClient';

export type WidgetRecordingAnalysis = {
  title: string;
  summary: string;
  category: string;
};

const MODEL = 'gemini-2.5-flash';

export function widgetRecordingFallback(
  transcript: string,
  recordedAtIso: string,
): WidgetRecordingAnalysis {
  const d = new Date(recordedAtIso);
  const stamp = Number.isNaN(d.getTime())
    ? recordedAtIso
    : d.toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' });
  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const title =
    words.length >= 3
      ? `${words.slice(0, 6).join(' ')} · ${stamp}`
      : `Inspelning ${stamp}`;
  const summary =
    words.length > 0
      ? transcript.trim().slice(0, 2000)
      : `Ljudinspelning ${stamp}. Ingen transkription — öppna bifogad ljudfil i Valvet.`;
  return { title: title.slice(0, 120), summary, category: 'tyst_inspelning' };
}

function parseAnalysisJson(raw: string): WidgetRecordingAnalysis | null {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]) as Record<string, unknown>;
    const title = typeof parsed.title === 'string' ? parsed.title.trim() : '';
    const summary = typeof parsed.summary === 'string' ? parsed.summary.trim() : '';
    const category =
      typeof parsed.category === 'string' ? parsed.category.trim() : 'tyst_inspelning';
    if (!title || !summary) return null;
    return {
      title: title.slice(0, 120),
      summary: summary.slice(0, 4000),
      category: category.slice(0, 64) || 'tyst_inspelning',
    };
  } catch {
    return null;
  }
}

/** Neutral titel + sammanfattning för widget-inspelning (ingen JADE). */
export async function analyzeWidgetRecording(
  transcript: string,
  recordedAtIso: string,
  durationSeconds: number | undefined,
  geminiApiKey?: string,
): Promise<WidgetRecordingAnalysis> {
  const fallback = widgetRecordingFallback(transcript, recordedAtIso);
  const trimmed = transcript.trim();
  if (!geminiApiKey) return fallback;

  const prompt = [
    `Inspelad: ${recordedAtIso}`,
    durationSeconds != null ? `Längd sekunder: ${durationSeconds}` : '',
    trimmed ? `Transkript:\n${trimmed.slice(0, 6000)}` : 'Inget transkript — generera titel från tidpunkt endast.',
    '',
    'Returnera ENDAST JSON:',
    '{"title":"kort neutral rubrik max 60 tecken","summary":"2-4 meningar fakta/känsla utan råd till ex","category":"tyst_inspelning"}',
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const ai = createGenAI(geminiApiKey);
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        systemInstruction:
          'Du är arkivarien för en privat WORM-logg. Kort, klinisk svenska. Inga anklagelser. Ingen JADE. JSON endast.',
        temperature: 0.15,
      },
    });
    const text = response.text?.trim() ?? '';
    return parseAnalysisJson(text) ?? fallback;
  } catch (err) {
    console.error('[analyzeWidgetRecording]', err);
    return fallback;
  }
}
