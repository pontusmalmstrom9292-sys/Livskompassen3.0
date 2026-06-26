import { createGenAI } from './genaiClient';
import {
  InboxClassification,
  parseClassificationJson,
} from './inboxClassifier';

const MODEL = 'gemini-1.5-flash';
const MAX_BYTES = 4 * 1024 * 1024; // 4MB

const COMBINED_ANALYSIS_PROMPT = `
You are a multi-talented assistant for the Livskompassen application, designed to help users in high-conflict situations. Your task is to perform two actions in one:
1.  **Knowledge Extraction:** Index the document for a private knowledge base. Extract a title, a neutral summary, relevant dates, and key factual points.
2.  **Classification:** Classify the document for automatic sorting into the correct digital vault.

Analyze the document and return ONLY a single, valid JSON object with NO markdown formatting.

The JSON object must have the following structure:
{
  "knowledge": {
    "title": "A short, descriptive title (max 120 characters)",
    "summary": "A neutral, fact-based summary of the document's content.",
    "facts": ["A list of key factual points."],
    "datesAndParties": "Any dates or involved parties mentioned."
  },
  "classification": {
    "routing": "kunskap|bevis|barnen|dagbok|review|planning",
    "tags": ["tag1", "tag2"],
    "category": "A short category name",
    "confidence": 0.0,
    "summary": "A very short summary for the inbox (max 400 characters)",
    "traumaSensitive": false,
    "childAlias": "Kasper|Arvid|null",
    "rationale": "A one-sentence rationale for the classification."
  }
}

**Classification Rules:**
- **Default Priority:** ~80% of unclear text is evidence of high-conflict communication. If it mentions SMS, email, the other parent, patterns, or timelines, route to "bevis". Otherwise, route to "review".
- **routing='bevis':** Communication logs (SMS, email), legal documents, timelines, evidence for disputes.
- **routing='dagbok':** Personal reflections, thoughts, gratitude, everyday logistics with no evidence value.
- **routing='kunskap':** How-to articles, reference materials, tips without immediate evidence value.
- **routing='barnen':** Observations about children (sleep, school, behavior).
- **routing='planning':** To-do items, action points (e.g., "remember to...", "I must...").
- **routing='review':** For trauma-related content (mentions of LVU, custody disputes, self-harm, violence), unclear cases, or if confidence is low.
- **traumaSensitive=true:** Mark for LVU, custody disputes, acute crisis, self-harm, violence. This will require human review unless the user has opted-in.
- Use Swedish, lowercase tags.
`;

export interface CombinedAnalysis {
  knowledge: {
    title: string;
    summary: string;
    facts: string[];
    datesAndParties: string;
  };
  classification: InboxClassification;
}

function parseCombinedAnalysisJson(raw: string): CombinedAnalysis | null {
  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (!parsed.knowledge || !parsed.classification) {
      console.warn('[analyzeAndClassifyUpload] Root knowledge or classification key missing.');
      return null;
    }

    // Use the imported parser for the nested classification object.
    const classification = parseClassificationJson(JSON.stringify(parsed.classification));
    if (!classification) {
      console.warn('[analyzeAndClassifyUpload] Failed to parse nested classification object.');
      return null;
    }

    return {
      knowledge: {
        title: String(parsed.knowledge.title ?? 'No Title').slice(0, 120),
        summary: String(parsed.knowledge.summary ?? ''),
        facts: Array.isArray(parsed.knowledge.facts) ? parsed.knowledge.facts.map(String) : [],
        datesAndParties: String(parsed.knowledge.datesAndParties ?? ''),
      },
      classification,
    };
  } catch (err) {
    console.error('[analyzeAndClassifyUpload] Error parsing combined analysis JSON:', err);
    return null;
  }
}

export async function analyzeAndClassifyUpload(
  buffer: Buffer,
  mimeType: string,
  fileName: string,
): Promise<CombinedAnalysis | null> {
  if (buffer.length > MAX_BYTES) {
    console.warn(`[analyzeAndClassifyUpload] File too large: ${buffer.length} bytes. Skipping.`);
    return null;
  }

  try {
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
          text: `${COMBINED_ANALYSIS_PROMPT}\n\nFilename for context: ${fileName}`,
        },
      ],
      config: { temperature: 0.1, maxOutputTokens: 4096, responseMimeType: 'application/json' },
    });

    const text = (response.text ?? '').trim();
    if (!text) {
      console.error('[analyzeAndClassifyUpload] AI response was empty.');
      return null;
    }
    
    const parsed = parseCombinedAnalysisJson(text);

    if (!parsed) {
      console.error('[analyzeAndClassifyUpload] Failed to parse the combined AI response.', { text });
      return null;
    }

    return parsed;
  } catch (err) {
    console.error('[analyzeAndClassifyUpload] Unhandled error during AI call:', err);
    return null;
  }
}
