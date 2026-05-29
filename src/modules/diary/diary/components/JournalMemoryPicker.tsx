import { useEffect, useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { validateJournalMemoryFile } from '../utils/journalUploadHelper';

const ACCEPT =
  'image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf,.heic,.pdf';

type JournalMemoryPickerProps = {
  disabled?: boolean;
  file: File | null;
  onFileChange: (file: File | null) => void;
  onValidationError?: (message: string | null) => void;
};

export function JournalMemoryPicker({
  disabled,
  file,
  onFileChange,
  onValidationError,
}: JournalMemoryPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const clear = () => {
    onFileChange(null);
    onValidationError?.(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="journal-memory-picker space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        disabled={disabled}
        onChange={(e) => {
          const picked = e.target.files?.[0];
          if (!picked) {
            clear();
            return;
          }
          const validation = validateJournalMemoryFile(picked);
          if (validation.ok === false) {
            onValidationError?.(validation.message);
            onFileChange(null);
            if (inputRef.current) inputRef.current.value = '';
            return;
          }
          onValidationError?.(null);
          onFileChange(picked);
        }}
      />
      {!file ? (
        <button
          type="button"
          disabled={disabled}
          className="btn-pill--secondary inline-flex w-full items-center justify-center gap-2 text-sm"
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="h-4 w-4" aria-hidden />
          Ladda upp bild eller PDF (max 5 MB)
        </button>
      ) : (
        <div className="rounded-xl border border-accent/25 bg-surface/30 px-3 py-2">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-accent">
              <span className="text-text-dim">Minne:</span> {file.name}
            </p>
            <button
              type="button"
              className="btn-pill--ghost shrink-0 p-1"
              aria-label="Ta bort fil"
              disabled={disabled}
              onClick={clear}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {preview && (
            <img
              src={preview}
              alt=""
              className="mt-2 max-h-36 w-full rounded-lg border border-white/10 object-cover"
            />
          )}
        </div>
      )}
      <p className="text-xs text-text-dim">Ett minne per post. Personligt — inte juridiskt bevis.</p>
    </div>
  );
}
