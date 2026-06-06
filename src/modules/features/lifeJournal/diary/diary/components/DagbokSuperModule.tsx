import { useEffect, useState } from 'react';
import { useStore } from '@/core/store';
import { getJournalEntries } from '@/core/firebase/firestore';
import { DagbokPage } from './DagbokPage';
import { JournalArchiveReadonly } from './JournalArchiveReadonly';
import type { JournalEntry } from '../types/journal';

export type DagbokSuperVariant = 'reflektion' | 'forensic-readonly';

export type DagbokSuperModuleProps = {
  variant: DagbokSuperVariant;
};

/**
 * Canonical router för Dagbok-ytor.
 * - reflektion: skrivflöde + arkiv (Hjärtat)
 * - forensic-readonly: journal-lista i Valv (PIN, WORM read-only)
 */
export function DagbokSuperModule({ variant }: DagbokSuperModuleProps) {
  const user = useStore((s) => s.user);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    if (variant !== 'forensic-readonly' || !user) return;
    getJournalEntries(user.uid)
      .then((rows) => setEntries(rows as JournalEntry[]))
      .catch(() => setEntries([]));
  }, [variant, user]);

  if (variant === 'forensic-readonly') {
    return <JournalArchiveReadonly entries={entries} />;
  }

  return <DagbokPage embedded />;
}
