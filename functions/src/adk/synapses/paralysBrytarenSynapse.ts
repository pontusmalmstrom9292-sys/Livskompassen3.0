import { createGenAI } from '../../lib/genaiClient';
import { GEMINI_FLASH } from '../../lib/modelRouter';
import { PARALYS_BRYTAREN_SYSTEM_PROMPT } from '../../sharedRules';
import { MICRO_STEP_MAX_SECONDS, type MicroStep } from '../types';

const HEAVY_RESPONSE_MIN_CHARS = 400;
const BULLET_PATTERN = /^[\s]*[-*•\d]+[.)]\s+/m;

export function isHeavyResponse(text: string): boolean {
  if (text.length >= HEAVY_RESPONSE_MIN_CHARS) return true;
  const bullets = text.split('\n').filter((line) => BULLET_PATTERN.test(line));
  return bullets.length >= 3;
}

function clampSeconds(n: number): number {
  return Math.min(Math.max(Math.round(n), 5), MICRO_STEP_MAX_SECONDS);
}

/** Deterministisk fallback — ingen LLM om parse misslyckas. */
export function breakIntoMicroStepsDeterministic(text: string): MicroStep[] {
  const chunks = text
    .split(/\n+/)
    .map((s) => s.replace(/^[\s-*•\d.)]+/, '').trim())
    .filter((s) => s.length > 8);

  if (chunks.length === 0) {
    return [
      {
        instruction: text.slice(0, 120).trim() || 'Ta ett djupt andetag.',
        estimatedSeconds: 10,
        physicalAnchor: 'Andning',
      },
    ];
  }

  return chunks.slice(0, 8).map((instruction) => ({
    instruction,
    estimatedSeconds: clampSeconds(instruction.length / 4),
    physicalAnchor: inferPhysicalAnchor(instruction),
  }));
}

function inferPhysicalAnchor(instruction: string): string {
  const lower = instruction.toLowerCase();
  if (/skriv|penna|tangent/.test(lower)) return 'Händer / skrivyta';
  if (/öppna|stäng|dörr|fil/.test(lower)) return 'Rörelse / objekt';
  if (/andning|andetag|vagus/.test(lower)) return 'Andning';
  if (/stå|gå|sitt/.test(lower)) return 'Kropp / position';
  return 'En konkret handling';
}

export async function breakIntoMicroSteps(text: string): Promise<MicroStep[]> {
  if (!isHeavyResponse(text)) {
    return breakIntoMicroStepsDeterministic(text.slice(0, 200));
  }

  try {
    const ai = createGenAI();
    const result = await ai.models.generateContent({
      model: GEMINI_FLASH,
      contents: `Bryt ner detta API-svar till mikrosteg (max ${MICRO_STEP_MAX_SECONDS}s vardera):\n\n${text}`,
      config: {
        systemInstruction: PARALYS_BRYTAREN_SYSTEM_PROMPT,
        temperature: 0.1,
        maxOutputTokens: 512,
      },
    });

    const raw = result.text ?? '{}';
    const parsed = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) as {
      microSteps?: MicroStep[];
    };

    if (Array.isArray(parsed.microSteps) && parsed.microSteps.length > 0) {
      return parsed.microSteps.map((s) => ({
        instruction: String(s.instruction),
        estimatedSeconds: clampSeconds(Number(s.estimatedSeconds) || 30),
        physicalAnchor: String(s.physicalAnchor || inferPhysicalAnchor(String(s.instruction))),
      }));
    }
  } catch (err) {
    console.warn('[Paralys-Brytaren] LLM-fallback:', err);
  }

  return breakIntoMicroStepsDeterministic(text);
}

/** Sub-synaps: post-processar tungt agentsvar till 30-sekunders mikrosteg. */
export async function applyParalysBreak(agentText: string): Promise<MicroStep[]> {
  return breakIntoMicroSteps(agentText);
}
