import type { LifeHubPresetId } from './lifeHubPresets';
import type { MaterialPackHub, MaterialShortcut } from './materialPacks';

const STORAGE_KEY = 'livskompassen_material_pack_overrides_v1';

export type MaterialPackOverrideKey = `${LifeHubPresetId}:${MaterialPackHub}`;

type StoredOverrides = Partial<Record<MaterialPackOverrideKey, MaterialShortcut[]>>;

function storageKey(userId: string): string {
  return `${STORAGE_KEY}:${userId}`;
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
  const overrides = loadMaterialPackOverrides(userId);
  overrides[overrideKey(presetId, hub)] = shortcuts.slice(0, 12);
  writeOverrides(userId, overrides);
}

export function clearMaterialPackOverride(
  userId: string,
  presetId: LifeHubPresetId,
  hub: MaterialPackHub,
): void {
  const overrides = loadMaterialPackOverrides(userId);
  delete overrides[overrideKey(presetId, hub)];
  writeOverrides(userId, overrides);
}
