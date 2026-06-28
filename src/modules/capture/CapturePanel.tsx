import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileUp, Filter, PenLine, X } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useStore } from '@/core/store';
import { toast } from '@/modules/core/store/toastStore';
import { hasVaultGate } from '@/core/auth/sessionService';
import { WormSaveConfirmSheet } from '@/core/security/WormSaveConfirmSheet';
import { fileToBase64 } from '@/features/lifeJournal/evidence/kompis/api/ingestKnowledgeDocumentService';
import {
  previewInboxClassification,
  inkastDestinationLink,
  primaryInkastItem,
  submitInkastLite,
  tagsFromInkastClassification,
  VALV_SAMLA_GRANSKA_LINK,
  type SubmitInkastLiteResult,
} from '../inkast/api/inkastService';
import {
  InkastPostSubmitPanel,
  toastMessageForInkastResult,
} from '../inkast/components/InkastPostSubmitPanel';
import { inkastTargetsWorm } from '../inkast/lib/inkastOutcome';
import {
  InkastBarnenValvBridge,
  inkastBarnenBridgeProps,
} from '../inkast/components/InkastBarnenValvBridge';
import {
  InkastDagbokWeaveBridge,
  inkastDagbokWeaveProps,
} from '../inkast/components/InkastDagbokWeaveBridge';
import type { InboxClassification } from '@/features/lifeJournal/evidence/kompis/api/inboxService';
import { InkastConfirmPanel } from '../inkast/components/InkastConfirmPanel';
import {
  InkastBrusfilterPreview,
  type InkastBrusfilterAcceptPayload,
} from '../inkast/components/InkastBrusfilterPreview';
import {
  manualChoiceToSubmitFields,
  routingToUiSilo,
  type InkastManualChoice,
  type InkastUiSilo,
} from '../inkast/constants/inkastSiloOptions';
import {
  INKAST_FILE_ACCEPT,
  INKAST_UNSUPPORTED_FORMAT_MSG,
  isInkastAudioFile,
  isInkastBinaryFile,
  isInkastSupportedFile,
  isInkastTextFile,
  resolveInkastMime,
} from '../inkast/constants/inkastMimeTypes';
import { inkastSourceModuleHint } from './captureDomainCopy';
import { CalmBreathingCircle } from './components/CalmBreathingCircle';
import { CaptureBreathingWidget } from './components/CaptureBreathingWidget';

type CapturePanelProps = {
  sourceModule?: string;
  compact?: boolean;
  onSaved?: () => void;
  /** Kort ledtråd efter modulväljare (foto/widget). */
  composeHint?: string | null;
  /** Fokusera textarea vid mount (t.ex. efter «Klistra text»). */
  focusOnCompose?: boolean;
  /** Tillåt fil- och ljuduppladdning (G10 batch). */
  allowFiles?: boolean;
  maxFiles?: number;
};

type Phase = 'compose' | 'brusfilter' | 'analyzing' | 'confirm' | 'edit' | 'done' | 'debouncing';

const DEFAULT_MAX_FILES = 8;

function isInkastBinaryUpload(file: File): boolean {
  return isInkastBinaryFile(file) || isInkastAudioFile(file);
}

async function buildPreviewPayloadFromFiles(
  files: File[],
): Promise<{ text: string; fileName: string }> {
  const textFiles = files.filter(isInkastTextFile);
  if (textFiles.length > 0) {
    const file = textFiles[0]!;
    const content = (await file.text()).trim().slice(0, 6000);
    return { text: content, fileName: file.name };
  }
  const fileName = files[0]?.name ?? 'inkast.bin';
  const names = files.map((f) => f.name).join(', ');
  const text = `Filuppladdning för granskning: ${names}`.slice(0, 6000);
  return {
    text: text.length >= 12 ? text : `${text} — inkast`,
    fileName,
  };
}

export function CapturePanel({
  sourceModule = 'hem_capture',
  compact = false,
  onSaved,
  composeHint = null,
  focusOnCompose = false,
  allowFiles = true,
  maxFiles = DEFAULT_MAX_FILES,
}: CapturePanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState('');
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [phase, setPhase] = useState<Phase>('compose');
  const [lastBatch, setLastBatch] = useState<SubmitInkastLiteResult | null>(null);
  const [wormConfirmOpen, setWormConfirmOpen] = useState(false);
  const [pendingManual, setPendingManual] = useState<InkastManualChoice | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<InboxClassification | null>(null);
  const [manualSilo, setManualSilo] = useState<InkastUiSilo>('dagbok');
  const [manualTags, setManualTags] = useState<string[]>([]);
  const [manualComment, setManualComment] = useState('');
  const [manualChildAlias, setManualChildAlias] = useState('');
  const [showBarnenBridge, setShowBarnenBridge] = useState(true);
  const [showDagbokWeave, setShowDagbokWeave] = useState(true);
  const [brusfilterBiffDraft, setBrusfilterBiffDraft] = useState<string | null>(null);
  const [debounceTimeLeft, setDebounceTimeLeft] = useState(10);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const debounceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const userId = useStore((s) => s.user?.uid);
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const canBrusfilter = hasVaultGate() || isVaultUnlocked;

  const hasText = text.trim().length >= 12;
  const hasFiles = pendingFiles.length > 0;
  const canPreview = hasText || hasFiles;

  const clearDebounce = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (debounceIntervalRef.current) clearInterval(debounceIntervalRef.current);
    debounceTimerRef.current = null;
    debounceIntervalRef.current = null;
  }, []);

  useEffect(() => {
    return () => clearDebounce();
  }, [clearDebounce]);

  const cancelDebounce = useCallback(() => {
    clearDebounce();
    setPhase('confirm');
  }, [clearDebounce]);

  const resetFlow = useCallback(() => {
    clearDebounce();
    setPhase('compose');
    setPreview(null);
    setError(null);
    setLastBatch(null);
    setWormConfirmOpen(false);
    setPendingManual(undefined);
    setPendingFiles([]);
    setManualTags([]);
    setManualComment('');
    setManualChildAlias('');
    setShowBarnenBridge(true);
    setShowDagbokWeave(true);
    setBrusfilterBiffDraft(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [clearDebounce]);

  const applyPreviewClassification = useCallback((classification: InboxClassification) => {
    setPreview(classification);
    setManualSilo(routingToUiSilo(classification.routing));
    setManualTags(tagsFromInkastClassification(classification));
    setManualComment(classification.summary);
    setManualChildAlias(classification.childAlias ?? '');
    setPhase('confirm');
  }, []);

  const handlePreview = useCallback(async () => {
    if (!canPreview) {
      setError('Skriv minst 12 tecken eller välj minst en fil.');
      return;
    }
    if (hasText && hasFiles) {
      setError('Skicka antingen text eller filer — inte båda samtidigt.');
      return;
    }

    setPhase('analyzing');
    setError(null);
    try {
      if (hasText) {
        const classification = await previewInboxClassification({
          text: text.trim(),
          fileName: 'capture.txt',
          sourceModule,
        });
        applyPreviewClassification(classification);
        return;
      }

      const unsupported = pendingFiles.filter((f) => !isInkastSupportedFile(f));
      if (unsupported.length > 0) {
        setError(INKAST_UNSUPPORTED_FORMAT_MSG);
        setPhase('compose');
        return;
      }

      const { text: previewText, fileName } = await buildPreviewPayloadFromFiles(pendingFiles);
      if (previewText.length < 12) {
        setError('Filinnehållet är för kort efter läsning.');
        setPhase('compose');
        return;
      }

      const classification = await previewInboxClassification({
        text: previewText,
        fileName,
        sourceModule,
      });
      applyPreviewClassification(classification);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte analysera.');
      setPhase('compose');
    }
  }, [
    applyPreviewClassification,
    canPreview,
    hasFiles,
    hasText,
    pendingFiles,
    sourceModule,
    text,
  ]);

  const startBrusfilterStep = useCallback(() => {
    if (!hasText || hasFiles) {
      setError('Brusfilter kräver klistrad text (inga filer).');
      return;
    }
    if (!canBrusfilter) {
      setError('Lås upp Valvet via Fyren (3 sek) innan brusfilter.');
      return;
    }
    setError(null);
    setPhase('brusfilter');
  }, [canBrusfilter, hasFiles, hasText]);

  const handleBrusfilterAccept = useCallback(
    (payload: InkastBrusfilterAcceptPayload) => {
      setText(payload.cleanedText);
      setBrusfilterBiffDraft(payload.biffDraft);
      if (payload.logistics) {
        setManualComment(payload.logistics);
      }
      void handlePreview();
    },
    [handlePreview],
  );

  const handleBrusfilterKeepOriginal = useCallback(() => {
    setBrusfilterBiffDraft(null);
    void handlePreview();
  }, [handlePreview]);

  const submitFiles = useCallback(
    async (manual?: InkastManualChoice) => {
      const binaryFiles = pendingFiles.filter(isInkastBinaryUpload);
      const textFiles = pendingFiles.filter(isInkastTextFile);
      const manualFields = manual ? manualChoiceToSubmitFields(manual) : {};

      if (binaryFiles.length > 0) {
        const base64Files: string[] = [];
        const mimeTypes: string[] = [];
        const fileNames: string[] = [];
        for (const file of binaryFiles) {
          base64Files.push(await fileToBase64(file));
          mimeTypes.push(resolveInkastMime(file));
          fileNames.push(file.name);
        }
        const batch = await submitInkastLite({
          base64Files,
          mimeTypes,
          fileNames,
          sourceModule,
          ...manualFields,
        });

        for (const file of textFiles) {
          const content = (await file.text()).trim();
          if (content.length < 12) continue;
          await submitInkastLite({
            text: content.slice(0, 12_000),
            fileName: file.name,
            sourceModule,
            ...manualFields,
          });
        }
        return batch;
      }

      if (textFiles.length === 0) {
        throw new Error('Inga filer att skicka.');
      }

      let lastBatch: SubmitInkastLiteResult | null = null;
      for (const file of textFiles) {
        const content = (await file.text()).trim();
        if (content.length < 12) {
          throw new Error(`${file.name}: filen är tom eller för kort.`);
        }
        lastBatch = await submitInkastLite({
          text: content.slice(0, 12_000),
          fileName: file.name,
          sourceModule,
          ...manualFields,
        });
      }
      return lastBatch!;
    },
    [pendingFiles, sourceModule],
  );

  const persistInkast = useCallback(
    async (manual?: InkastManualChoice) => {
      setPhase('analyzing');
      setError(null);

      try {
        let batch: SubmitInkastLiteResult;

        if (hasFiles) {
          batch = await submitFiles(manual);
        } else {
          const trimmed = text.trim();
          if (trimmed.length < 12) {
            setError('Texten är för kort.');
            setPhase(manual ? 'edit' : 'confirm');
            return;
          }
          batch = await submitInkastLite({
            text: trimmed,
            fileName: 'capture.txt',
            sourceModule,
            ...(manual ? manualChoiceToSubmitFields(manual) : {}),
          });
        }

        const toastMsg = toastMessageForInkastResult(batch);
        if (toastMsg.level === 'info') toast.info(toastMsg.text);
        else if (toastMsg.level === 'error') toast.error(toastMsg.text);
        else toast.success(toastMsg.text);
        setLastBatch(batch);
        setText('');
        setPendingFiles([]);
        setPreview(null);
        setShowBarnenBridge(true);
        setShowDagbokWeave(true);
        setPhase('done');
        if (fileInputRef.current) fileInputRef.current.value = '';
        onSaved?.();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Kunde inte spara.');
        setPhase(manual ? 'edit' : 'confirm');
      }
    },
    [hasFiles, onSaved, sourceModule, submitFiles, text],
  );

  const requestPersistInkast = useCallback(
    (manual?: InkastManualChoice) => {
      if (preview && inkastTargetsWorm(preview, manual?.silo)) {
        setPendingManual(manual);
        setWormConfirmOpen(true);
        return;
      }
      setPendingManual(manual);
      setPhase('debouncing');
      setDebounceTimeLeft(10);

      debounceIntervalRef.current = setInterval(() => {
        setDebounceTimeLeft((prev) => prev - 1);
      }, 1000);

      debounceTimerRef.current = setTimeout(() => {
        clearDebounce();
        void persistInkast(manual);
      }, 10000);
    },
    [persistInkast, preview, clearDebounce],
  );

  const handleManualSave = useCallback(
    (choice: InkastManualChoice) => {
      requestPersistInkast(choice);
    },
    [requestPersistInkast],
  );

  const handleFilePick = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      const picked = Array.from(files);
      if (picked.length > maxFiles) {
        setError(`Max ${maxFiles} filer per inkast.`);
        return;
      }
      const unsupported = picked.filter((f) => !isInkastSupportedFile(f));
      if (unsupported.length > 0) {
        setError(INKAST_UNSUPPORTED_FORMAT_MSG);
        return;
      }
      setError(null);
      setText('');
      setPendingFiles(picked);
    },
    [maxFiles],
  );

  const removePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const previewLabel =
    hasFiles
      ? pendingFiles.map((f) => f.name).join(', ')
      : text.trim().slice(0, 80) || 'Inkast';
  const domainHint = inkastSourceModuleHint(sourceModule);
  const primaryItem = lastBatch ? primaryInkastItem(lastBatch) : null;
  const destinationLink = primaryItem ? inkastDestinationLink(primaryItem) : null;
  const barnenBridge =
    showBarnenBridge && primaryItem && userId ? inkastBarnenBridgeProps(primaryItem) : null;
  const dagbokWeave =
    showDagbokWeave && primaryItem ? inkastDagbokWeaveProps(primaryItem) : null;

  useEffect(() => {
    if (!focusOnCompose || phase !== 'compose') return;
    textareaRef.current?.focus();
  }, [focusOnCompose, phase]);

  return (
    <BentoCard
      title={compact ? 'Skriv här' : 'Skriv — sorteras till rätt arkiv'}
      icon={<PenLine className="h-4 w-4" />}
      glow="gold"
    >
      <p className="mb-3 text-sm text-text-muted">
        Granska AI-förslag eller välj arkiv manuellt innan det sparas.
      </p>

      {composeHint ? (
        <p className="mb-3 rounded-xl border border-border/30 bg-surface-2/60 px-3 py-2 text-xs text-text-muted">
          {composeHint}
        </p>
      ) : domainHint ? (
        <p className="mb-3 rounded-xl border border-border/30 bg-surface-2/60 px-3 py-2 text-xs text-text-dim">
          {domainHint}
        </p>
      ) : null}

      {(phase === 'compose' || phase === 'done') && (
        <>
          <textarea
            ref={textareaRef}
            className="input-glass min-h-[100px] w-full resize-y text-sm"
            placeholder="Observation, meddelande, minne…"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (e.target.value.trim()) setPendingFiles([]);
            }}
            disabled={phase !== 'compose' || hasFiles}
          />

          {allowFiles && (
            <>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="btn-pill--ghost text-xs"
                  disabled={phase !== 'compose'}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span className="inline-flex items-center gap-1">
                    <FileUp className="h-3 w-3" />
                    En fil eller flera
                  </span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="sr-only"
                  accept={INKAST_FILE_ACCEPT}
                  onChange={(e) => void handleFilePick(e.target.files)}
                />
              </div>

              {pendingFiles.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {pendingFiles.map((file, index) => (
                    <li
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between gap-2 rounded-xl border border-border/30 bg-surface-2/60 px-3 py-2 text-xs text-text-muted"
                    >
                      <span className="truncate">{file.name}</span>
                      <button
                        type="button"
                        className="shrink-0 text-text-dim hover:text-accent"
                        aria-label={`Ta bort ${file.name}`}
                        onClick={() => removePendingFile(index)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {canBrusfilter && hasText && !hasFiles && (
              <button
                type="button"
                className="btn-pill--secondary inline-flex items-center gap-1.5 text-sm"
                onClick={startBrusfilterStep}
              >
                <Filter className="h-3.5 w-3.5" aria-hidden />
                Filtrera brus först
              </button>
            )}
            <button
              type="button"
              className="btn-pill--primary text-sm"
              disabled={!canPreview}
              onClick={() => void handlePreview()}
            >
              Förhandsgranska
            </button>
            {phase === 'done' && (
              <button type="button" className="btn-pill--ghost text-sm" onClick={resetFlow}>
                Nytt inkast
              </button>
            )}
          </div>
          
          <CaptureBreathingWidget />
        </>
      )}

      {phase === 'brusfilter' && hasText && (
        <InkastBrusfilterPreview
          rawText={text.trim()}
          onAccept={handleBrusfilterAccept}
          onKeepOriginal={handleBrusfilterKeepOriginal}
          onBack={() => {
            setPhase('compose');
            setError(null);
          }}
        />
      )}

      {phase === 'analyzing' && (
        <div className="flex flex-col items-center gap-3 py-6">
          <CalmBreathingCircle size="md" />
          <p className="text-sm text-text-dim">Sorterar…</p>
        </div>
      )}

      {phase === 'debouncing' && (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 border border-border">
            <span className="font-display text-xl text-text">{debounceTimeLeft}</span>
            <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-border"
              />
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-accent transition-all duration-1000 ease-linear"
                strokeDasharray={`${(debounceTimeLeft / 10) * 301} 301`}
              />
            </svg>
          </div>
          <div className="text-center">
            <h3 className="font-medium text-text">Sparar inkast...</h3>
            <p className="mt-1 text-sm text-text-dim">Du kan ångra om du kom på något mer.</p>
          </div>
          <button type="button" onClick={cancelDebounce} className="btn-pill--ghost mt-2">
            Ångra
          </button>
        </div>
      )}

      {wormConfirmOpen && preview && (
        <WormSaveConfirmSheet
          contextLabel={previewLabel}
          busy={phase === 'analyzing'}
          onConfirm={() => {
            setWormConfirmOpen(false);
            void persistInkast(pendingManual);
            setPendingManual(undefined);
          }}
          onCancel={() => {
            setWormConfirmOpen(false);
            setPendingManual(undefined);
          }}
        />
      )}

      {(phase === 'confirm' || phase === 'edit') && preview && !wormConfirmOpen && (
        <>
          {brusfilterBiffDraft && manualSilo === 'valv' && (
            <div className="mb-3 rounded-xl border border-border/30 bg-surface-2/60 px-3 py-2 text-xs text-text-muted">
              <p className="font-medium text-text-dim">BIFF-utkast (kopiera separat — sparas inte i arkivet)</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-text">{brusfilterBiffDraft}</p>
            </div>
          )}
          <InkastConfirmPanel
          mode={phase === 'edit' ? 'edit' : 'confirm'}
          classification={preview}
          previewLabel={previewLabel}
          busy={false}
          silo={manualSilo}
          tags={manualTags}
          comment={manualComment}
          childAlias={manualChildAlias}
          onConfirm={() => requestPersistInkast()}
          onStartEdit={() => setPhase('edit')}
          onAbort={resetFlow}
          onSiloChange={setManualSilo}
          onTagsChange={setManualTags}
          onCommentChange={setManualComment}
          onChildAliasChange={setManualChildAlias}
          onManualSave={handleManualSave}
          onCancelEdit={() => setPhase('confirm')}
          accentClass="text-accent"
          panelClass="bg-surface-3/50"
        />
        </>
      )}

      {error && (
        <p className="mt-3 text-sm text-rose-300/90" role="alert">
          {error}
        </p>
      )}
      {phase === 'done' && lastBatch && (
        <InkastPostSubmitPanel result={lastBatch} tone="hem">
          {destinationLink && (
            <Link
              to={{ pathname: destinationLink.pathname, search: destinationLink.search }}
              className="inline-block text-xs text-accent underline-offset-2 hover:underline"
            >
              {destinationLink.label}
            </Link>
          )}
          {lastBatch.queued > 0 && (
            <Link
              to={{ pathname: VALV_SAMLA_GRANSKA_LINK.pathname, search: VALV_SAMLA_GRANSKA_LINK.search }}
              className="inline-block text-xs text-accent underline-offset-2 hover:underline"
            >
              Öppna granskningskö
            </Link>
          )}
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
          {sourceModule === 'planering_inkorg' && lastBatch.queued > 0 && (
            <a
              href="#planering-inkast-ko"
              className="inline-block text-xs text-accent underline-offset-2 hover:underline"
            >
              Se kö nedan
            </a>
          )}
        </InkastPostSubmitPanel>
      )}
    </BentoCard>
  );
}
