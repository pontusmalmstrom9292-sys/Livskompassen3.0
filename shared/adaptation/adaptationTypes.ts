/**
 * Adaptation Core — delade typer (client + Cloud Functions).
 * Lager 1: preferenser, signaler, append-only audit (ej semantisk RAG).
 */

export const ADAPTATION_LAYER_FLAG = 'adaptation_layer_v1' as const;

export type AdaptationSilo = 'kunskap' | 'valv' | 'barnen' | 'vardag' | 'core';

export type AdaptationLedgerType =
  | 'pref_updated'
  | 'signal_recorded'
  | 'semantic_indexed'
  | 'feature_flagged';

export type AdaptationLedgerSource = 'user' | 'system' | 'callable';

export type CoachTone = 'minimal' | 'standard' | 'detailed';
export type UiDensity = 'paralys' | 'normal' | 'full';

export interface AdaptationPrefsDoc {
  userId: string;
  ownerId: string;
  coachTone: CoachTone;
  uiDensity: UiDensity;
  routingDefaults: Record<string, string>;
  dismissedHints: string[];
  inferredSignals: Record<string, number | string | boolean>;
  updatedAt?: string;
}

export interface AdaptationLedgerEntry {
  userId: string;
  ownerId: string;
  type: AdaptationLedgerType;
  source: AdaptationLedgerSource;
  silo: AdaptationSilo;
  rationale: string;
  metadata: Record<string, unknown>;
}

export type AdaptationLedgerWriteInput = AdaptationLedgerEntry & {
  userId: string;
};

export const DEFAULT_ADAPTATION_PREFS: Omit<
  AdaptationPrefsDoc,
  'userId' | 'ownerId' | 'updatedAt'
> = {
  coachTone: 'standard',
  uiDensity: 'normal',
  routingDefaults: {},
  dismissedHints: [],
  inferredSignals: {},
};
