/**
 * Deterministisk SHA-256 checksum — browser + async Node.
 */
export const PAYROLL_ENGINE_VERSION = 'lonekontor-v1';

/** Kanonisk JSON — sorterade nycklar, inga undefined. */
export function canonicalJson(value: unknown): string {
  return JSON.stringify(value, (_key, v) => {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      return Object.keys(v as Record<string, unknown>)
        .sort()
        .reduce<Record<string, unknown>>((acc, k) => {
          const val = (v as Record<string, unknown>)[k];
          if (val !== undefined) acc[k] = val;
          return acc;
        }, {});
    }
    return v;
  });
}

/** Async checksum — browser (Web Crypto) och Node 18+. */
export async function sha256Hex(payload: unknown): Promise<string> {
  if (typeof globalThis.crypto?.subtle?.digest === 'function') {
    const data = new TextEncoder().encode(canonicalJson(payload));
    const buf = await globalThis.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  throw new Error('Web Crypto saknas — kör i modern webbläsare eller Node.');
}
