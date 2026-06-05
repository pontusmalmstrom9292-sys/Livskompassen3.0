import { useCallback, useEffect, useRef, useState } from 'react';
import { FileUp, Inbox, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useStore } from '../../core/store';
import { fileToBase64 } from '@/features/lifeJournal/evidence/kompis/api/ingestKnowledgeDocumentService';
import {
  formatInkastResultMessage,
  primaryInkastItem,
  submitInkastLite,
  VALV_ARKIV_LINK,
  VALV_SAMLA_GRANSKA_LINK,
  type SubmitInkastLiteResult,
} from '../api/inkastService';
import {
  INKAST_FILE_ACCEPT,
  INKAST_UNSUPPORTED_FORMAT_MSG,
  isInkastBinaryFile,
  isInkastSupportedFile,
  isInkastTextFile,
  resolveInkastMime,
} from '../constants/inkastMimeTypes';

export function InkastLiteCard() {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<SubmitInkastLiteResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.location.hash.replace(/^#/, '') !== 'inkast-lite') return;
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const runSubmit = useCallback(async (payload: Parameters<typeof submitInkastLite>[0]) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setLastResult(null);
    try {
      const result = await submitInkastLite(payload);
      setLastResult(result);
      setSuccessMessage(formatInkastResultMessage(result));
      if (!payload.text) setText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Inkast misslyckades.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePasteSubmit = () => {
    const trimmed = text.trim();
    if (trimmed.length < 12) {
      setError('Skriv minst några rader (sms, mejl, anteckning).');
      return;
    }
    void runSubmit({
      text: trimmed,
      fileName: 'inkast-klistra.txt',
    });
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

  if (!isAuthenticated) {
    return (
      <section id="inkast-lite" ref={sectionRef} className="scroll-mt-28">
        <BentoCard title="Inkast" description="Kräver inloggning">
          <p className="text-sm text-text-muted">Logga in för att klistra in eller ladda upp till rätt arkiv.</p>
        </BentoCard>
      </section>
    );
  }

  return (
    <section id="inkast-lite" ref={sectionRef} className="scroll-mt-28">
      <BentoCard
        title="Inkast"
        description="Klistra eller ladda upp — sorteras automatiskt"
        icon={<Inbox className="h-4 w-4 text-accent" />}
      >
        <p className="mb-3 text-xs text-text-dim">
          Systemet föreslår Kunskap, Bevis eller Barnen. Osäkert hamnar i granskningskö — inget sparas i fel
          silo utan att du ser det.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Klistra sms, mejl eller anteckning…"
          rows={4}
          className="w-full rounded-xl border border-border-subtle bg-surface/50 px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent/40 focus:outline-none"
          disabled={loading}
        />

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-pill--primary text-xs"
            disabled={loading || text.trim().length < 12}
            onClick={handlePasteSubmit}
          >
            {loading ? (
              <>
                <Loader2 className="mr-1 inline h-3 w-3 animate-spin" />
                Sorterar…
              </>
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
            <FileUp className="mr-1 inline h-3 w-3" />
            En fil eller flera
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

        {error && <p className="mt-3 text-sm text-amber-400/90">{error}</p>}

        {successMessage && lastResult && (
          <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-sm text-text-muted">
            <p>{successMessage}</p>
            {(() => {
              const primary = primaryInkastItem(lastResult);
              return (
                <>
                  {primary.action === 'queued' && (
                    <Link
                      to={VALV_SAMLA_GRANSKA_LINK}
                      className="mt-2 inline-block text-xs text-accent underline-offset-2 hover:underline"
                    >
                      Öppna granskningskö (Valv)
                    </Link>
                  )}
                  {primary.action === 'persisted' && primary.collection === 'reality_vault' && (
                    <Link
                      to={VALV_ARKIV_LINK}
                      className="mt-2 inline-block text-xs text-accent underline-offset-2 hover:underline"
                    >
                      Öppna Valv-arkiv
                    </Link>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </BentoCard>
    </section>
  );
}
