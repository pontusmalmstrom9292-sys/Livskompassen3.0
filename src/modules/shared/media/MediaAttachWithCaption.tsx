/**
 * @locked MOD-SHARED-MEDIA
 * Shared image/PDF attach with optional caption. Max 2 items.
 * Progressive disclosure: one slot first, then «Ladda upp en bild till».
 */

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ImagePlus, FileText, X } from 'lucide-react';
import { Button, TextArea } from '@/design-system';
import {
  CAPTIONED_ATTACHMENT_MAX,
  CAPTION_MAX_CHARS,
  type PendingCaptionedMedia,
} from './captionedAttachment';

const DEFAULT_ACCEPT =
  'image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf,.heic,.pdf';

export type MediaAttachValidation =
  | { ok: true; mimeType: string }
  | { ok: false; message: string };

export type MediaAttachWithCaptionProps = {
  disabled?: boolean;
  items: PendingCaptionedMedia[];
  onChange: (items: PendingCaptionedMedia[]) => void;
  onValidationError?: (message: string | null) => void;
  /** Validate file before accept. Default: images + PDF, max 5 MB. */
  validateFile?: (file: File) => MediaAttachValidation;
  accept?: string;
  maxItems?: number;
  /** Hint under the picker (silo-aware copy). */
  helperText?: string;
  captionPlaceholder?: string;
  /** Enable paste of screenshot into the drop zone. Default true. */
  enablePaste?: boolean;
};

const DEFAULT_MAX_BYTES = 5 * 1024 * 1024;

function defaultValidate(file: File): MediaAttachValidation {
  if (file.size > DEFAULT_MAX_BYTES) {
    return { ok: false, message: 'Filen är större än 5 MB. Välj en mindre fil.' };
  }
  const type = file.type?.toLowerCase() || '';
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const okMime =
    type.startsWith('image/') ||
    type === 'application/pdf' ||
    ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif', 'pdf'].includes(ext);
  if (!okMime) {
    return { ok: false, message: 'Filtypen stöds inte. Välj JPG, PNG, WebP, HEIC eller PDF.' };
  }
  const mimeType =
    type ||
    (ext === 'pdf'
      ? 'application/pdf'
      : ext === 'png'
        ? 'image/png'
        : ext === 'webp'
          ? 'image/webp'
          : ext === 'heic' || ext === 'heif'
            ? 'image/heic'
            : 'image/jpeg');
  return { ok: true, mimeType };
}

function makePending(file: File, mimeType: string): PendingCaptionedMedia {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    file,
    previewUrl: URL.createObjectURL(file),
    caption: '',
    mimeType,
  };
}

function revokeAll(items: PendingCaptionedMedia[]) {
  for (const item of items) {
    URL.revokeObjectURL(item.previewUrl);
  }
}

export function MediaAttachWithCaption({
  disabled,
  items,
  onChange,
  onValidationError,
  validateFile = defaultValidate,
  accept = DEFAULT_ACCEPT,
  maxItems = CAPTIONED_ATTACHMENT_MAX,
  helperText = 'Valfri bildtext. Max två bilder.',
  captionPlaceholder = 'Bildtext (valfritt)…',
  enablePaste = true,
}: MediaAttachWithCaptionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const baseId = useId();
  const [pasteHint, setPasteHint] = useState(false);
  const limit = Math.min(Math.max(1, maxItems), CAPTIONED_ATTACHMENT_MAX);

  useEffect(() => {
    return () => revokeAll(itemsRef.current);
  }, []);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const list = Array.from(files);
      if (!list.length) return;
      const room = limit - items.length;
      if (room <= 0) {
        onValidationError?.(`Max ${limit} bilder.`);
        return;
      }
      const next: PendingCaptionedMedia[] = [...items];
      for (const file of list.slice(0, room)) {
        const validation = validateFile(file);
        if (validation.ok === false) {
          onValidationError?.(validation.message);
          continue;
        }
        onValidationError?.(null);
        next.push(makePending(file, validation.mimeType));
      }
      if (next.length !== items.length) onChange(next);
    },
    [items, limit, onChange, onValidationError, validateFile],
  );

  const removeAt = (id: string) => {
    const target = items.find((i) => i.id === id);
    if (target) URL.revokeObjectURL(target.previewUrl);
    onChange(items.filter((i) => i.id !== id));
    onValidationError?.(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const setCaption = (id: string, caption: string) => {
    onChange(
      items.map((i) =>
        i.id === id ? { ...i, caption: caption.slice(0, CAPTION_MAX_CHARS) } : i,
      ),
    );
  };

  useEffect(() => {
    if (!enablePaste || disabled) return;
    const onPaste = (e: ClipboardEvent) => {
      const zone = zoneRef.current;
      if (!zone) return;
      const active = document.activeElement;
      const inZone = zone.contains(active) || pasteHint;
      if (!inZone && active && active !== document.body) return;
      const files = e.clipboardData?.files;
      if (!files?.length) return;
      const images = Array.from(files).filter(
        (f) => f.type.startsWith('image/') || f.name.match(/\.(png|jpe?g|webp|heic)$/i),
      );
      if (!images.length) return;
      e.preventDefault();
      addFiles(images);
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [addFiles, disabled, enablePaste, pasteHint]);

  const canAddMore = items.length < limit;

  return (
    <div
      ref={zoneRef}
      className="media-attach-caption space-y-3"
      onFocusCapture={() => setPasteHint(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPasteHint(false);
      }}
      tabIndex={-1}
    >
      <input
        ref={inputRef}
        id={`${baseId}-file`}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled || !canAddMore}
        multiple={limit > 1}
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {items.map((item, index) => {
        const isImage = item.mimeType.startsWith('image/');
        return (
          <div
            key={item.id}
            className="rounded-xl border border-border/60 bg-surface/40 px-3 py-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-accent">
                <span className="text-text-dim">Bild {index + 1}:</span> {item.file.name}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="min-h-11 min-w-11 shrink-0"
                aria-label={`Ta bort bild ${index + 1}`}
                disabled={disabled}
                onClick={() => removeAt(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {isImage ? (
              <img
                src={item.previewUrl}
                alt=""
                className="mt-2 max-h-40 w-full rounded-lg border border-border/40 object-cover"
              />
            ) : (
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-border/40 bg-surface/50 px-3 py-4 text-sm text-text-dim">
                <FileText className="h-5 w-5 text-accent" aria-hidden />
                PDF
              </div>
            )}
            <label className="mt-2 block" htmlFor={`${baseId}-cap-${item.id}`}>
              <span className="sr-only">Bildtext för bild {index + 1}</span>
              <TextArea
                id={`${baseId}-cap-${item.id}`}
                rows={2}
                disabled={disabled}
                className="mt-1 w-full text-sm"
                placeholder={captionPlaceholder}
                value={item.caption}
                maxLength={CAPTION_MAX_CHARS}
                onChange={(e) => setCaption(item.id, e.target.value)}
              />
            </label>
          </div>
        );
      })}

      {canAddMore && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="inline-flex min-h-11 w-full items-center justify-center gap-2"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="h-4 w-4" aria-hidden />
          {items.length === 0
            ? 'Ladda upp bild eller PDF (max 5 MB)'
            : 'Ladda upp en bild till'}
        </Button>
      )}

      <p className="text-xs text-text-dim">
        {helperText}
        {enablePaste ? ' Du kan också klistra in en skärmdump här.' : ''}
      </p>
    </div>
  );
}
