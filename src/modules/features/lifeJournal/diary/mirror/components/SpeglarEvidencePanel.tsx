import { useState } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/design-system';
import { saveVaultLog } from '@/core/firebase/firestore';
import { uploadVaultEvidence } from '@/core/firebase/storage';
import { EvidenceMediaAttach } from '@/core/ui/EvidenceMediaAttach';
import type { MediaAttachment } from '@/core/media/mediaAttachment';

export type SavedSpeglarEvidence = {
  attachmentId: string;
  vaultDocId: string;
  evidenceUrl: string;
};

type SpeglarEvidencePanelProps = {
  userId: string | undefined;
  feeling: string;
  attachments: MediaAttachment[];
  savedIds: Set<string>;
  onAdd: (attachment: MediaAttachment) => void;
  onRemove: (id: string) => void;
  onCaptionChange: (id: string, caption: string) => void;
  onSaved: (saved: SavedSpeglarEvidence) => void;
};

export function SpeglarEvidencePanel({
  userId,
  feeling,
  attachments,
  savedIds,
  onAdd,
  onRemove,
  onCaptionChange,
  onSaved,
}: SpeglarEvidencePanelProps) {
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const saveToVault = async (attachment: MediaAttachment) => {
    if (!userId || savedIds.has(attachment.id)) return;
    setSavingId(attachment.id);
    setError(null);
    try {
      const evidenceUrl = await uploadVaultEvidence(userId, attachment.file);
      const caption = attachment.caption?.trim();
      const base =
        feeling.trim().slice(0, 800) ||
        `Bevis bifogat från Speglar (${attachment.file.name})`;
      const truth = caption ? `${base}\n\nBildtext: ${caption}` : base;
      const vaultDocId = await saveVaultLog(userId, {
        action: 'speglar_bevis',
        category: 'speglar',
        truth,
        entryType: 'simple',
        evidenceUrl,
      });
      onSaved({ attachmentId: attachment.id, vaultDocId, evidenceUrl });
    } catch {
      setError('Kunde inte spara till valvet. Försök igen.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-3">
      <EvidenceMediaAttach
        attachments={attachments}
        onAdd={onAdd}
        onRemove={onRemove}
        onCaptionChange={onCaptionChange}
        disabled={!userId}
        maxItems={2}
      />

      {!userId && (
        <p className="text-xs text-text-dim">Logga in för att låsa bilagor som bevis i arkivet.</p>
      )}

      {attachments.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-text-dim">
            Spara i arkiv (låst post)
          </p>
          {attachments.map((item) => {
            const saved = savedIds.has(item.id);
            return (
              <div
                key={`save-${item.id}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border-strong px-3 py-2"
              >
                <span className="truncate text-xs text-text-muted">{item.file.name}</span>
                {saved ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <ShieldCheck className="h-3 w-3" />
                    Sparat i valvet
                  </span>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => saveToVault(item)}
                    disabled={!userId || savingId === item.id}
                  >
                    {savingId === item.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      'Lås som bevis'
                    )}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {error && <p className="text-xs text-text-muted">{error}</p>}
    </div>
  );
}
