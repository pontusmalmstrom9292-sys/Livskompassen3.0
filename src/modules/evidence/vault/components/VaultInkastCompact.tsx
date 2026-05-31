import { useCallback, useRef, useState } from 'react';
import { FileUp, Inbox, Loader2 } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
import { fileToBase64 } from '../../kompis/api/ingestKnowledgeDocumentService';
import {
  formatInkastResultMessage,
  submitInkastLite,
  type SubmitInkastLiteResult,
} from '../../../inkast/api/inkastService';

const TEXT_TYPES = new Set([
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/json',
]);

const BINARY_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
]);

function resolveMime(file: File): string {
  if (file.type) return file.type;
  const lower = file.name.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.md')) return 'text/markdown';
  if (lower.endsWith('.csv')) return 'text/csv';
  if (lower.endsWith('.json')) return 'application/json';
  return 'text/plain';
}

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
  const inputRef = useRef<HTMLInputElement>(null);

  const runSubmit = useCallback(
    async (payload: Parameters<typeof submitInkastLite>[0]) => {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      try {
        const result: SubmitInkastLiteResult = await submitInkastLite(payload);
        setSuccessMessage(formatInkastResultMessage(result));
        if (result.action === 'queued') {
          /* Ingen auto-vybyte — undviker React insertBefore-race vid unmount. */
        } else if (
          result.action === 'persisted' &&
          result.collection === 'reality_vault' &&
          result.docId
        ) {
          onPersistedBevis?.(result.docId);
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
    const file = files[0]!;
    const mimeType = resolveMime(file);
    const useBinary = BINARY_TYPES.has(mimeType);
    const useText =
      TEXT_TYPES.has(mimeType) || /\.(txt|md|csv|json)$/i.test(file.name);

    if (!useBinary && !useText) {
      setError('Stödda format: .pdf, .txt, .md, .csv, .json, .png, .jpg, .webp');
      return;
    }

    try {
      if (useBinary) {
        const base64 = await fileToBase64(file);
        await runSubmit({ fileName: file.name, mimeType, base64 });
      } else {
        const content = (await file.text()).trim();
        if (content.length < 12) {
          setError('Filen är tom eller för kort.');
          return;
        }
        await runSubmit({ text: content.slice(0, 12_000), fileName: file.name });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte läsa filen.');
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  };

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
            <span>Fil</span>
          </span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept=".pdf,.txt,.md,.csv,.json,.png,.jpg,.jpeg,.webp"
        onChange={(e) => void handleFiles(e.target.files)}
      />
      {error && <p className="mt-2 text-xs text-amber-400/90">{error}</p>}
      {successMessage && (
        <div className="mt-2 space-y-2">
          <p className="text-xs text-success">{successMessage}</p>
          {onQueued && (
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
