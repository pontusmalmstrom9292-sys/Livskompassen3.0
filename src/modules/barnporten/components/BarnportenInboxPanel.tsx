import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, limit } from 'firebase/firestore';
import { db } from '../../core/firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '../../core/types/firestore';
import { useStore } from '../../core/store';
import { SaveAsEvidencePrompt } from '../../family/children/components/SaveAsEvidencePrompt';
import type { ChildAlias } from '../../family/children/constants';

type InboxRow = {
  id: string;
  childAlias: string;
  observation: string;
  category: string;
  createdAt?: string;
};

/** Förälder — inkorg från Barnporten (`category` barnporten*). */
export function BarnportenInboxPanel() {
  const user = useStore((s) => s.user);
  const [rows, setRows] = useState<InboxRow[]>([]);
  const [promoteId, setPromoteId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setRows([]);
      return;
    }
    const ref = collection(db, FIRESTORE_COLLECTIONS.children_logs);
    const q = query(ref, where('ownerId', '==', user.uid), limit(50));
    return onSnapshot(
      q,
      (snap) => {
        const all = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            childAlias: String(data.childAlias ?? ''),
            observation: String(data.observation ?? data.truth ?? ''),
            category: String(data.category ?? ''),
            createdAt:
              data.createdAt && typeof data.createdAt === 'object' && 'toDate' in data.createdAt
                ? (data.createdAt as { toDate: () => Date }).toDate().toISOString()
                : undefined,
          };
        });
        setRows(
          all
            .filter((r) => r.category.startsWith('barnporten') && !r.category.includes('privat'))
            .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? '')),
        );
      },
      () => setRows([]),
    );
  }, [user]);

  if (!user) return null;

  const active = rows.find((r) => r.id === promoteId);

  return (
    <div className="space-y-3 rounded-xl border border-white/10 p-3">
      <p className="text-[10px] uppercase tracking-widest text-text-dim">Barnporten-inkorg</p>
      {rows.length === 0 && (
        <p className="text-sm text-text-dim">Inget från Barnporten än.</p>
      )}
      {rows.map((row) => (
        <div key={row.id} className="elongated-module p-3 text-sm">
          <p className="text-xs text-text-dim">{row.childAlias}</p>
          <p className="mt-1 whitespace-pre-wrap text-text">{row.observation}</p>
          <button
            type="button"
            className="btn-pill--secondary mt-2 text-xs"
            onClick={() => setPromoteId(row.id)}
          >
            Granska i arkiv
          </button>
        </div>
      ))}
      {active && (
        <SaveAsEvidencePrompt
          userId={user.uid}
          childAlias={active.childAlias as ChildAlias}
          childrenLogId={active.id}
          observation={active.observation}
          category="barnporten"
          onDone={() => setPromoteId(null)}
        />
      )}
    </div>
  );
}
