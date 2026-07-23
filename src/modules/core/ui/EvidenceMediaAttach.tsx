import { useRef } from 'react';
import { Camera, FileUp, ImagePlus, Loader2, Mic, MicOff, Trash2, Video } from 'lucide-react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { createMediaAttachment, type MediaAttachment } from '../media/mediaAttachment';
import { Button } from '@/design-system';

type EvidenceMediaAttachProps = {
  attachments: MediaAttachment[];
  onAdd: (attachment: MediaAttachment) => void;
  onRemove: (id: string) => void;
  onCaptionChange?: (id: string, caption: string) => void;
  disabled?: boolean;
  maxItems?: number;
};

const IMAGE_ACCEPT = 'image/png,image/jpeg,image/webp,image/gif,image/heic,image/heif';
const MEDIA_ACCEPT = `${IMAGE_ACCEPT},audio/*,video/*,application/pdf`;

export function EvidenceMediaAttach({
  attachments,
  onAdd,
  onRemove,
  onCaptionChange,
  disabled = false,
  maxItems = 2,
}: EvidenceMediaAttachProps) {
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const mediaRef = useRef<HTMLInputElement>(null);

  const atLimit = attachments.length >= maxItems;

  const addFile = (file: File | undefined) => {
    if (!file || disabled || atLimit) return;
    onAdd(createMediaAttachment(file));
  };

  const { isRecording, error: recordError, start, stop, supported: recordSupported } =
    useAudioRecorder({
      onRecorded: (file) => addFile(file),
    });

  const pickGallery = () => galleryRef.current?.click();
  const pickCamera = () => cameraRef.current?.click();
  const pickMedia = () => mediaRef.current?.click();

  return (
    <div className="glass-card space-y-3 p-3">
      <p className="text-[10px] uppercase tracking-widest text-text-muted">Bifoga bevis (valfritt)</p>
      <p className="text-xs text-text-muted">
        Skärmdump, foto, ljud eller video — max {maxItems} filer. Valfri bildtext per fil.
      </p>

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={pickGallery} disabled={disabled || atLimit} variant="ghost" className="--ghost min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
          <ImagePlus className="h-4 w-4" />
          Fil / skärmdump
        </Button>
        <Button type="button" onClick={pickCamera} disabled={disabled || atLimit} variant="ghost" className="--ghost min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
          <Camera className="h-4 w-4" />
          Ta foto
        </Button>
        <Button type="button" onClick={pickMedia} disabled={disabled || atLimit} variant="ghost" className="--ghost min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
          <Video className="h-4 w-4" />
          Ljud / video
        </Button>
        {recordSupported && (
          <Button type="button" onClick={isRecording ? stop : start} disabled={disabled || atLimit} variant="ghost" className="--ghost min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isRecording ? 'Stoppa inspelning' : 'Spela in ljud'}
          </Button>
        )}
      </div>

      <input
        ref={galleryRef}
        type="file"
        accept={IMAGE_ACCEPT}
        className="sr-only"
        onChange={(e) => {
          addFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => {
          addFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      <input
        ref={mediaRef}
        type="file"
        accept={MEDIA_ACCEPT}
        className="sr-only"
        onChange={(e) => {
          addFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      {recordError && <p className="text-xs text-danger">{recordError}</p>}
      {isRecording && (
        <p className="flex items-center gap-2 text-xs text-accent-ai">
          <Loader2 className="h-3 w-3 animate-spin" />
          Inspelar… tryck Stoppa när du är klar.
        </p>
      )}

      {attachments.length > 0 && (
        <ul className="space-y-2">
          {attachments.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-3 rounded-lg border border-border-strong p-2"
            >
              <AttachmentPreview attachment={item} />
              <div className="min-w-0 flex-1 space-y-2">
                <p className="truncate text-xs text-text-muted">{item.file.name}</p>
                <p className="text-[10px] uppercase tracking-widest text-text-muted">{item.kind}</p>
                {onCaptionChange && (
                  <textarea
                    className="input-glass w-full text-xs"
                    rows={2}
                    maxLength={500}
                    disabled={disabled}
                    placeholder="Bildtext (valfritt), t.ex. Isabelle skickade detta…"
                    value={item.caption ?? ''}
                    onChange={(e) => onCaptionChange(item.id, e.target.value.slice(0, 500))}
                    aria-label={`Bildtext för ${item.file.name}`}
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                disabled={disabled}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-text-muted transition-colors hover:text-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
                aria-label="Ta bort bilaga"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {atLimit && <p className="text-xs text-text-muted">Max antal bilagor nått.</p>}
    </div>
  );
}

function AttachmentPreview({ attachment }: { attachment: MediaAttachment }) {
  if (attachment.kind === 'image') {
    return (
      <img
        src={attachment.previewUrl}
        alt=""
        className="h-14 w-14 shrink-0 rounded-md object-cover"
      />
    );
  }

  if (attachment.kind === 'audio') {
    return (
      <audio controls src={attachment.previewUrl} className="h-10 max-w-[140px]" preload="metadata" />
    );
  }

  if (attachment.kind === 'video') {
    return (
      <video
        src={attachment.previewUrl}
        className="h-14 w-20 shrink-0 rounded-md object-cover"
        muted
        playsInline
        preload="metadata"
      />
    );
  }

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-border-strong bg-surface/50">
      <FileUp className="h-5 w-5 text-text-muted" />
    </div>
  );
}
