import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield } from 'lucide-react';
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
  visibility?: string;
  createdAt?: string;
};

/** Förälder — §7b tvåkorts Inkorg → Valv (HITL). */
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
            visibility: data.visibility != null ? String(data.visibility) : undefined,
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

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-text-dim">Barnporten · Inkorg → Valv</p>
        <p className="mt-1 text-xs italic text-text-dim">Skapa trygghet. Bygg tillit.</p>
      </div>

      {rows.length === 0 && <p className="text-sm text-text-dim">Inget från Barnporten än.</p>}

      {rows.map((row) => (
        <div
          key={row.id}
          className="grid items-stretch gap-2 md:grid-cols-[1fr_auto_1fr] md:gap-3"
          aria-label={`Meddelande från ${row.childAlias}`}
        >
          <div className="elongated-module space-y-2 border border-white/10 p-3">
            <p className="text-[10px] uppercase tracking-widest text-text-dim">Inkorg</p>
            <p className="text-xs text-text-dim">{row.childAlias}</p>
            <p className="whitespace-pre-wrap text-sm text-text">{row.observation}</p>
            {row.visibility === 'vault_candidate' && (
              <p className="text-xs font-medium text-accent">Granska i Valv?</p>
            )}
            <button
              type="button"
              className="btn-pill--secondary text-xs"
              onClick={() => setPromoteId(row.id)}
            >
              Granska i arkiv
            </button>
          </div>

          <div className="hidden items-center justify-center text-accent md:flex" aria-hidden>
            <ArrowRight className="h-5 w-5" />
          </div>

          <div className="elongated-module space-y-2 border border-accent/25 p-3">
            <p className="text-[10px] uppercase tracking-widest text-accent/80">Valv</p>
            <p className="text-xs text-text-dim">Klar för långtidslagring</p>
            {promoteId === row.id ? (
              <>
                <p className="flex items-start gap-1.5 text-xs text-text-muted">
                  <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent/80" aria-hidden />
                  Human-In-The-Loop aktiverad. En vuxen granskar innan lagring.
                </p>
                <SaveAsEvidencePrompt
                  userId={user.uid}
                  childAlias={row.childAlias as ChildAlias}
                  childrenLogId={row.id}
                  observation={row.observation}
                  category="barnporten"
                  onDone={() => setPromoteId(null)}
                />
                <Link to="/dagbok?tab=bevis" className="text-xs text-accent hover:underline">
                  Granska i Valv
                </Link>
              </>
            ) : (
              <button
                type="button"
                className="btn-pill--accent text-xs"
                onClick={() => setPromoteId(row.id)}
              >
                Flytta till Valv (HITL)
              </button>
            )}
          </div>
        </div>
      ))}

    </div>
  );
}
