import { describe, expect, it } from 'vitest';
import { canonicalJson } from '@economy/checksum';
import { sha256HexSync } from '@economy/checksum.node';

describe('checksum', () => {
  it('kanonisk JSON är deterministisk', () => {
    const a = canonicalJson({ b: 2, a: 1 });
    const b = canonicalJson({ a: 1, b: 2 });
    expect(a).toBe(b);
  });

  it('sha256HexSync är stabil', () => {
    const h1 = sha256HexSync({ table: 32, year: 2026 });
    const h2 = sha256HexSync({ table: 32, year: 2026 });
    expect(h1).toBe(h2);
    expect(h1).toHaveLength(64);
  });
});
