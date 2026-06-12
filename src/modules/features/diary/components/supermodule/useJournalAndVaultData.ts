import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/core/firebase/firestore';
import { useStore } from '@/core/store';

export function useJournalAndVaultData() {
  const user = useStore(s => s.user);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const userId = user.uid;
      
      // Hämta från Dagbok
      const journalQ = query(
        collection(db, 'journal'), 
        where('ownerId', '==', userId), 
        orderBy('createdAt', 'desc')
      );
      
      // Hämta från Valv
      const vaultQ = query(
        collection(db, 'reality_vault'), 
        where('ownerId', '==', userId), 
        orderBy('createdAt', 'desc')
      );

      const [journalSnap, vaultSnap] = await Promise.all([
        getDocs(journalQ), 
        getDocs(vaultQ)
      ]);

      const combined = [
        ...journalSnap.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'journal' })),
        ...vaultSnap.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'vault' }))
      ].sort((a: any, b: any) => {
        // Handle varying timestamp formats gracefully
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setData(combined);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  return { data, loading };
}
