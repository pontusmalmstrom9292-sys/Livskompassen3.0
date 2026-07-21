import { useEffect, useState } from 'react';
import { resolveHomeSurface, type CompanionHomeSurface } from './resolveHomeSurface';
import { msUntilNextPeriod } from './smartTimeContext';
import { subscribeWidgetStudio } from '../studio/widgetStudioStore';
import type { WidgetAiSignals } from './widgetAiContext';
import { DEFAULT_AI_SIGNALS } from './widgetAiContext';

/**
 * Companion home surface hook — refreshes on visibility + period boundary only.
 */
export function useCompanionSurface(signals?: WidgetAiSignals): CompanionHomeSurface {
  const [surface, setSurface] = useState(() =>
    resolveHomeSurface({ signals: signals ?? DEFAULT_AI_SIGNALS }),
  );

  useEffect(() => {
    const refresh = () => setSurface(resolveHomeSurface({ signals: signals ?? DEFAULT_AI_SIGNALS }));
    const unsub = subscribeWidgetStudio(() => refresh());

    const onVis = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', onVis);

    let timer: ReturnType<typeof setTimeout> | null = null;
    const schedule = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        refresh();
        schedule();
      }, Math.min(msUntilNextPeriod(), 6 * 60 * 60 * 1000));
    };
    schedule();

    return () => {
      unsub();
      document.removeEventListener('visibilitychange', onVis);
      if (timer) clearTimeout(timer);
    };
  }, [signals]);

  return surface;
}
