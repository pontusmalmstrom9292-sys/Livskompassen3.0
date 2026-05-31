import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { listenRoutineTemplates, seedRoutineTemplate } from './routineTemplatesApi';
import { ROUTINE_TEMPLATES, type RoutineTemplate } from './routineTemplates';
import type { LifeHubPresetId } from './lifeHubPresets';

export function useRoutineTemplates(presetId: LifeHubPresetId) {
  const user = useStore((s) => s.user);
  const [templates, setTemplates] = useState<RoutineTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const migratedRef = useRef(false);

  useEffect(() => {
    if (!user) {
      setTemplates([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = listenRoutineTemplates(user.uid, (rows) => {
      setTemplates(rows);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user || loading || migratedRef.current) return;
    if (templates.length > 0) {
      migratedRef.current = true;
      return;
    }
    migratedRef.current = true;
    void (async () => {
      try {
        for (const tpl of ROUTINE_TEMPLATES) {
          await seedRoutineTemplate(user.uid, tpl);
        }
      } catch {
        migratedRef.current = false;
      }
    })();
  }, [user, loading, templates.length]);

  const routines = user
    ? routinesForPresetFromList(templates.length > 0 ? templates : ROUTINE_TEMPLATES, presetId)
    : [];

  return { routines, loading, cloudSynced: user != null && templates.length > 0 };
}

function routinesForPresetFromList(list: RoutineTemplate[], presetId: LifeHubPresetId): RoutineTemplate[] {
  return list.filter(
    (r) => !r.presetIds || r.presetIds.length === 0 || r.presetIds.includes(presetId),
  );
}
