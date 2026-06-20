/** Kanon prefix för WORM dedup — speglar functions/src/lib/wormPayload.ts */
export type InboxSourceKind = 'drive' | 'storage' | 'widget';

export function buildInboxSourceRef(kind: InboxSourceKind | string, rawId: string): string {
  const id = rawId.trim().slice(0, 200);
  const k = kind.trim().slice(0, 32);
  if (!id) throw new Error('buildInboxSourceRef: rawId required');
  return `${k}:${id}`;
}

export function storageInboxSourceRef(storagePath: string): string {
  return buildInboxSourceRef('storage', storagePath);
}
