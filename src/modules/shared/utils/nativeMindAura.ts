/**
 * Native Edge AI / Aura bridges for Capacitor WebView (Titanium shell).
 */
import { getLivskompassenNative } from './nativeSecureDownload';
import type { LivskompassenNativeBridge } from './nativeSecureDownload';

export type EdgeSilo = 'tanke' | 'handling' | 'idé';

export type EdgeIntelligenceDetail = {
  silo: EdgeSilo;
  lang: string;
  entities: string[];
  stress: boolean;
  text: string;
  receivedAt: number;
};

export type LivskompassenMindAuraBridge = LivskompassenNativeBridge & {
  analyzeIntelligence?: (text: string) => void;
  startAuraFlow?: () => void;
  stopAuraFlow?: () => void;
  triggerThematicHaptic?: (theme: string) => void;
  getCircadianPhase?: () => string;
  setStealthMode?: (active: boolean) => void;
  setAppIconStealth?: (active: boolean) => void;
};

export const INTELLIGENCE_EVENT = 'livskompassen-intelligence';

let lastIntelligence: EdgeIntelligenceDetail | null = null;

export function getMindAuraNative(): LivskompassenMindAuraBridge | null {
  return getLivskompassenNative() as LivskompassenMindAuraBridge | null;
}

export function getLastIntelligence(): EdgeIntelligenceDetail | null {
  return lastIntelligence;
}

export function setLastIntelligence(detail: EdgeIntelligenceDetail | null): void {
  lastIntelligence = detail;
}

export function clearLastIntelligence(): void {
  lastIntelligence = null;
}

/** Map Edge keyword silo → Inkast/G10 routing hint (never auto-forces WORM silo). */
export function mapEdgeSiloToRouting(silo: EdgeSilo): 'dagbok' | 'planning' | 'kunskap' {
  if (silo === 'handling') return 'planning';
  if (silo === 'idé') return 'kunskap';
  return 'dagbok';
}

function ensureConsumerInstalled(): void {
  void import('./intelligenceConsumer').then((m) => {
    m.installIntelligenceConsumer();
  });
}

/**
 * Fire native analysis and resolve when WebView receives the CustomEvent (or timeout).
 */
export function analyzeIntelligenceNativeAsync(
  text: string,
  timeoutMs = 900,
): Promise<EdgeIntelligenceDetail | null> {
  const t = text?.trim();
  if (!t) return Promise.resolve(null);

  ensureConsumerInstalled();
  const bridge = getMindAuraNative();
  if (!bridge?.analyzeIntelligence) return Promise.resolve(null);

  return new Promise((resolve) => {
    let settled = false;
    const finish = (detail: EdgeIntelligenceDetail | null) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      window.removeEventListener(INTELLIGENCE_EVENT, onEvent as EventListener);
      resolve(detail);
    };

    const onEvent = (ev: Event) => {
      const ce = ev as CustomEvent;
      const d = ce.detail as Partial<EdgeIntelligenceDetail> | undefined;
      if (!d || typeof d.silo !== 'string') return;
      const detail: EdgeIntelligenceDetail = {
        silo: d.silo as EdgeSilo,
        lang: typeof d.lang === 'string' ? d.lang : 'und',
        entities: Array.isArray(d.entities) ? d.entities.filter((e) => typeof e === 'string') : [],
        stress: d.stress === true,
        text: typeof d.text === 'string' ? d.text : t.slice(0, 200),
        receivedAt: Date.now(),
      };
      finish(detail);
    };

    const timer = window.setTimeout(() => finish(getLastIntelligence()), timeoutMs);
    window.addEventListener(INTELLIGENCE_EVENT, onEvent as EventListener);
    try {
      bridge.analyzeIntelligence(t);
    } catch {
      finish(null);
    }
  });
}

/** Fire-and-forget local silo/entity analysis (results via livskompassen-intelligence event). */
export function analyzeIntelligenceNative(text: string): void {
  const t = text?.trim();
  if (!t) return;
  ensureConsumerInstalled();
  getMindAuraNative()?.analyzeIntelligence?.(t);
}

export function startAuraFlowNative(): void {
  getMindAuraNative()?.startAuraFlow?.();
}

export function stopAuraFlowNative(): void {
  getMindAuraNative()?.stopAuraFlow?.();
}
