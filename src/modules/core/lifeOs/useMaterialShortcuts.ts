import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../store';
import { getMaterialShortcuts, type MaterialPackHub } from './materialPacks';
import type { LifeHubPresetId } from './lifeHubPresets';

/** Reaktiv läsning av MaterialPack — lyssnar på spar-händelse från editorn. */
export function useMaterialShortcuts(presetId: LifeHubPresetId, hub: MaterialPackHub) {
  const user = useStore((s) => s.user);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const onUpdate = () => setVersion((v) => v + 1);
    window.addEventListener('material-pack-updated', onUpdate);
    return () => window.removeEventListener('material-pack-updated', onUpdate);
  }, []);

  return useMemo(
    () => getMaterialShortcuts(presetId, hub, user?.uid),
    [presetId, hub, user?.uid, version],
  );
}
