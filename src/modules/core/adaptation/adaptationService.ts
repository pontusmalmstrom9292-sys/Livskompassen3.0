import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/init';
import type { AdaptationPrefsDoc, AdaptationSilo } from '../types/adaptation';

export interface AdaptationProfileResult {
  enabled: boolean;
  prefs: AdaptationPrefsDoc | null;
}

export interface RecordAdaptationSignalPayload {
  signalKey: string;
  increment?: number;
  value?: number | string | boolean;
  silo?: AdaptationSilo;
}

export interface RecordAdaptationSignalResult {
  ok: boolean;
  prefs: AdaptationPrefsDoc;
  silo: AdaptationSilo;
}

const getAdaptationProfileCallable = httpsCallable<void, AdaptationProfileResult>(
  functions,
  'getAdaptationProfile',
);

const recordAdaptationSignalCallable = httpsCallable<
  RecordAdaptationSignalPayload,
  RecordAdaptationSignalResult
>(functions, 'recordAdaptationSignal');

export async function fetchAdaptationProfile(): Promise<AdaptationProfileResult> {
  const result = await getAdaptationProfileCallable();
  return result.data;
}

export async function recordAdaptationSignal(
  payload: RecordAdaptationSignalPayload,
): Promise<RecordAdaptationSignalResult> {
  const result = await recordAdaptationSignalCallable(payload);
  return result.data;
}
