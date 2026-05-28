import { useCallback, useEffect, useState } from 'react';
import { useStore } from '../../../core/store';
import { getDefaultCompassByTime, type CompassFlow } from '../utils/compassTime';

/** Aktiv kompass-flöde — följer klockan och uppdateras vid tidsgränser (SPEC §3). */
export function useCompassTimeFlow() {
  const setCompassFilter = useStore((s) => s.setCompassFilter);
  const [timeFlow, setTimeFlow] = useState<CompassFlow>(() => getDefaultCompassByTime());
  const [manualFlow, setManualFlow] = useState<CompassFlow | null>(null);

  const refreshTimeFlow = useCallback(() => {
    setTimeFlow(getDefaultCompassByTime());
  }, []);

  useEffect(() => {
    refreshTimeFlow();
    const id = window.setInterval(refreshTimeFlow, 60_000);
    const onVis = () => {
      if (document.visibilityState === 'visible') refreshTimeFlow();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [refreshTimeFlow]);

  useEffect(() => {
    setManualFlow(null);
  }, [timeFlow]);

  const activeFlow = manualFlow ?? timeFlow;

  useEffect(() => {
    setCompassFilter(activeFlow);
  }, [activeFlow, setCompassFilter]);

  const switchFlow = useCallback((id: CompassFlow) => {
    setManualFlow(id);
  }, []);

  return { activeFlow, timeFlow, switchFlow };
}
