import { useCallback, useEffect, useRef, useState } from 'react';
import { FileUp, Inbox, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useStore } from '../../core/store';
import { fileToBase64 } from '../../evidence/kompis/api/ingestKnowledgeDocumentService';
import {
  formatInkastResultMessage,
  submitInkastLite,
  VALV_ARKIV_LINK,
  VALV_SAMLA_GRANSKA_LINK,
  type SubmitInkastLiteResult,
} from '../api/inkastService';

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
            En fil
          </button>
          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            accept=".pdf,.txt,.md,.csv,.json,.png,.jpg,.jpeg,.webp"
            onChange={(e) => void handleFiles(e.target.files)}
          />
        </div>

        {error && <p className="mt-3 text-sm text-amber-400/90">{error}</p>}

        {successMessage && lastResult && (
          <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-sm text-text-muted">
            <p>{successMessage}</p>
            {lastResult.action === 'queued' && (
              <Link
                to={VALV_SAMLA_GRANSKA_LINK}
                className="mt-2 inline-block text-xs text-accent underline-offset-2 hover:underline"
              >
                Öppna granskningskö (Valv)
              </Link>
            )}
            {lastResult.action === 'persisted' && lastResult.collection === 'reality_vault' && (
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
    </section>
  );
}
