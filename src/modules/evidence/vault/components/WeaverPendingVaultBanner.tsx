import { useEffect, useState } from 'react';
import type { WeaverPendingRow } from '../../../diary/diary/api/weaverApprovalService';
import {
  approveWeaverMetadata,
  rejectWeaverMetadata,
  subscribeWeaverPendingForUser,
} from '../../../diary/diary/api/weaverApprovalService';
import { normalizeStringArray } from '../utils/normalizeVaultLog';
import {
  VAVAREN_APPROVAL_HINT,
  VAVAREN_APPROVAL_TITLE,
  VAVAREN_PENDING_VAULT_INTRO,
} from '../constants/vavarenCopy';

type Props = {
  userId: string;
  onApproved?: () => void;
};

export function WeaverPendingVaultBanner({ userId, onApproved }: Props) {
  const [rows, setRows] = useState<WeaverPendingRow[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    return subscribeWeaverPendingForUser(userId, setRows);
  }, [userId]);

  if (rows.length === 0) return null;

  const handleApprove = async (pendingId: string) => {
    setBusyId(pendingId);
    try {
      await approveWeaverMetadata(pendingId);
      onApproved?.();
    } finally {
      setBusyId(null);
    }
  };

  const handleDismiss = async (pendingId: string) => {
    setBusyId(pendingId);
    try {
      await rejectWeaverMetadata(pendingId);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-text-dim">{VAVAREN_PENDING_VAULT_INTRO}</p>
      {rows.map((row) => (
        <div
          key={row.id}
          className="rounded-xl border border-gold/25 bg-gold/5 px-3 py-3 text-sm"
        >
          <p className="text-text-muted">{VAVAREN_APPROVAL_TITLE}</p>
          <p className="mt-1 text-xs text-text-dim">{VAVAREN_APPROVAL_HINT}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {normalizeStringArray(row.weaverTags.emotions).map((e) => (
              <span
                key={`${row.id}-e-${e}`}
                className="rounded-full border border-indigo-400/25 px-2 py-0.5 text-[10px] text-indigo-200/90"
              >
                {e}
              </span>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busyId === row.id}
              onClick={() => void handleApprove(row.id)}
              className="btn-pill--accent text-xs disabled:opacity-50"
            >
              Godkänn
            </button>
            <button
              type="button"
              disabled={busyId === row.id}
              onClick={() => void handleDismiss(row.id)}
              className="btn-pill--ghost text-xs disabled:opacity-50"
            >
              Hoppa över
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
