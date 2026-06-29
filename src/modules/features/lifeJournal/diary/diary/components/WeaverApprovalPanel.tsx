import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { WeaverPendingRow } from '../api/weaverApprovalService';
import {
  approveWeaverMetadata,
  rejectWeaverMetadata,
  subscribeWeaverPendingForJournal,
} from '../api/weaverApprovalService';
import { normalizeStringArray } from '@/features/lifeJournal/evidence/vault/utils/normalizeVaultLog';
import {
  VAVAREN_APPROVAL_DISMISS,
  VAVAREN_APPROVAL_HINT,
  VAVAREN_APPROVAL_LOADING,
  VAVAREN_APPROVAL_SAVED,
  VAVAREN_APPROVAL_TITLE,
  VAVAREN_APPROVAL_APPROVE_BUTTON,
} from '@/features/lifeJournal/evidence/vault/constants/vavarenCopy';

type Props = {
  userId: string;
  journalEntryId: string;
  /** Vävaren körs bara när journalarkiv är upplåst */
  enabled?: boolean;
};

export function WeaverApprovalPanel({ userId, journalEntryId, enabled = true }: Props) {
  const [pending, setPending] = useState<WeaverPendingRow | null>(null);
  const [waiting, setWaiting] = useState(enabled);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<'approved' | 'dismissed' | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !userId || !journalEntryId) {
      setPending(null);
      setWaiting(false);
      return;
    }
    setWaiting(true);
    setDone(null);
    setError(null);
    const unsub = subscribeWeaverPendingForJournal(userId, journalEntryId, (row) => {
      setPending(row);
      if (row) setWaiting(false);
    });
    const timeout = window.setTimeout(() => setWaiting(false), 45000);
    return () => {
      unsub();
      window.clearTimeout(timeout);
    };
  }, [enabled, userId, journalEntryId]);

  if (!enabled) return null;

  if (done === 'approved') {
    return (
      <p className="mb-3 text-xs text-accent/90" role="status">
        {VAVAREN_APPROVAL_SAVED}
      </p>
    );
  }

  if (done === 'dismissed') {
    return (
      <p className="mb-3 text-xs text-text-dim" role="status">
        {VAVAREN_APPROVAL_DISMISS}
      </p>
    );
  }

  if (waiting && !pending) {
    return (
      <p className="mb-3 flex items-center gap-2 text-xs text-text-dim">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        {VAVAREN_APPROVAL_LOADING}
      </p>
    );
  }

  if (!pending) return null;

  const tags = pending.weaverTags;

  const handleApprove = async () => {
    setBusy(true);
    setError(null);
    try {
      await approveWeaverMetadata(pending.id);
      setDone('approved');
    } catch {
      setError('Kunde inte spara taggarna. Försök igen.');
    } finally {
      setBusy(false);
    }
  };

  const handleDismiss = async () => {
    setBusy(true);
    setError(null);
    try {
      await rejectWeaverMetadata(pending.id);
      setDone('dismissed');
    } catch {
      setError('Kunde inte avvisa förslaget.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mb-3 space-y-2 rounded-xl border border-gold/25 bg-gold/5 px-3 py-3">
      <p className="text-sm text-text-muted">{VAVAREN_APPROVAL_TITLE}</p>
      <p className="text-xs text-text-dim">{VAVAREN_APPROVAL_HINT}</p>
      {pending.sourceTextPreview ? (
        <p className="text-xs italic text-text-dim/90">«{pending.sourceTextPreview}…»</p>
      ) : null}
      <div className="flex flex-wrap gap-1">
        {normalizeStringArray(tags.emotions).map((e) => (
          <span
            key={`e-${e}`}
            className="rounded-full border border-indigo-400/25 px-2 py-0.5 text-[10px] text-indigo-200/90"
          >
            {e}
          </span>
        ))}
        {normalizeStringArray(tags.actors).map((a) => (
          <span
            key={`a-${a}`}
            className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-text-muted"
          >
            {a}
          </span>
        ))}
        {tags.threatLevel && tags.threatLevel !== 'none' && (
          <span className="rounded-full border border-amber-500/30 px-2 py-0.5 text-[10px] text-amber-200/90">
            hot: {tags.threatLevel}
          </span>
        )}
      </div>
      {error ? <p className="text-xs text-danger">{error}</p> : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => void handleApprove()}
          className="ds-btn ds-btn--accent text-xs disabled:opacity-50"
        >
          {VAVAREN_APPROVAL_APPROVE_BUTTON}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void handleDismiss()}
          className="ds-btn ds-btn--ghost text-xs disabled:opacity-50"
        >
          Hoppa över
        </button>
      </div>
    </div>
  );
}
