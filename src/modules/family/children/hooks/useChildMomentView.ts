import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CHILD_MOMENT_VIEWS,
  type ChildMomentViewId,
  isChildMomentViewId,
} from '../constants/childMomentViews';

const DEFAULT_VIEW: ChildMomentViewId = 'stunder';

/** Synkar `?view=stunder|om|favoriter` på Familjen → Livslogg. */
export function useChildMomentView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get('view');

  const view = useMemo(() => {
    if (isChildMomentViewId(raw)) return raw;
    return DEFAULT_VIEW;
  }, [raw]);

  const setView = useCallback(
    (next: ChildMomentViewId) => {
      setSearchParams(
        (prev) => {
          const nextParams = new URLSearchParams(prev);
          if (next === DEFAULT_VIEW) nextParams.delete('view');
          else nextParams.set('view', next);
          return nextParams;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { view, setView, validViews: CHILD_MOMENT_VIEWS };
}
