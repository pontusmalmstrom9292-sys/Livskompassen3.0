import { useCallback, useEffect, useState } from 'react';
import {
  listPlanningModulePins,
  PLANNING_PINS_CHANGED,
  type PlaneringModulePin,
} from '../planningModulePinStorage';

type Filter = {
  targetId?: string;
  contextKey?: string;
  listId?: string;
};

export function usePlanningModulePins(filter?: Filter): PlaneringModulePin[] {
  const [pins, setPins] = useState<PlaneringModulePin[]>(() => listPlanningModulePins(filter));

  const reload = useCallback(() => {
    setPins(listPlanningModulePins(filter));
  }, [filter?.targetId, filter?.contextKey, filter?.listId]);

  useEffect(() => {
    reload();
    window.addEventListener(PLANNING_PINS_CHANGED, reload);
    return () => window.removeEventListener(PLANNING_PINS_CHANGED, reload);
  }, [reload]);

  return pins;
}
