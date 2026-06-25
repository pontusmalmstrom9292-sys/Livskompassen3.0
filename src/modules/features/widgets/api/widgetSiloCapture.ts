import {
  saveChildrenLog,
  saveJournalEntry,
  saveVaultLog,
} from '@/core/firebase/firestore';
import { ensureVitHub, saveVitEntry } from '@/core/firebase/vitHubFirestore';
import { createPlanningTask } from '@/features/admin/planning/api/planningTasksApi';
import { submitInkastLite } from '@/modules/inkast/api/inkastService';
import type { WidgetSiloId } from '../config/widgetSiloConfig';

export async function saveWidgetTextCapture(
  userId: string,
  silo: WidgetSiloId,
  text: string,
  options?: { childAlias?: string },
): Promise<{ destination: WidgetSiloId; id?: string }> {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error('Tom text');
  }

  switch (silo) {
    case 'inkast': {
      await submitInkastLite({ text: trimmed, sourceModule: 'widget_anteckning' });
      return { destination: 'inkast' };
    }
    case 'dagbok': {
      const id = await saveJournalEntry(userId, {
        mood: 'neutral',
        text: trimmed,
        category: 'widget_capture',
        tags: ['widget'],
      });
      return { destination: 'dagbok', id };
    }
    case 'bevis': {
      const stamp = new Date().toISOString();
      const id = await saveVaultLog(userId, {
        action: 'widget_anteckning',
        category: 'snabblogg',
        truth: `ANTECKNING ${stamp}\n\n${trimmed}`,
        entryType: 'simple',
      });
      return { destination: 'bevis', id };
    }
    case 'barn': {
      const childAlias = options?.childAlias ?? 'Kasper';
      const id = await saveChildrenLog(userId, {
        childAlias,
        observation: trimmed,
        category: 'widget_snabb',
        action: 'livslogg',
        channel: 'widget',
      });
      return { destination: 'barn', id };
    }
    case 'mabra': {
      await ensureVitHub(userId, 'self_esteem');
      const id = await saveVitEntry(userId, {
        projectId: 'self_esteem',
        kind: 'memory',
        bankId: 'widget_note',
        content_class: 'REFLECTION',
        responseText: trimmed,
        zone: 'mabra',
        inputMode: 'widget',
      });
      return { destination: 'mabra', id };
    }
    case 'planering': {
      const title = trimmed.length > 120 ? `${trimmed.slice(0, 117)}…` : trimmed;
      const id = await createPlanningTask(userId, {
        title,
        status: 'todo',
        source: 'manual',
        summary: trimmed.length > 120 ? trimmed : undefined,
      });
      return { destination: 'planering', id };
    }
    default: {
      const _exhaustive: never = silo;
      throw new Error(`Okänt silo: ${String(_exhaustive)}`);
    }
  }
}
