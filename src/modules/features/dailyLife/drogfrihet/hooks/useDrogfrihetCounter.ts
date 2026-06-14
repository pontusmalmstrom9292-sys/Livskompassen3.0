import { useEffect, useState } from 'react';
import {
  DROGFRIHET_COUNTER_EVENT,
  getDrogfrihetCounterState,
  type DrogfrihetCounterState,
} from '../lib/drogfrihetCounter';

export function useDrogfrihetCounter(uid?: string): DrogfrihetCounterState {
  const [state, setState] = useState(() => getDrogfrihetCounterState(uid));

  useEffect(() => {
    setState(getDrogfrihetCounterState(uid));
  }, [uid]);

  useEffect(() => {
    const onChange = () => setState(getDrogfrihetCounterState(uid));
    window.addEventListener(DROGFRIHET_COUNTER_EVENT, onChange);
    return () => window.removeEventListener(DROGFRIHET_COUNTER_EVENT, onChange);
  }, [uid]);

  return state;
}
