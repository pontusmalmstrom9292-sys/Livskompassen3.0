import { saveChildrenLog } from '@/core/firebase/firestore';
import {
  enqueueBarnportenLog,
  listPendingBarnportenLogs,
  removePendingBarnportenLog,
} from './barnportenOfflineQueue';

export type BarnportenLogKind = 'message' | 'mood' | 'private' | 'quick_widget';

const CATEGORY_BY_KIND: Record<BarnportenLogKind, string> = {
  message: 'barnporten',
  mood: 'barnporten',
  private: 'barnporten_privat',
  quick_widget: 'barnporten_widget',
};

export type SaveBarnportenLogParams = {
  childAlias: string;
  observation: string;
  kind: BarnportenLogKind;
  contentType?: 'text' | 'voice' | 'mood' | 'step';
  /** Allvarligt — flaggar vault_candidate för förälder. */
  urgent?: boolean;
};

/** Barnporten silo 3 — authorRole child, ingen Valv auto-promote. */
export async function saveBarnportenLog(userId: string, params: SaveBarnportenLogParams) {
  if (!navigator.onLine) {
    await enqueueBarnportenLog({ userId, ...params });
    return { queued: true as const };
  }

  const id = await writeBarnportenLog(userId, params);
  return { queued: false as const, id };
}

async function writeBarnportenLog(userId: string, params: SaveBarnportenLogParams): Promise<string> {
  let visibility: 'private_child' | 'parent' | 'vault_candidate' = 'parent';
  if (params.kind === 'private') visibility = 'private_child';
  else if (params.urgent) visibility = 'vault_candidate';

  return saveChildrenLog(userId, {
    childAlias: params.childAlias,
    observation: params.observation,
    category: CATEGORY_BY_KIND[params.kind],
    action: 'livslogg',
    authorRole: 'child',
    channel: 'barnporten',
    visibility,
    contentType: params.contentType ?? 'text',
  });
}

/** Töm offline-kö när nät finns. */
export async function flushBarnportenOfflineQueue(userId: string): Promise<number> {
  if (!navigator.onLine) return 0;
  const pending = await listPendingBarnportenLogs(userId);
  let flushed = 0;
  for (const row of pending) {
    try {
      await writeBarnportenLog(row.userId, {
        childAlias: row.childAlias,
        observation: row.observation,
        kind: row.kind,
        contentType: row.contentType,
        urgent: row.urgent,
      });
      await removePendingBarnportenLog(row.id);
      flushed += 1;
    } catch {
      break;
    }
  }
  return flushed;
}
