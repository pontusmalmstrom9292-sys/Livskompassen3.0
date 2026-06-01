import { useCallback, useSyncExternalStore } from 'react';
import {
  DEFAULT_PLANERING_HUB_LAYOUT_ID,
  getPlaneringHubLayout,
  isPlaneringHubLayoutId,
  type PlaneringHubLayout,
  type PlaneringHubLayoutId,
} from './planeringHubLayouts';

const STORAGE_KEY = 'livskompassen_planering_hub_layout_v1';

function readLayoutId(): PlaneringHubLayoutId {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (isPlaneringHubLayoutId(raw)) return raw;
  } catch {
    /* ignore */
  }
  return DEFAULT_PLANERING_HUB_LAYOUT_ID;
}

let layoutId = readLayoutId();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  listeners.forEach((l) => l());
}

function setLayoutId(id: PlaneringHubLayoutId) {
  layoutId = id;
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
  emit();
}

export function usePlaneringHubLayout(): {
  layoutId: PlaneringHubLayoutId;
  layout: PlaneringHubLayout;
  setLayoutId: (id: PlaneringHubLayoutId) => void;
} {
  const id = useSyncExternalStore(subscribe, () => layoutId, () => layoutId);
  const set = useCallback((next: PlaneringHubLayoutId) => setLayoutId(next), []);
  return {
    layoutId: id,
    layout: getPlaneringHubLayout(id),
    setLayoutId: set,
  };
}

/** Hub Lab / test — samma store som planering. */
export function getStoredPlaneringHubLayoutId(): PlaneringHubLayoutId {
  return readLayoutId();
}
