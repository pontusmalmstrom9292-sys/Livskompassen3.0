import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '@/core/store';
import {
  getOrCreateBarnportenDeviceId,
  writeBarnportenChildAlias,
} from '../constants/barnportenDeviceId';
import { claimBarnportenPairing } from '../api/barnportenPairingService';

type PairState =
  | { phase: 'idle' }
  | { phase: 'needs_auth' }
  | { phase: 'working' }
  | { phase: 'done'; childAlias: string }
  | { phase: 'error'; message: string };

/** Claim ?pair=TOKEN på barnenhet (samma Firebase-konto som förälder). */
export function useBarnportenPairClaim() {
  const user = useStore((s) => s.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState<PairState>({ phase: 'idle' });

  useEffect(() => {
    const token = searchParams.get('pair')?.trim().toLowerCase();
    if (!token) {
      setState({ phase: 'idle' });
      return;
    }
    if (!user) {
      setState({ phase: 'needs_auth' });
      return;
    }

    let cancelled = false;
    setState({ phase: 'working' });

    void (async () => {
      try {
        const deviceId = getOrCreateBarnportenDeviceId();
        const result = await claimBarnportenPairing(token, deviceId);
        if (cancelled) return;
        writeBarnportenChildAlias(result.childAlias);
        setState({ phase: 'done', childAlias: result.childAlias });
        const next = new URLSearchParams(searchParams);
        next.delete('pair');
        setSearchParams(next, { replace: true });
      } catch (error) {
        if (cancelled) return;
        const message =
          error instanceof Error ? error.message : 'Koppling misslyckades. Försök igen.';
        setState({ phase: 'error', message });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, searchParams, setSearchParams]);

  return state;
}
