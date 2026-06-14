import { useEffect, useState } from 'react';
import { useStore } from '@/core/store';
import { getJournalEntries } from '@/core/firebase/firestore';
import { DagbokPage } from './DagbokPage';
import { JournalArchiveReadonly } from './JournalArchiveReadonly';
import type { MabraBridgeHub } from '../constants/mabraBridge';
import type { JournalEntry } from '../types/journal';

export type DagbokSuperVariant = 'reflektion' | 'forensic-readonly' | 'mabra-bridge';

export type DagbokSuperModuleProps = {
  variant: DagbokSuperVariant;
  /** MåBra superhub — projektkontext för lågenergi-bro (Fas 6D). */
  mabraBridgeHub?: MabraBridgeHub | null;
};

/**
 * Canonical router för Dagbok-ytor.
 * - reflektion: skrivflöde + arkiv (Hjärtat)
 * - forensic-readonly: journal-lista i Valv (PIN, WORM read-only)
 */
export function DagbokSuperModule({ variant, mabraBridgeHub }: DagbokSuperModuleProps) {
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

  if (variant === 'mabra-bridge') {
    return (
      <DagbokPage embedded mabraBridgeHub={mabraBridgeHub ?? null} mabraLowEnergyBridge />
    );
  }

  return <DagbokPage embedded />;
}
