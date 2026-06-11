import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { journalWovenToKampspar } from '@/features/lifeJournal/diary/diary/api/journalWovenService';
import { VALV_KUNSKAP_INBOX_LINK } from '../api/inkastService';
import type { SubmitInkastLiteItemResult } from '../api/inkastService';

export type InkastDagbokWeavePayload = {
  journalEntryId: string;
  text: string;
  mood: string;
};

/** Props efter G10 persist till journal — G7 opt-in only, aldrig auto-weave. */
export function inkastDagbokWeaveProps(
  item: SubmitInkastLiteItemResult,
): InkastDagbokWeavePayload | null {
  if (item.action !== 'persisted' || item.collection !== 'journal' || !item.docId) {
    return null;
  }
  const text =
    item.classification.summary?.trim() ||
    'Reflektion från inkast (kort rad i Minne).';
  return {
    journalEntryId: item.docId,
    text,
    mood: 'neutral',
  };
}

/** HITL-bekräftelse → journal (analysisExcerpt ger bättre weave-text än summary). */
export function inboxDagbokWeaveProps(input: {
  collection: string;
  docId: string;
  summary: string;
  analysisExcerpt?: string;
}): InkastDagbokWeavePayload | null {
  if (input.collection !== 'journal' || !input.docId) return null;
  const excerpt = input.analysisExcerpt?.trim();
  const text = (excerpt && excerpt.length >= 12 ? excerpt : input.summary).slice(0, 6000);
  return {
    journalEntryId: input.docId,
    text: text.trim() || 'Reflektion från inkast.',
    mood: 'neutral',
  };
}

type Props = InkastDagbokWeavePayload & {
  onDone: () => void;
};

/** Valfri G7-bro efter inkast → Dagbok — samma opt-in som ConfirmStep i dagboksflödet. */
export function InkastDagbokWeaveBridge({ journalEntryId, text, mood, onDone }: Props) {
  const [woven, setWoven] = useState(false);

  const handleWeave = () => {
    journalWovenToKampspar({ journalEntryId, mood, text });
    setWoven(true);
  };

  if (woven) {
    return (
      <div className="mt-4 space-y-2 rounded-xl border border-success/30 bg-success/5 px-4 py-3">
        <p className="text-sm text-success">Kort rad sparad i Minne (opt-in).</p>
        <Link
          to={{ pathname: VALV_KUNSKAP_INBOX_LINK.pathname, search: VALV_KUNSKAP_INBOX_LINK.search }}
          className="btn-pill--ghost text-sm"
        >
          Öppna Kunskapsbank (Valv)
        </Link>
        <button type="button" onClick={onDone} className="btn-pill--secondary mt-2 text-sm">
          Klar
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2 rounded-xl border border-border/40 bg-surface-2/60 px-4 py-3">
      <p className="flex items-center gap-2 text-sm text-text-muted">
        <BookOpen className="h-4 w-4 text-accent" aria-hidden />
        Vill du spara en kort rad i Minne också?
      </p>
      <p className="text-xs text-text-dim">
        Valfritt — dagboksposten är redan sparad. Inget vävs utan att du väljer explicit.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button type="button" className="btn-pill--secondary text-sm" onClick={handleWeave}>
          Ja, spara i Minne
        </button>
        <button type="button" className="btn-pill--ghost text-sm" onClick={onDone}>
          Nej, bara dagbok
        </button>
      </div>
    </div>
  );
}
