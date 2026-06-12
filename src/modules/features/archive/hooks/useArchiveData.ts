import { useState, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/core/firebase/firestore';
import { useStore } from '@/core/store';
import { startOfMonth, endOfMonth } from 'date-fns';

export interface ArchiveEntry {
  id: string;
  type: 'journal' | 'vault';
  createdAt: { seconds: number; nanoseconds: number };
  content?: string;
  transcription?: string;
  emotion?: string;
  tags?: string[];
  // + any other fields
  [key: string]: any;
}

export function useArchiveData() {
  const user = useStore(s => s.user);
  const [data, setData] = useState<ArchiveEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cash för att inte hämta samma månad flera gånger under samma session
  const [loadedMonths, setLoadedMonths] = useState<Set<string>>(new Set());

  const loadMonth = useCallback(async (date: Date) => {
    if (!user) return;

    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    if (loadedMonths.has(monthKey)) {
      return; // Redan hämtad
    }

    setLoading(true);
    setError(null);

    try {
      const start = startOfMonth(date);
      const end = endOfMonth(date);

      const startTs = Timestamp.fromDate(start);
      const endTs = Timestamp.fromDate(end);

      const userId = user.uid;

      // Hämta från Dagbok (inom månaden)
      const journalQ = query(
        collection(db, 'journal'),
        where('ownerId', '==', userId),
        where('createdAt', '>=', startTs),
        where('createdAt', '<=', endTs),
        orderBy('createdAt', 'desc')
      );

      // Hämta från Valv (inom månaden)
      const vaultQ = query(
        collection(db, 'reality_vault'),
        where('ownerId', '==', userId),
        where('createdAt', '>=', startTs),
        where('createdAt', '<=', endTs),
        orderBy('createdAt', 'desc')
      );

      const [journalSnap, vaultSnap] = await Promise.all([
        getDocs(journalQ),
        getDocs(vaultQ)
      ]);

      const newEntries: ArchiveEntry[] = [
        ...journalSnap.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'journal' } as ArchiveEntry)),
        ...vaultSnap.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'vault' } as ArchiveEntry))
      ];

      setData(prev => {
        // Slå ihop och sortera om
        const combined = [...prev, ...newEntries];
        // Filtrera bort eventuella dubbletter om datan överlappar på något sätt
        const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
        
        return unique.sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });
      });

      setLoadedMonths(prev => new Set(prev).add(monthKey));
    } catch (err: any) {
      console.error("Error loading archive month:", err);
      setError(err.message || 'Kunde inte hämta arkivdata.');
    } finally {
      setLoading(false);
    }
  }, [user, loadedMonths]);

  return { data, loading, error, loadMonth };
}
