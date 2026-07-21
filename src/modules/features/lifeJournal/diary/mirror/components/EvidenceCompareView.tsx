import { ExternalLink } from 'lucide-react';
import type { VaultLog } from '@/core/types/firestore';
import type { MediaAttachment } from '@/core/media/mediaAttachment';
import type { SavedSpeglarEvidence } from './SpeglarEvidencePanel';

export interface VaultMatch {
  log: VaultLog & { id: string };
  score: number;
}

interface Props {
  feeling: string;
  vivirSummary: string;
  matches: VaultMatch[];
  vaultLocked: boolean;
  sessionAttachments?: MediaAttachment[];
  sessionSavedEvidence?: SavedSpeglarEvidence[];
}

export function EvidenceCompareView({
  feeling,
  vivirSummary,
  matches,
  vaultLocked,
  sessionAttachments = [],
  sessionSavedEvidence = [],
}: Props) {
  if (vaultLocked) {
    return (
      <div className="space-y-4">
        {sessionAttachments.length > 0 && (
          <SessionEvidenceList attachments={sessionAttachments} saved={sessionSavedEvidence} />
        )}
        <div className="glass-card border-accent/20 p-4 text-sm text-text-muted">
          <p className="text-text-dim">
            Valvet är låst. Håll Shield (Fyren) 3 sek → biometri → PIN för att jämföra mot sparade
            bevis.
          </p>
          {feeling.trim() && (
            <p className="mt-2 text-xs text-text-muted">
              Känslan du beskrev gäller ändå — bevisjämförelse väntar på upplåsning.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessionAttachments.length > 0 && (
        <SessionEvidenceList attachments={sessionAttachments} saved={sessionSavedEvidence} />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass-card border-accent/30 p-3">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-text-dim">Känsla + VIVIR</p>
          {feeling && <p className="mb-2 text-sm text-text-muted">{feeling}</p>}
          <p className="whitespace-pre-wrap text-sm text-text">{vivirSummary}</p>
        </div>

        <div className="glass-card p-3">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-text-dim">Bevisankare (arkiv)</p>
          {matches.length === 0 ? (
            <div className="space-y-2 text-sm text-text-dim">
              <p>Inga matchande poster i arkivet ännu.</p>
              <p className="text-xs text-text-muted">
                Det du känner är fortfarande giltigt — spara sms eller logg i arkivet när du vill ha ett
                ankare.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {matches.slice(0, 5).map(({ log, score }) => (
                <VaultItem key={(log as VaultLog & { id: string }).id ?? score} log={log} score={score} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function SessionEvidenceList({
  attachments,
  saved,
}: {
  attachments: MediaAttachment[];
  saved: SavedSpeglarEvidence[];
}) {
  const savedByAttachment = new Map(saved.map((item) => [item.attachmentId, item]));

  return (
    <div className="glass-card p-3">
      <p className="mb-2 text-[10px] uppercase tracking-widest text-text-dim">Bilagor denna session</p>
      <ul className="space-y-2">
        {attachments.map((item) => {
          const vault = savedByAttachment.get(item.id);
          return (
            <li key={item.id} className="rounded-lg border border-border-strong p-2">
              <div className="flex flex-wrap items-start gap-3">
                <SessionPreview attachment={item} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-text-muted">{item.file.name}</p>
                  {vault ? (
                    <a
                      href={vault.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex min-h-11 items-center gap-1 text-xs text-accent hover:text-accent-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
                    >
                      <ExternalLink className="h-3 w-3" aria-hidden />
                      Låsta poster i arkivet
                    </a>
                  ) : (
                    <p className="mt-1 text-[10px] text-text-dim">Endast i session — spara under ACT om du vill låsa.</p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SessionPreview({ attachment }: { attachment: MediaAttachment }) {
  if (attachment.kind === 'image') {
    return (
      <img src={attachment.previewUrl} alt="" className="h-16 w-16 rounded-md object-cover" />
    );
  }
  if (attachment.kind === 'audio') {
    return <audio controls src={attachment.previewUrl} className="max-w-full" preload="metadata" />;
  }
  if (attachment.kind === 'video') {
    return (
      <video
        src={attachment.previewUrl}
        className="h-16 max-w-[120px] rounded-md object-cover"
        controls
        playsInline
        preload="metadata"
      />
    );
  }
  return <p className="text-xs text-text-dim">Bifogad fil</p>;
}

function VaultItem({ log, score }: { log: VaultLog & { id: string }; score: number }) {
  return (
    <li className="rounded-lg border border-border-strong p-2 text-sm">
      <p className="text-[10px] uppercase tracking-widest text-text-dim">
        {log.category ?? 'bevis'} · {(log.createdAt ?? '').slice(0, 10)} · träff {score}
      </p>
      <p className="mt-1 text-text-muted">{log.truth}</p>
      {log.evidenceUrl && (
        <a
          href={log.evidenceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex min-h-11 items-center gap-1 text-xs text-accent hover:text-accent-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
        >
          <ExternalLink className="h-3 w-3" aria-hidden />
          Visa bifogat bevis
        </a>
      )}
    </li>
  );
}
