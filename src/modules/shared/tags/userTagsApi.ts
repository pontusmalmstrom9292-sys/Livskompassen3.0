import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/core/firebase/firestore';
import { assertOfflineWriteAllowed } from '@/core/firebase/offlineWritePolicy';
import { FIRESTORE_COLLECTIONS, type UserTagRow } from '@/core/types/firestore';

type FirestoreUserTag = {
  userId: string;
  ownerId: string;
  label: string;
  slug: string;
  description?: string;
  createdAt?: unknown;
};

export function normalizeUserTagSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^#/, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_åäö-]/gi, '')
    .slice(0, 48);
}

export function userTagStorageId(slug: string): string {
  return `egen:${slug}`;
}

export function listenUserTags(userId: string, onRows: (tags: UserTagRow[]) => void): Unsubscribe {
  const ref = collection(db, FIRESTORE_COLLECTIONS.user_tags);
  const q = query(ref, where('ownerId', '==', userId));
  return onSnapshot(
    q,
    (snap) => {
      const rows = snap.docs.map((d) => {
        const data = d.data() as FirestoreUserTag;
        return {
          id: d.id,
          label: data.label,
          slug: data.slug,
          description: data.description,
        };
      });
      rows.sort((a, b) => a.label.localeCompare(b.label, 'sv'));
      onRows(rows);
    },
    () => onRows([]),
  );
}

export async function createUserTag(
  userId: string,
  input: { label: string; description?: string },
): Promise<UserTagRow> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.user_tags);
  const slug = normalizeUserTagSlug(input.label);
  if (!slug) {
    throw new Error('Taggen behöver minst ett giltigt tecken.');
  }

  const label = input.label.trim().replace(/^#/, '');
  const displayLabel = label.startsWith('#') ? label : `#${label}`;

  const ref = collection(db, FIRESTORE_COLLECTIONS.user_tags);
  const docRef = await addDoc(ref, {
    userId,
    ownerId: userId,
    label: displayLabel.slice(0, 48),
    slug,
    description: input.description?.trim().slice(0, 120) || null,
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    label: displayLabel.slice(0, 48),
    slug,
    description: input.description?.trim().slice(0, 120) || undefined,
  };
}
