import { httpsCallable } from 'firebase/functions';
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/core/firebase/firestore';
import { functions } from '@/core/firebase/init';
import { withVaultSessionPayload } from '@/core/auth/vaultServerSession';
import type { WeaverTags } from '@/core/types/firestore';

export type WeaverPendingRow = {
  id: string;
  journalEntryId: string;
  sourceMood: string;
  sourceTextPreview: string;
  truth: string;
  weaverTags: WeaverTags;
  status: 'pending';
};

const approveCallable = httpsCallable<{ pendingId: string }, { vaultMetadataId: string }>(
  functions,
  'approveWeaverMetadata',
);

const rejectCallable = httpsCallable<{ pendingId: string }, { status: string }>(
  functions,
  'rejectWeaverMetadata',
);

export function subscribeWeaverPendingForJournal(
  userId: string,
  journalEntryId: string,
  onChange: (row: WeaverPendingRow | null) => void,
): Unsubscribe {
  const q = query(
    collection(db, 'weaver_pending'),
    where('ownerId', '==', userId),
    where('journalEntryId', '==', journalEntryId),
    where('status', '==', 'pending'),
    limit(1),
  );

  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty) {
        onChange(null);
        return;
      }
      const doc = snap.docs[0];
      onChange({ id: doc.id, ...(doc.data() as Omit<WeaverPendingRow, 'id'>) });
    },
    () => onChange(null),
  );
}

export function subscribeWeaverPendingForUser(
  userId: string,
  onChange: (rows: WeaverPendingRow[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, 'weaver_pending'),
    where('ownerId', '==', userId),
    where('status', '==', 'pending'),
    limit(10),
  );

  return onSnapshot(
    q,
    (snap) => {
      onChange(
        snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<WeaverPendingRow, 'id'>) })),
      );
    },
    () => onChange([]),
  );
}

export async function approveWeaverMetadata(pendingId: string): Promise<string> {
  const result = await approveCallable(withVaultSessionPayload({ pendingId }));
  return result.data.vaultMetadataId;
}

export async function rejectWeaverMetadata(pendingId: string): Promise<void> {
  await rejectCallable({ pendingId });
}
