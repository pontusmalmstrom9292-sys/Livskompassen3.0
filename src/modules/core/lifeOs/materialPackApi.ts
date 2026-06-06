import type { LifeHubPresetId } from './lifeHubPresets';
import type { MaterialPackHub, MaterialShortcut } from './materialPacks';

const STORAGE_KEY = 'livskompassen_material_pack_overrides_v1';
const META_STORAGE_KEY = 'livskompassen_material_pack_meta_v1';

export type MaterialPackOverrideKey = `${LifeHubPresetId}:${MaterialPackHub}`;

type StoredOverrides = Partial<Record<MaterialPackOverrideKey, MaterialShortcut[]>>;

function storageKey(userId: string): string {
  return `${STORAGE_KEY}:${userId}`;
}

function metaStorageKey(userId: string): string {
  return `${META_STORAGE_KEY}:${userId}`;
}

function overrideKey(presetId: LifeHubPresetId, hub: MaterialPackHub): MaterialPackOverrideKey {
  return `${presetId}:${hub}`;
}

function isMaterialShortcut(raw: unknown): raw is MaterialShortcut {
  return (
    !!raw &&
    typeof raw === 'object' &&
    typeof (raw as MaterialShortcut).label === 'string' &&
    !!(raw as MaterialShortcut).target &&
    typeof (raw as MaterialShortcut).target === 'object'
  );
}

function loadMeta(userId: string): Partial<Record<MaterialPackOverrideKey, number>> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(metaStorageKey(userId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as Partial<Record<MaterialPackOverrideKey, number>>;
  } catch {
    return {};
  }
}

function writeMetaEntry(userId: string, key: MaterialPackOverrideKey, updatedAtMs: number): void {
  if (typeof localStorage === 'undefined') return;
  const meta = loadMeta(userId);
  meta[key] = updatedAtMs;
  localStorage.setItem(metaStorageKey(userId), JSON.stringify(meta));
}

function deleteMetaEntry(userId: string, key: MaterialPackOverrideKey): void {
  if (typeof localStorage === 'undefined') return;
  const meta = loadMeta(userId);
  delete meta[key];
  localStorage.setItem(metaStorageKey(userId), JSON.stringify(meta));
}

export function getLocalUpdatedAtMs(userId: string, key: MaterialPackOverrideKey): number {
  return loadMeta(userId)[key] ?? 0;
}

export function loadMaterialPackOverrides(userId: string): StoredOverrides {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};
    const out: StoredOverrides = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (!Array.isArray(value)) continue;
      const shortcuts = value.filter(isMaterialShortcut).slice(0, 12);
      if (shortcuts.length > 0) {
        out[key as MaterialPackOverrideKey] = shortcuts;
      }
    }
    return out;
  } catch {
    return {};
  }
}

function writeOverrides(userId: string, overrides: StoredOverrides): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(storageKey(userId), JSON.stringify(overrides));
  window.dispatchEvent(new CustomEvent('material-pack-updated'));
}

export function getMaterialPackOverride(
  userId: string | undefined,
  presetId: LifeHubPresetId,
  hub: MaterialPackHub,
): MaterialShortcut[] | null {
  if (!userId) return null;
  const overrides = loadMaterialPackOverrides(userId);
  return overrides[overrideKey(presetId, hub)] ?? null;
}

export function saveMaterialPackOverride(
  userId: string,
  presetId: LifeHubPresetId,
  hub: MaterialPackHub,
  shortcuts: MaterialShortcut[],
): void {
  const key = overrideKey(presetId, hub);
  const overrides = loadMaterialPackOverrides(userId);
  overrides[key] = shortcuts.slice(0, 12);
  const now = Date.now();
  writeMetaEntry(userId, key, now);
  writeOverrides(userId, overrides);

  void import('./materialPackFirestoreApi').then(({ upsertMaterialPackOverrideFirestore }) =>
    upsertMaterialPackOverrideFirestore(userId, presetId, hub, shortcuts).catch(() => {
      /* offline — localStorage primary; push on reconnect */
    }),
  );
}

export function clearMaterialPackOverride(
  userId: string,
  presetId: LifeHubPresetId,
  hub: MaterialPackHub,
): void {
  const key = overrideKey(presetId, hub);
  const overrides = loadMaterialPackOverrides(userId);
  delete overrides[key];
  deleteMetaEntry(userId, key);
  writeOverrides(userId, overrides);

  void import('./materialPackFirestoreApi').then(({ deleteMaterialPackOverrideFirestore }) =>
    deleteMaterialPackOverrideFirestore(userId, presetId, hub).catch(() => {
      /* offline */
    }),
  );
}

/** Firestore listener — apply remote if newer than local. */
export function applyRemoteMaterialPackOverride(
  userId: string,
  key: MaterialPackOverrideKey,
  shortcuts: MaterialShortcut[],
  updatedAtMs: number,
): void {
  const localMs = getLocalUpdatedAtMs(userId, key);
  if (updatedAtMs > 0 && localMs > updatedAtMs) return;

  const overrides = loadMaterialPackOverrides(userId);
  overrides[key] = shortcuts.slice(0, 12);
  if (updatedAtMs > 0) {
    writeMetaEntry(userId, key, updatedAtMs);
  }
  writeOverrides(userId, overrides);
}

/** Zero Footprint — rensa lokal cache vid utloggning (molnet behålls). */
export function clearMaterialPackLocalCache(userId: string): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(storageKey(userId));
  localStorage.removeItem(metaStorageKey(userId));
  window.dispatchEvent(new CustomEvent('material-pack-updated'));
}
