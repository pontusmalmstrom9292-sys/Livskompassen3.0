/** P4 — lokal fallback när bankId saknas i server-bank (t.ex. C-se-*). */
export function vitBankParafrasFallback(text_sv: string): string {
  return `Sparat. ${text_sv} Inget mer krävs av dig just nu.`;
}
