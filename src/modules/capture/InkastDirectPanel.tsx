/** @locked MOD-VALV-INKAST — låst modul; unlock via docs/evaluations/*-unlock-MOD-VALV-INKAST.md
 *
 * Internal panel for Valv direct-submit (UPLOAD-UNIFIED steg 2 — wired via CaptureSuperModule valv-compact).
 */
import { useCallback, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { FileUp, Inbox, Copy, Check, Mic, MicOff } from 'lucide-react';
import { Button } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useStore } from '@/core/store';
import { WormSaveConfirmSheet } from '@/core/security/WormSaveConfirmSheet';
import { fileToBase64 } from '@/features/lifeJournal/evidence/kompis/api/ingestKnowledgeDocumentService';
import {
  previewInboxClassification,
  primaryInkastItem,
  submitInkastLite,
  type SubmitInkastLiteResult,
} from '@/modules/inkast/api/inkastService';
import { InkastPostSubmitPanel } from '@/modules/inkast/components/InkastPostSubmitPanel';
import { inkastTargetsWorm } from '@/modules/inkast/lib/inkastOutcome';
import {
  InkastBarnenValvBridge,
  inkastBarnenBridgeProps,
} from '@/modules/inkast/components/InkastBarnenValvBridge';
import {
  InkastDagbokWeaveBridge,
  inkastDagbokWeaveProps,
} from '@/modules/inkast/components/InkastDagbokWeaveBridge';
import { CaptureBreathingWidget } from './components/CaptureBreathingWidget';
import {
  INKAST_FILE_ACCEPT,
  INKAST_UNSUPPORTED_FORMAT_MSG,
  isInkastBinaryFile,
  isInkastSupportedFile,
  isInkastTextFile,
  resolveInkastMime,
} from '@/modules/inkast/constants/inkastMimeTypes';
import { CalmBreathingCircle } from './components/CalmBreathingCircle';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import {
  MediaAttachWithCaption,
  type PendingCaptionedMedia,
} from '@/modules/shared/media';

const BARA_ORD_OPTIONS = ['Utmattad', 'Ångest', 'Ledsen', 'Lugn', 'Överväldigad'];

export type InkastDirectPanelTone = 'hem' | 'valv';

export type InkastDirectPanelProps = {
  tone?: InkastDirectPanelTone;
  sourceModule?: string;
  onQueued?: () => void;
  onPersistedBevis?: (docId: string) => void;
  /** Valv: knapp istället för länk till granskningskö */
  queueHintAsButton?: boolean;
};

type InkastSubmitPayload = Parameters<typeof submitInkastLite>[0];

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
  const [lastResult, setLastResult] = useState<SubmitInkastLiteResult | null>(null);
  const [showBarnenBridge, setShowBarnenBridge] = useState(true);
  const [showDagbokWeave, setShowDagbokWeave] = useState(true);
  const [wormConfirmOpen, setWormConfirmOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<InkastSubmitPayload | null>(null);
  const [wormContextLabel, setWormContextLabel] = useState<string | undefined>(undefined);
  // Fas 3: Bara Lyssna-toggle
  const [baraLyssna, setBaraLyssna] = useState(false);
  // Fas 3: Clipboard copy feedback
  const [copied, setCopied] = useState(false);
  // Fas 3: Bara ord-läge
  const [showBaraOrd, setShowBaraOrd] = useState(false);
  const [pendingMediaItems, setPendingMediaItems] = useState<PendingCaptionedMedia[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const userId = useStore((s) => s.user?.uid);

  // Fas 3: Röstinmatning (Töm Skallen)
  const { isListening, toggleListening, supported: speechSupported } = useSpeechRecognition({
    onResult: (transcript) => {
      setText((prev) => prev + (prev.endsWith(' ') || prev.length === 0 ? '' : ' ') + transcript);
    },
  });

  const isValv = tone === 'valv';

  const runSubmit = useCallback(
    async (payload: Parameters<typeof submitInkastLite>[0]) => {
      setLoading(true);
      setError(null);
      setLastResult(null);
      setShowBarnenBridge(true);
      setShowDagbokWeave(true);
      try {
        const result = await submitInkastLite({
          ...payload,
          ...(sourceModule ? { sourceModule } : {}),
        });
        setLastResult(result);
        setShowBarnenBridge(true);
        setShowDagbokWeave(true);

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

        if (payload.text) setText('');
        setPendingMediaItems([]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Inkast misslyckades.');
      } finally {
        setLoading(false);
      }
    },
    [onPersistedBevis, sourceModule],
  );

  const openWormConfirm = useCallback((payload: InkastSubmitPayload, contextLabel?: string) => {
    setPendingPayload(payload);
    setWormContextLabel(contextLabel);
    setWormConfirmOpen(true);
  }, []);

  const requestSubmit = useCallback(
    async (payload: InkastSubmitPayload) => {
      if (!isValv) {
        void runSubmit(payload);
        return;
      }

      setError(null);

      if (payload.base64Files?.length) {
        openWormConfirm(payload, payload.fileNames?.join(', ') ?? 'Filuppladdning');
        return;
      }

      const trimmed = payload.text?.trim();
      if (trimmed && trimmed.length >= 12) {
        setLoading(true);
        try {
          const classification = await previewInboxClassification({
            text: trimmed,
            fileName: payload.fileName ?? 'inkast.txt',
            sourceModule,
          });
          if (inkastTargetsWorm(classification)) {
            openWormConfirm(
              payload,
              payload.fileName ?? trimmed.slice(0, 80),
            );
          } else {
            await runSubmit(payload);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Kunde inte analysera.');
        } finally {
          setLoading(false);
        }
        return;
      }

      void runSubmit(payload);
    },
    [isValv, openWormConfirm, runSubmit, sourceModule],
  );

  const confirmWormSubmit = useCallback(() => {
    if (!pendingPayload) return;
    const payload = pendingPayload;
    setWormConfirmOpen(false);
    setPendingPayload(null);
    setWormContextLabel(undefined);
    void runSubmit(payload);
  }, [pendingPayload, runSubmit]);

  const cancelWormConfirm = useCallback(() => {
    setWormConfirmOpen(false);
    setPendingPayload(null);
    setWormContextLabel(undefined);
  }, []);

  const handlePasteSubmit = async () => {
    const trimmed = text.trim();
    const hasMedia = pendingMediaItems.length > 0;
    if (trimmed.length < 12 && !hasMedia) {
      setError('Skriv minst några rader (sms, mejl, anteckning) eller bifoga en bild.');
      return;
    }
    const captionBlock = pendingMediaItems
      .map((item, i) => {
        const cap = item.caption.trim();
        return cap ? `Bild ${i + 1} (${item.file.name}): ${cap}` : `Bild ${i + 1}: ${item.file.name}`;
      })
      .join('\n');
    const combinedText = [trimmed, captionBlock].filter(Boolean).join('\n\n');

    if (hasMedia) {
      try {
        const base64Files: string[] = [];
        const mimeTypes: string[] = [];
        const fileNames: string[] = [];
        for (const item of pendingMediaItems.slice(0, 2)) {
          base64Files.push(await fileToBase64(item.file));
          mimeTypes.push(resolveInkastMime(item.file));
          fileNames.push(item.file.name);
        }
        void requestSubmit({
          text: combinedText || undefined,
          fileName: 'inkast-klistra.txt',
          base64Files,
          mimeTypes,
          fileNames,
          ...(baraLyssna ? { sourceModule: `${sourceModule ?? 'inkast'}|bara_lyssna` } : {}),
        });
        setPendingMediaItems([]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Kunde inte läsa bilden.');
      }
      return;
    }

    void requestSubmit({
      text: combinedText,
      fileName: 'inkast-klistra.txt',
      ...(baraLyssna ? { sourceModule: `${sourceModule ?? 'inkast'}|bara_lyssna` } : {}),
    });
  };

  const handleBaraOrdSubmit = (ord: string) => {
    void requestSubmit({
      text: `Mående: ${ord}`,
      fileName: 'inkast-bara-ord.txt',
      sourceModule: `${sourceModule ?? 'inkast'}|bara_ord`,
    });
  };

  // Fas 3: Clipboard copy
  const handleCopy = useCallback(() => {
    if (!text.trim()) return;
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    });
  }, [text]);

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
        void requestSubmit({ base64Files, mimeTypes, fileNames });
      }
      for (const file of textFiles) {
        const content = (await file.text()).trim();
        if (content.length < 12) {
          setError(`${file.name}: filen är tom eller för kort.`);
          return;
        }
        void requestSubmit({
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
  const barnenBridge =
    showBarnenBridge && primary && userId ? inkastBarnenBridgeProps(primary) : null;
  const dagbokWeave = showDagbokWeave && primary ? inkastDagbokWeaveProps(primary) : null;
  const showQueueHint =
    lastResult != null &&
    (lastResult.queued > 0 || lastResult.items.some((i) => i.action === 'queued'));

  const textareaClass = isValv
    ? 'input-glass w-full resize-none rounded-xl px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50'
    : 'w-full rounded-xl border border-border-subtle bg-surface/50 px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-accent/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50';

  return (
    <BentoCard
      title="Inkast"
      description={
        isValv ? 'Sms, mejl eller fil → rätt silo' : 'Klistra eller ladda upp — sorteras automatiskt'
      }
      icon={<Inbox className="h-4 w-4 text-accent" />}
      glow={isValv ? undefined : 'gold'}
    >
      <p className={clsx('text-xs text-text-muted', isValv ? 'mb-2' : 'mb-3')}>
        {isValv
          ? 'Hög säkerhet → granskningskö. Bekräfta «Arkiv» innan posten låses.'
          : 'Systemet föreslår Kunskap, Bevis eller Barnen. Osäkert hamnar i granskningskö — inget sparas i fel silo utan att du ser det.'}
      </p>

      {showBaraOrd ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 mb-2">
          {BARA_ORD_OPTIONS.map((ord) => (
            <button
              key={ord}
              type="button"
              disabled={loading || wormConfirmOpen}
              onClick={() => handleBaraOrdSubmit(ord)}
              className="rounded-xl border border-border/30 bg-surface-2/40 p-3 text-sm text-text hover:border-accent/40 hover:bg-accent/5 transition-all disabled:opacity-50 min-h-[var(--ds-touch-target,2.75rem)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50"
            >
              {ord}
            </button>
          ))}
        </div>
      ) : (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={isValv ? 'Klistra sms eller mejl…' : 'Klistra sms, mejl eller anteckning…'}
            rows={isValv ? 3 : 4}
            className={textareaClass}
            disabled={loading || wormConfirmOpen || isListening}
          />
          {/* Fas 3: Teckenräknare */}
          <p className="mt-0.5 text-right text-[11px] text-text-muted/40 pr-1">
            {text.length} tecken
          </p>
          <div className="mt-3 space-y-1">
            <MediaAttachWithCaption
              disabled={loading || wormConfirmOpen}
              items={pendingMediaItems}
              onChange={setPendingMediaItems}
              onValidationError={(msg) => setError(msg)}
              helperText="Skärmdump med valfri bildtext. Max två bilder (t.ex. motsägelse)."
              captionPlaceholder="t.ex. Isabelle skickade detta; igår sa hon…"
            />
          </div>
        </>
      )}

      {wormConfirmOpen && (
        <div className={isValv ? 'mt-2' : 'mt-3'}>
          <WormSaveConfirmSheet
            contextLabel={wormContextLabel}
            busy={loading}
            onConfirm={confirmWormSubmit}
            onCancel={cancelWormConfirm}
          />
        </div>
      )}

      <div className={clsx('flex flex-wrap items-center gap-2', isValv ? 'mt-2' : 'mt-3')}>
        <Button
          variant={isValv ? 'secondary' : 'accent'}
          size="sm"
          className="min-h-[var(--ds-touch-target,2.75rem)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          disabled={loading || wormConfirmOpen || text.trim().length < 12}
          onClick={handlePasteSubmit}
        >
          {loading ? (
            <span className="inline-flex items-center gap-1.5">
              <CalmBreathingCircle size="sm" />
              <span>Sorterar…</span>
            </span>
          ) : isValv ? (
            'Skicka'
          ) : (
            'Skicka till arkiv'
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="min-h-[var(--ds-touch-target,2.75rem)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          disabled={loading || wormConfirmOpen || text.trim().length === 0}
          onClick={handleCopy}
          title="Kopiera text till urklipp"
          aria-label="Kopiera till urklipp"
        >
          <span className="inline-flex items-center gap-1">
            {copied ? (
              <Check className="mr-1 inline h-3 w-3 text-success" />
            ) : (
              <Copy className="mr-1 inline h-3 w-3" />
            )}
            {copied ? 'Kopierat!' : 'Kopiera'}
          </span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="min-h-[var(--ds-touch-target,2.75rem)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          disabled={loading || wormConfirmOpen}
          onClick={() => inputRef.current?.click()}
        >
          <span className="inline-flex items-center gap-1">
            <FileUp className="mr-1 inline h-3 w-3" aria-hidden />
            {isValv ? 'Filer' : 'En fil eller flera'}
          </span>
        </Button>

        {speechSupported && !showBaraOrd && (
          <Button
            variant="ghost"
            size="sm"
            className={clsx(
              'min-h-[var(--ds-touch-target,2.75rem)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
              isListening ? 'animate-pulse bg-danger/10 text-danger' : '',
            )}
            disabled={loading || wormConfirmOpen}
            onClick={toggleListening}
            title={isListening ? 'Klicka för att sluta lyssna' : 'Töm skallen (Röst till text)'}
          >
            <span className="inline-flex items-center gap-1">
              {isListening ? (
                <MicOff className="mr-1 inline h-3 w-3" />
              ) : (
                <Mic className="mr-1 inline h-3 w-3" />
              )}
              {isListening ? 'Lyssnar...' : 'Prata'}
            </span>
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          className={clsx(
            'ml-auto min-h-[var(--ds-touch-target,2.75rem)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
            showBaraOrd ? 'text-accent' : 'text-text-muted',
          )}
          onClick={() => setShowBaraOrd(!showBaraOrd)}
          disabled={loading || wormConfirmOpen}
        >
          Bara ord
        </Button>

        {/* Fas 3: Bara Lyssna-toggle */}
        {!showBaraOrd && (
          <label className="inline-flex min-h-[var(--ds-touch-target,2.75rem)] cursor-pointer select-none items-center gap-2 text-xs text-text-muted">
            <input
              type="checkbox"
              checked={baraLyssna}
              onChange={(e) => setBaraLyssna(e.target.checked)}
              disabled={loading}
              className="h-4 w-4 rounded accent-[var(--accent)]"
            />
            Bara lyssna
          </label>
        )}
        <input
          ref={inputRef}
          type="file"
          multiple
          className="sr-only"
          accept={INKAST_FILE_ACCEPT}
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>
      
      <CaptureBreathingWidget />

      {error && (
        <p
          role="alert"
          className={clsx(
            'rounded-lg border border-accent/25 bg-accent/10 px-3 py-2 text-accent-light',
            isValv ? 'mt-2 text-xs' : 'mt-3 text-sm',
          )}
        >
          {error}
        </p>
      )}

      {lastResult && (
        <InkastPostSubmitPanel
          result={lastResult}
          tone={isValv ? 'valv' : 'hem'}
          onOpenReviewQueue={onQueued}
          queueHintAsButton={queueHintAsButton && showQueueHint}
        >
          {barnenBridge && userId && (
            <InkastBarnenValvBridge
              userId={userId}
              {...barnenBridge}
              onDone={() => setShowBarnenBridge(false)}
            />
          )}
          {dagbokWeave && (
            <InkastDagbokWeaveBridge
              {...dagbokWeave}
              onDone={() => setShowDagbokWeave(false)}
            />
          )}
        </InkastPostSubmitPanel>
      )}
    </BentoCard>
  );
}
