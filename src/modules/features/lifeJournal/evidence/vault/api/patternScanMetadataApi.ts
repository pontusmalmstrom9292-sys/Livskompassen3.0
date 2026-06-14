import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '@/core/firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '@/core/types/firestore';

export type PatternScanMetadataRow = {
  id: string;
  sourceRef: string;
  techniques: string[];
  patternIds: string[];
  libraryVersion: string;
  scanLayer: 'REGEX' | 'DCAP';
};

export function buildTechniquesByLogId(
  rows: readonly PatternScanMetadataRow[],
): Map<string, string[]> {
  const map = new Map<string, Set<string>>();
  for (const row of rows) {
    const set = map.get(row.sourceRef) ?? new Set<string>();
    for (const t of row.techniques) set.add(t);
    map.set(row.sourceRef, set);
  }
  const out = new Map<string, string[]>();
  for (const [ref, set] of map) {
    out.set(ref, [...set].sort((a, b) => a.localeCompare(b, 'sv')));
  }
  return out;
}

export async function fetchPatternScanMetadata(uid: string): Promise<PatternScanMetadataRow[]> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.pattern_scan_metadata);
  const snap = await getDocs(query(ref, where('userId', '==', uid), limit(500)));
  return snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      sourceRef: String(data.sourceRef ?? ''),
      techniques: Array.isArray(data.techniques) ? data.techniques.map(String) : [],
      patternIds: Array.isArray(data.patternIds) ? data.patternIds.map(String) : [],
      libraryVersion: String(data.libraryVersion ?? ''),
      scanLayer: data.scanLayer === 'DCAP' ? 'DCAP' : 'REGEX',
    };
  });
}
