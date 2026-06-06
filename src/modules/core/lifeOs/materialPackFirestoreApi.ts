import {
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { assertOfflineWriteAllowed } from '../firebase/offlineWritePolicy';
import { FIRESTORE_COLLECTIONS } from '../types/firestore';
import type { LifeHubPresetId } from './lifeHubPresets';
import {
  applyRemoteMaterialPackOverride,
  getLocalUpdatedAtMs,
  loadMaterialPackOverrides,
  type MaterialPackOverrideKey,
} from './materialPackApi';
import type { MaterialPackHub, MaterialShortcut } from './materialPacks';

const COL = FIRESTORE_COLLECTIONS.material_pack_overrides;

type FirestoreMaterialPackOverride = {
  userId: string;
  ownerId: string;
  presetId: LifeHubPresetId;
  hub: MaterialPackHub;
  shortcuts: MaterialShortcut[];
  updatedAt?: Timestamp;
};

function docIdFor(userId: string, presetId: LifeHubPresetId, hub: MaterialPackHub): string {
  return `${userId}__${presetId}__${hub}`;
}

function parseShortcut(raw: unknown): MaterialShortcut | null {
  if (!raw || typeof raw !== 'object') return null;
  const row = raw as Record<string, unknown>;
  if (typeof row.label !== 'string' || !row.target || typeof row.target !== 'object') return null;
  return {
    label: row.label.slice(0, 80),
    target: row.target as MaterialShortcut['target'],
    bankRef: typeof row.bankRef === 'string' ? row.bankRef.slice(0, 120) : undefined,
  };
}

function parseDoc(
  data: FirestoreMaterialPackOverride,
): { key: MaterialPackOverrideKey; shortcuts: MaterialShortcut[]; updatedAtMs: number } | null {
  const key = `${data.presetId}:${data.hub}` as MaterialPackOverrideKey;
  const shortcuts = (data.shortcuts ?? [])
    .map(parseShortcut)
    .filter((s): s is MaterialShortcut => !!s)
    .slice(0, 12);
  if (shortcuts.length === 0) return null;
  const updatedAtMs = data.updatedAt?.toMillis?.() ?? 0;
  if (!data.presetId || !data.hub) return null;
  return { key, shortcuts, updatedAtMs };
}

export async function upsertMaterialPackOverrideFirestore(
  userId: string,
  presetId: LifeHubPresetId,
  hub: MaterialPackHub,
  shortcuts: MaterialShortcut[],
): Promise<void> {
  assertOfflineWriteAllowed(COL);
  const ref = doc(db, COL, docIdFor(userId, presetId, hub));
  await setDoc(ref, {
    userId,
    ownerId: userId,
    presetId,
    hub,
    shortcuts: shortcuts.slice(0, 12),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteMaterialPackOverrideFirestore(
  userId: string,
  presetId: LifeHubPresetId,
  hub: MaterialPackHub,
): Promise<void> {
  assertOfflineWriteAllowed(COL);
  await deleteDoc(doc(db, COL, docIdFor(userId, presetId, hub)));
}

/** Push local-only overrides to Firestore (login / reconnect). */
export async function pushUnsyncedMaterialPackOverrides(userId: string): Promise<void> {
  const local = loadMaterialPackOverrides(userId);
  const ref = collection(db, COL);
  const snap = await getDocs(query(ref, where('ownerId', '==', userId)));
  const remoteByKey = new Map<MaterialPackOverrideKey, number>();
  for (const d of snap.docs) {
    const parsed = parseDoc(d.data() as FirestoreMaterialPackOverride);
    if (parsed) remoteByKey.set(parsed.key, parsed.updatedAtMs);
  }

  await Promise.all(
    (Object.entries(local) as [MaterialPackOverrideKey, MaterialShortcut[]][]).map(
      async ([key, shortcuts]) => {
        if (!shortcuts?.length) return;
        const [presetId, hub] = key.split(':') as [LifeHubPresetId, MaterialPackHub];
        const remoteMs = remoteByKey.get(key) ?? 0;
        const localMs = getLocalUpdatedAtMs(userId, key);
        if (remoteMs === 0 || localMs > remoteMs) {
          await upsertMaterialPackOverrideFirestore(userId, presetId, hub, shortcuts);
        }
      },
    ),
  );
}

export function listenMaterialPackOverrides(userId: string): Unsubscribe {
  const ref = collection(db, COL);
  const q = query(ref, where('ownerId', '==', userId));
  return onSnapshot(
    q,
    (snap) => {
      for (const d of snap.docs) {
        const parsed = parseDoc(d.data() as FirestoreMaterialPackOverride);
        if (!parsed) continue;
        applyRemoteMaterialPackOverride(userId, parsed.key, parsed.shortcuts, parsed.updatedAtMs);
      }
    },
    () => {
      /* offline — localStorage remains source until reconnect */
    },
  );
}
