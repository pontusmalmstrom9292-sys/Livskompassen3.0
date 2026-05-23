/**
 * Inferred from mock BiffDetector — inkorg only (user paste 2026-05-23).
 * Runtime target: map to `BiffAnalysisResult` / `GransAnalysis` in `src/modules/safe_harbor/api/biffService.ts`
 * via `analyzeMessage` callable — not direct Gemini client in prod.
 */

export interface BiffResponse {
  emotionalNoise: string;
  logisticCore: string;
  /** Three Grey Rock variants: Standard, Ultra-Kort, Minimalist */
  responses: [string, string, string] | string[];
}

/** Mock service signature — `../services/gemini.runBiffTriage` (ej i repo) */
export type RunBiffTriage = (input: string) => Promise<BiffResponse>;
