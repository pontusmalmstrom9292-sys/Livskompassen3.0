/**
 * Native Edge AI / Aura bridges for Capacitor WebView (Titanium shell).
 */
import { getLivskompassenNative } from './nativeSecureDownload';
import type { LivskompassenNativeBridge } from './nativeSecureDownload';

export type LivskompassenMindAuraBridge = LivskompassenNativeBridge & {
  analyzeIntelligence?: (text: string) => void;
  startAuraFlow?: () => void;
  stopAuraFlow?: () => void;
  triggerThematicHaptic?: (theme: string) => void;
  getCircadianPhase?: () => string;
  setStealthMode?: (active: boolean) => void;
  setAppIconStealth?: (active: boolean) => void;
};

export function getMindAuraNative(): LivskompassenMindAuraBridge | null {
  return getLivskompassenNative() as LivskompassenMindAuraBridge | null;
}

/** Fire-and-forget local silo/entity analysis (results via livskompassen-intelligence event). */
export function analyzeIntelligenceNative(text: string): void {
  const t = text?.trim();
  if (!t) return;
  getMindAuraNative()?.analyzeIntelligence?.(t);
}

export function startAuraFlowNative(): void {
  getMindAuraNative()?.startAuraFlow?.();
}

export function stopAuraFlowNative(): void {
  getMindAuraNative()?.stopAuraFlow?.();
}
