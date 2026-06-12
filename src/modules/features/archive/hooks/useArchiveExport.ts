import { useState, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/core/firebase/firestore';
import { useStore } from '@/core/store';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

export function useArchiveExport() {
  const user = useStore(s => s.user);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportArchive = useCallback(async () => {
    if (!user) {
      setExportError("Du måste vara inloggad för att exportera arkivet.");
      return;
    }

    setIsExporting(true);
    setExportError(null);

    try {
      const userId = user.uid;

      // Hämta ALLA Dagboksposter för användaren
      const journalQ = query(
        collection(db, 'journal'),
        where('ownerId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      // Hämta ALLA Valvposter för användaren
      const vaultQ = query(
        collection(db, 'reality_vault'),
        where('ownerId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const [journalSnap, vaultSnap] = await Promise.all([
        getDocs(journalQ),
        getDocs(vaultQ)
      ]);

      const allEntries = [
        ...journalSnap.docs.map(doc => {
          const data = doc.data();
          return { ...data, id: doc.id, _type: 'Dagbok' } as any;
        }),
        ...vaultSnap.docs.map(doc => {
          const data = doc.data();
          return { ...data, id: doc.id, _type: 'Valv' } as any;
        })
      ];

      // Sortera kronologiskt, äldst först för läsbarhet i textfilen
      allEntries.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeA - timeB; // Ascending order
      });

      if (allEntries.length === 0) {
        setExportError("Ditt arkiv är tomt, det finns inget att exportera.");
        setIsExporting(false);
        return;
      }

      // Bygg textinnehållet
      let textContent = `==================================================\n`;
      textContent += `LIVSKOMPASSEN ARKIV\n`;
      textContent += `Genererad: ${format(new Date(), 'yyyy-MM-dd HH:mm', { locale: sv })}\n`;
      textContent += `==================================================\n\n`;

      allEntries.forEach(entry => {
        const dateStr = entry.createdAt?.seconds 
          ? format(new Date(entry.createdAt.seconds * 1000), 'yyyy-MM-dd HH:mm', { locale: sv })
          : 'Okänt datum';
        
        textContent += `--------------------------------------------------\n`;
        textContent += `[${dateStr}] - ${entry._type}\n`;
        if (entry.emotion) {
          textContent += `Känsla: ${entry.emotion}\n`;
        }
        textContent += `--------------------------------------------------\n`;
        
        if (entry.content) {
          textContent += `${entry.content}\n\n`;
        } else if (entry.transcription) {
          textContent += `${entry.transcription}\n\n`;
        } else {
          textContent += `(Inget textinnehåll)\n\n`;
        }
      });

      // Skapa en Blob och ladda ner filen
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `Livskompassen_Arkiv_${format(new Date(), 'yyyy-MM-dd')}.txt`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err: any) {
      console.error("Error exporting archive data:", err);
      setExportError(err.message || 'Ett oväntat fel inträffade vid exporten.');
    } finally {
      setIsExporting(false);
    }
  }, [user]);

  return { exportArchive, isExporting, exportError };
}
