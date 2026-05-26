import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_LIFE_HUB_PRESET_ID,
  getLifeHubPreset,
  isLifeHubPresetId,
  type LifeHubPreset,
  type LifeHubPresetId,
} from './lifeHubPresets';

const STORAGE_KEY = 'livskompassen_active_life_hub_preset';

function readStoredPreset(): LifeHubPresetId {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (isLifeHubPresetId(raw)) return raw;
  } catch {
    /* ignore */
  }
  return DEFAULT_LIFE_HUB_PRESET_ID;
}

export function useLifeHubPreset(): {
  preset: LifeHubPreset;
  presetId: LifeHubPresetId;
  setPresetId: (id: LifeHubPresetId) => void;
} {
  const [presetId, setPresetIdState] = useState<LifeHubPresetId>(readStoredPreset);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, presetId);
    } catch {
      /* ignore */
    }
  }, [presetId]);

  const setPresetId = useCallback((id: LifeHubPresetId) => {
    setPresetIdState(id);
  }, []);

  return {
    preset: getLifeHubPreset(presetId),
    presetId,
    setPresetId,
  };
}
