import { useEffect, useState } from 'react';
import {
  DROGFRIHET_COUNTER_EVENT,
  getDrogfrihetCounterState,
  getDrogfrihetStartDateKey,
  setDrogfrihetStartDateKey,
  type DrogfrihetCounterState,
} from '../lib/drogfrihetCounter';
import { fetchRecoveryProfile } from '../api/recoveryProfileService';

export function useDrogfrihetCounter(uid?: string): DrogfrihetCounterState {
  const [state, setState] = useState(() => getDrogfrihetCounterState(uid));

  useEffect(() => {
    setState(getDrogfrihetCounterState(uid));
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    void (async () => {
      const local = getDrogfrihetStartDateKey(uid);
      if (local) return;
      const profile = await fetchRecoveryProfile(uid);
      if (cancelled || !profile?.startDateKey) return;
      setDrogfrihetStartDateKey(profile.startDateKey, uid);
    })();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  useEffect(() => {
    const onChange = () => setState(getDrogfrihetCounterState(uid));
    window.addEventListener(DROGFRIHET_COUNTER_EVENT, onChange);
    return () => window.removeEventListener(DROGFRIHET_COUNTER_EVENT, onChange);
  }, [uid]);

  return state;
}
