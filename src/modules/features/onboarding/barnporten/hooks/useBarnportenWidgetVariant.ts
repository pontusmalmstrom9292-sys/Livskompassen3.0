import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  type BarnportenWidgetVariant,
  parseBarnportenWidgetVariant,
  readBarnportenWidgetVariant,
  writeBarnportenWidgetVariant,
} from '../constants/barnportenWidgetVariant';

function resolveInitialVariant(search: URLSearchParams): BarnportenWidgetVariant {
  const fromUrl = parseBarnportenWidgetVariant(search.get('cb'));
  if (fromUrl) {
    writeBarnportenWidgetVariant(fromUrl);
    return fromUrl;
  }
  return readBarnportenWidgetVariant();
}

export function useBarnportenWidgetVariant() {
  const [searchParams, setSearchParams] = useSearchParams();
  const strippedCbRef = useRef(false);
  const [variant, setVariantState] = useState<BarnportenWidgetVariant>(() =>
    resolveInitialVariant(searchParams),
  );

  useEffect(() => {
    if (strippedCbRef.current || !searchParams.has('cb')) return;
    strippedCbRef.current = true;
    const next = new URLSearchParams(searchParams);
    next.delete('cb');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const setVariant = useCallback((next: BarnportenWidgetVariant) => {
    writeBarnportenWidgetVariant(next);
    setVariantState(next);
  }, []);

  return { variant, setVariant };
}
