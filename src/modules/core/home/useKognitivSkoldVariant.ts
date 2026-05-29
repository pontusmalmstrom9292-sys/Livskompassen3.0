import { useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_KOGNITIV_SKOLD_VARIANT,
  KOGNITIV_SKOLD_STORAGE_KEY,
  KOGNITIV_SKOLD_VARIANTS,
  type KognitivSkoldVariantId,
  resolveKognitivSkoldVariantId,
} from './kognitivSkoldVariants';

function readFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('kSkold');
}

function readFromStorage(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(KOGNITIV_SKOLD_STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Hem-hero K01–K10. Dev: `?kSkold=K03-obsidian-stjarna` sparas i localStorage. */
export function useKognitivSkoldVariant() {
  const [variantId, setVariantId] = useState<KognitivSkoldVariantId>(() =>
    resolveKognitivSkoldVariantId(readFromUrl() ?? readFromStorage()),
  );

  useEffect(() => {
    const fromUrl = readFromUrl();
    if (fromUrl) {
      const resolved = resolveKognitivSkoldVariantId(fromUrl);
      setVariantId(resolved);
      try {
        localStorage.setItem(KOGNITIV_SKOLD_STORAGE_KEY, resolved);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const tokens = useMemo(() => KOGNITIV_SKOLD_VARIANTS[variantId], [variantId]);

  return {
    variantId,
    tokens,
    defaultVariantId: DEFAULT_KOGNITIV_SKOLD_VARIANT,
  };
}
