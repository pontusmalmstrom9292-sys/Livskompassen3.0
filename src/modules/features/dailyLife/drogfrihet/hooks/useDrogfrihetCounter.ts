import { useEffect, useMemo, useState } from 'react';
import {
  DROGFRIHET_COUNTER_EVENT,
  getDrogfrihetCounterState,
  type DrogfrihetCounterState,
} from '../lib/drogfrihetCounter';

export function useDrogfrihetCounter(uid?: string): DrogfrihetCounterState {
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const onChange = () => setRevision((r) => r + 1);
    window.addEventListener(DROGFRIHET_COUNTER_EVENT, onChange);
    return () => window.removeEventListener(DROGFRIHET_COUNTER_EVENT, onChange);
  }, []);

  return useMemo(() => getDrogfrihetCounterState(uid), [uid, revision]);
}
