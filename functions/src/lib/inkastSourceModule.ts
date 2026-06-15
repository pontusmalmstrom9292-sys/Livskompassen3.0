/** Server-side allowlist — endast klient-kända capture-moduler får påverka heuristik. */
const ALLOWED_INKAST_SOURCE_MODULES = new Set([
  'hem_capture',
  'hem_smart_inkast',
  'hem_inkast',
  'planering_inkorg',
  'valv_samla',
  'hamn',
  'hamn_biff',
  'familjen',
  'barnen',
  'barnfokus',
  'mabra_inkast',
  'ekonomi_inkast',
  'voiceToVault',
  'smoke_inkast_lockdown',
]);

const INJECTED_SOURCE_MODULE_LINE = /^\s*\[sourceModule:[^\]]+\]\s*/i;

/** Tar bort injicerade [sourceModule:…]-prefix från användartext före klassificering. */
export function stripInjectedSourceModuleFromText(text: string): string {
  let out = text;
  while (INJECTED_SOURCE_MODULE_LINE.test(out)) {
    out = out.replace(INJECTED_SOURCE_MODULE_LINE, '');
  }
  return out;
}

export function normalizeInkastSourceModule(raw: string | undefined): string | undefined {
  if (typeof raw !== 'string') return undefined;
  const mod = raw.trim().slice(0, 80);
  if (!mod) return undefined;
  return ALLOWED_INKAST_SOURCE_MODULES.has(mod) ? mod : undefined;
}
