import type { PlaneringPinLayoutId, PlaneringPinTargetId } from './planningPinRegistry';

export type PlaneringPinContent =
  | { kind: 'list'; listId: string }
  | { kind: 'note'; body: string };

export type PlaneringModulePin = {
  id: string;
  title: string;
  targetId: PlaneringPinTargetId;
  /** t.ex. barnalias för familjen.barnfokus */
  contextKey?: string;
  layout: PlaneringPinLayoutId;
  content: PlaneringPinContent;
  updatedAt: string;
};

export const PLANNING_PINS_CHANGED = 'livskompassen:planning-pins-changed';

const STORAGE_KEY = 'livskompassen_planning_module_pins_v1';
const LEGACY_HOME_KEY = 'livskompassen_home_planering_pin';

function newId(): string {
  return `pin-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function emitChange(): void {
  try {
    window.dispatchEvent(new Event(PLANNING_PINS_CHANGED));
  } catch {
    /* SSR */
  }
}

function readRaw(): PlaneringModulePin[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return migrateLegacyHomePin([]);
    const parsed = JSON.parse(raw) as PlaneringModulePin[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRaw(pins: PlaneringModulePin[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pins));
    emitChange();
  } catch {
    /* quota */
  }
}

function migrateLegacyHomePin(pins: PlaneringModulePin[]): PlaneringModulePin[] {
  try {
    const raw = localStorage.getItem(LEGACY_HOME_KEY);
    if (!raw) return pins;
    const legacy = JSON.parse(raw) as { listId?: string; title?: string };
    if (!legacy?.listId || !legacy?.title) return pins;
    const exists = pins.some(
      (p) => p.content.kind === 'list' && p.content.listId === legacy.listId,
    );
    if (exists) return pins;
    const migrated: PlaneringModulePin = {
      id: newId(),
      title: legacy.title,
      targetId: 'hem.brass.below-grid',
      layout: 'tile',
      content: { kind: 'list', listId: legacy.listId },
      updatedAt: new Date().toISOString(),
    };
    const next = [...pins, migrated];
    writeRaw(next);
    localStorage.removeItem(LEGACY_HOME_KEY);
    return next;
  } catch {
    return pins;
  }
}

export function listPlanningModulePins(filter?: {
  targetId?: string;
  contextKey?: string;
  listId?: string;
}): PlaneringModulePin[] {
  let pins = migrateLegacyHomePin(readRaw());
  if (filter?.targetId) {
    pins = pins.filter((p) => p.targetId === filter.targetId);
    if (filter.contextKey !== undefined) {
      pins = pins.filter((p) => (p.contextKey ?? '') === filter.contextKey);
    }
  }
  if (filter?.listId) {
    pins = pins.filter(
      (p) => p.content.kind === 'list' && p.content.listId === filter.listId,
    );
  }
  return pins.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function addPlanningModulePin(input: Omit<PlaneringModulePin, 'id' | 'updatedAt'>): PlaneringModulePin {
  const pin: PlaneringModulePin = {
    ...input,
    id: newId(),
    updatedAt: new Date().toISOString(),
  };
  writeRaw([pin, ...readRaw()]);
  return pin;
}

export function removePlanningModulePin(pinId: string): void {
  writeRaw(readRaw().filter((p) => p.id !== pinId));
}

export function updatePlanningModulePin(
  pinId: string,
  patch: Partial<Pick<PlaneringModulePin, 'title' | 'layout' | 'content' | 'contextKey'>>,
): void {
  const next = readRaw().map((p) =>
    p.id === pinId ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p,
  );
  writeRaw(next);
}

/** Bakåtkompat — första hem-pin om list. */
export function getLegacyHomeListPin(): { listId: string; title: string } | null {
  const hem = listPlanningModulePins({ targetId: 'hem.brass.below-grid' }).find(
    (p) => p.content.kind === 'list',
  );
  if (!hem || hem.content.kind !== 'list') return null;
  return { listId: hem.content.listId, title: hem.title };
}
