import { useCallback, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { FileUp, Inbox, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BentoCard } from '@/shared/ui/BentoCard';
import { fileToBase64 } from '@/features/lifeJournal/evidence/kompis/api/ingestKnowledgeDocumentService';
import {
  formatInkastResultMessage,
  primaryInkastItem,
  submitInkastLite,
  VALV_ARKIV_LINK,
  VALV_SAMLA_GRANSKA_LINK,
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

export type InkastDirectPanelTone = 'hem' | 'valv';

export type InkastDirectPanelProps = {
  tone?: InkastDirectPanelTone;
  sourceModule?: string;
  onQueued?: () => void;
  onPersistedBevis?: (docId: string) => void;
  /** Valv: knapp istället för länk till granskningskö */
  queueHintAsButton?: boolean;
};

/** Delad direct-submit UI — paste + filer → submitInkastLite (ingen AI-preview). */
export function InkastDirectPanel({
  tone = 'hem',
  sourceModule,
  onQueued,
  onPersistedBevis,
  queueHintAsButton = false,
}: InkastDirectPanelProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<SubmitInkastLiteResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isValv = tone === 'valv';

  const runSubmit = useCallback(
    async (payload: Parameters<typeof submitInkastLite>[0]) => {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      setLastResult(null);
      try {
        const result = await submitInkastLite({
          ...payload,
          ...(sourceModule ? { sourceModule } : {}),
        });
        setLastResult(result);
        setSuccessMessage(formatInkastResultMessage(result));

        const primary = primaryInkastItem(result);
        if (
          primary.action === 'persisted' &&
          primary.collection === 'reality_vault' &&
          primary.docId
        ) {
          onPersistedBevis?.(primary.docId);
        }

        if (result.errors.length > 0) {
          setError(result.errors.map((e) => `${e.fileName}: ${e.error}`).join(' · '));
        }

        if (!payload.text) setText('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Inkast misslyckades.');
      } finally {
        setLoading(false);
      }
    },
    [onPersistedBevis, sourceModule],
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

  const primary = lastResult ? primaryInkastItem(lastResult) : null;
  const showQueueHint =
    lastResult != null &&
    (lastResult.queued > 0 || lastResult.items.some((i) => i.action === 'queued'));

  const textareaClass = isValv
    ? 'input-glass w-full resize-none rounded-xl px-3 py-2 text-sm'
    : 'w-full rounded-xl border border-border-subtle bg-surface/50 px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent/40 focus:outline-none';

  return (
    <BentoCard
      title="Inkast"
      description={
        isValv ? 'Sms, mejl eller fil → rätt silo' : 'Klistra eller ladda upp — sorteras automatiskt'
      }
      icon={<Inbox className="h-4 w-4 text-accent" />}
    >
      <p className={clsx('text-xs text-text-dim', isValv ? 'mb-2' : 'mb-3')}>
        {isValv
          ? 'Hög säkerhet → granskningskö. Bekräfta «Arkiv» innan posten låses.'
          : 'Systemet föreslår Kunskap, Bevis eller Barnen. Osäkert hamnar i granskningskö — inget sparas i fel silo utan att du ser det.'}
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={isValv ? 'Klistra sms eller mejl…' : 'Klistra sms, mejl eller anteckning…'}
        rows={isValv ? 3 : 4}
        className={textareaClass}
        disabled={loading}
      />

      <div className={clsx('flex flex-wrap gap-2', isValv ? 'mt-2' : 'mt-3')}>
        <button
          type="button"
          className={isValv ? 'btn-pill--secondary text-xs' : 'btn-pill--primary text-xs'}
          disabled={loading || text.trim().length < 12}
          onClick={handlePasteSubmit}
        >
          {loading ? (
            <span className="inline-flex items-center gap-1">
              <Loader2 className="h-3 w-3 shrink-0 animate-spin" aria-hidden />
              <span>Sorterar…</span>
            </span>
          ) : isValv ? (
            'Skicka'
          ) : (
            'Skicka till arkiv'
          )}
        </button>
        <button
          type="button"
          className="btn-pill--ghost text-xs"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
        >
          <span className="inline-flex items-center gap-1">
            <FileUp className="mr-1 inline h-3 w-3" />
            {isValv ? 'Filer' : 'En fil eller flera'}
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="sr-only"
          accept={INKAST_FILE_ACCEPT}
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className={clsx('text-amber-400/90', isValv ? 'mt-2 text-xs' : 'mt-3 text-sm')}>{error}</p>
      )}

      {successMessage && lastResult && (
        <div
          className={
            isValv
              ? 'mt-2 space-y-2'
              : 'mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-sm text-text-muted'
          }
        >
          <p className={isValv ? 'text-xs text-success' : undefined}>{successMessage}</p>
          {primary?.action === 'queued' &&
            (queueHintAsButton && onQueued && showQueueHint ? (
              <button type="button" className="btn-pill--secondary text-xs" onClick={() => onQueued()}>
                Öppna granskningskö
              </button>
            ) : (
              <Link
                to={VALV_SAMLA_GRANSKA_LINK}
                className="mt-2 inline-block text-xs text-accent underline-offset-2 hover:underline"
              >
                Öppna granskningskö (Valv)
              </Link>
            ))}
          {primary?.action === 'persisted' && primary.collection === 'reality_vault' && !isValv && (
            <Link
              to={VALV_ARKIV_LINK}
              className="mt-2 inline-block text-xs text-accent underline-offset-2 hover:underline"
            >
              Öppna Valv-arkiv
            </Link>
          )}
        </div>
      )}
    </BentoCard>
  );
}
