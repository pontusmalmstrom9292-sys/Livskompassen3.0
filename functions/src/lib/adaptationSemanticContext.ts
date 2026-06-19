import { isAdaptationSemanticEnabled } from './adaptationSemanticGate';
import { getAdaptationSemanticProfileDoc } from './adaptationSemanticStore';

const CONTEXT_HEADER =
  '[ADAPTATION_CORE — Core-silo only. Anpassa längd/ton efter profilen. Ingen cross-RAG.]';

/** Laddar kort profilkontext för LLM systemInstruction (L2c). Zero Footprint i RAM efter request. */
export async function loadAdaptationSemanticContext(uid: string): Promise<string | null> {
  const enabled = await isAdaptationSemanticEnabled(uid);
  if (!enabled) return null;

  const profile = await getAdaptationSemanticProfileDoc(uid);
  if (!profile?.summaryText?.trim()) return null;

  return `${CONTEXT_HEADER}\n${profile.summaryText.trim()}`;
}

export function appendAdaptationSemanticContext(
  baseSystemInstruction: string,
  adaptationContext: string | null | undefined,
): string {
  if (!adaptationContext?.trim()) return baseSystemInstruction;
  return `${baseSystemInstruction}\n\n${adaptationContext.trim()}`;
}
