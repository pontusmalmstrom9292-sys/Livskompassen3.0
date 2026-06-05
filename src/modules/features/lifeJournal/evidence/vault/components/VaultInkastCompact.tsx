import { useCallback, useRef, useState } from 'react';
import { FileUp, Inbox, Loader2 } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { fileToBase64 } from '../../kompis/api/ingestKnowledgeDocumentService';
import {
  formatInkastResultMessage,
  primaryInkastItem,
  submitInkastLite,
  type SubmitInkastLiteResult,
} from '@/modules/inkast/api/inkastService';
import {
  INKAST_FILE_ACCEPT,
  INKAST_UNSUPPORTED_FORMAT_MSG,
  isInkastBinaryFile,
  isInkastSupportedFile,
  isInkastTextFile,
  resolveInkastMime,
} from '@/modules/inkast/constants/inkastMimeTypes';

type Props = {
  onQueued?: () => void;
  onPersistedBevis?: (docId: string) => void;
};

/** Kompakt Inkast i Valv Samla — samma callable som Hem, PIN-gated kontext. */
export function VaultInkastCompact({ onQueued, onPersistedBevis }: Props) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<SubmitInkastLiteResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const runSubmit = useCallback(
    async (payload: Parameters<typeof submitInkastLite>[0]) => {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      setLastResult(null);
      try {
        const result = await submitInkastLite(payload);
        setLastResult(result);
        setSuccessMessage(formatInkastResultMessage(result));

        const primary = primaryInkastItem(result);
        if (primary.action === 'queued') {
          /* Ingen auto-vybyte — undviker React insertBefore-race vid unmount. */
        } else if (
          primary.action === 'persisted' &&
          primary.collection === 'reality_vault' &&
          primary.docId
        ) {
          onPersistedBevis?.(primary.docId);
        }

        if (result.errors.length > 0) {
          setError(
            result.errors.map((e) => `${e.fileName}: ${e.error}`).join(' · '),
          );
        }

        if (!payload.text) setText('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Inkast misslyckades.');
      } finally {
        setLoading(false);
      }
    },
    [onPersistedBevis],
  );

  const handlePasteSubmit = () => {
    const trimmed = text.trim();
    if (trimmed.length < 12) {
      setError('Skriv minst några rader (sms, mejl, anteckning).');
      return;
    }
    void runSubmit({ text: trimmed, fileName: 'inkast-klistra.txt' });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    const fileList = Array.from(files);
    const unsupported = fileList.filter((f) => !isInkastSupportedFile(f));
    if (unsupported.length > 0) {
      setError(INKAST_UNSUPPORTED_FORMAT_MSG);
      return;
    }

    const binaryFiles = fileList.filter(isInkastBinaryFile);
    const textFiles = fileList.filter(isInkastTextFile);

    try {
      if (binaryFiles.length > 0) {
        const base64Files: string[] = [];
        const mimeTypes: string[] = [];
        const fileNames: string[] = [];

        for (const file of binaryFiles) {
          base64Files.push(await fileToBase64(file));
          mimeTypes.push(resolveInkastMime(file));
          fileNames.push(file.name);
        }

        await runSubmit({ base64Files, mimeTypes, fileNames });
      }

      for (const file of textFiles) {
        const content = (await file.text()).trim();
        if (content.length < 12) {
          setError(`${file.name}: filen är tom eller för kort.`);
          return;
        }
        await runSubmit({
          text: content.slice(0, 12_000),
          fileName: file.name,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte läsa filen.');
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const showQueueHint =
    lastResult != null &&
    (lastResult.queued > 0 || lastResult.items.some((i) => i.action === 'queued'));

  return (
    <BentoCard
      title="Inkast"
      description="Sms, mejl eller fil → rätt silo"
      icon={<Inbox className="h-4 w-4 text-accent" />}
    >
      <p className="mb-2 text-xs text-text-dim">
        Hög säkerhet → granskningskö. Bekräfta «Arkiv» innan posten låses.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Klistra sms eller mejl…"
        rows={3}
        className="input-glass w-full resize-none rounded-xl px-3 py-2 text-sm"
        disabled={loading}
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-pill--secondary text-xs"
          disabled={loading || text.trim().length < 12}
          onClick={handlePasteSubmit}
        >
          <span className="inline-flex items-center gap-1">
            {loading ? <Loader2 className="h-3 w-3 shrink-0 animate-spin" aria-hidden /> : null}
            <span>{loading ? 'Sorterar…' : 'Skicka'}</span>
          </span>
        </button>
        <button
          type="button"
          className="btn-pill--ghost text-xs"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
        >
          <span className="inline-flex items-center gap-1">
            <FileUp className="h-3 w-3 shrink-0" aria-hidden />
            <span>Filer</span>
          </span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="sr-only"
        accept={INKAST_FILE_ACCEPT}
        onChange={(e) => void handleFiles(e.target.files)}
      />
      {error && <p className="mt-2 text-xs text-amber-400/90">{error}</p>}
      {successMessage && (
        <div className="mt-2 space-y-2">
          <p className="text-xs text-success">{successMessage}</p>
          {showQueueHint && onQueued && (
            <button
              type="button"
              className="btn-pill--secondary text-xs"
              onClick={() => onQueued()}
            >
              Öppna granskningskö
            </button>
          )}
        </div>
      )}
    </BentoCard>
  );
}
