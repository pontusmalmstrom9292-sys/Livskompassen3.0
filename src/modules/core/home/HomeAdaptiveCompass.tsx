import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sunrise,
  Sun,
  Moon,
  Brain,
  Mic,
  FileUp,
  Send,
  BookOpen,
  Wallet,
  Users,
  Anchor,
  X,
  Loader2,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useStore } from '../store';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { fileToBase64 } from '@/features/lifeJournal/evidence/kompis/api/ingestKnowledgeDocumentService';
import {
  formatInkastResultMessage,
  previewInboxClassification,
  primaryInkastItem,
  submitInkastLite,
  tagsFromInkastClassification,
} from '@/modules/inkast/api/inkastService';
import type { InboxClassification, InboxRouting } from '@/features/lifeJournal/evidence/kompis/api/inboxService';
import { InkastConfirmPanel } from '@/modules/inkast/components/InkastConfirmPanel';
import {
  manualChoiceToSubmitFields,
  routingToUiSilo,
  type InkastManualChoice,
  type InkastUiSilo,
} from '@/modules/inkast/constants/inkastSiloOptions';
import {
  INKAST_FILE_ACCEPT,
  INKAST_UNSUPPORTED_FORMAT_MSG,
  isInkastBinaryFile,
  isInkastSupportedFile,
  isInkastTextFile,
  resolveInkastMime,
} from '@/modules/inkast/constants/inkastMimeTypes';

type TimePhase = 'morgon' | 'dag' | 'kvall';
type SiloType = 'dagbok' | 'valv' | 'barnen' | 'planering';
type InkastState = 'idle' | 'analyzing' | 'confirm' | 'edit' | 'saved';

type Props = {
  onSaved?: () => void;
};

const SILO_CONFIG = {
  dagbok: {
    label: 'Privat Dagbok / Kunskap',
    icon: BookOpen,
    color: 'text-text-muted',
    bg: 'bg-surface-3/50',
  },
  valv: {
    label: 'Verklighetsvalvet (Bevis)',
    icon: ShieldAlert,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  barnen: {
    label: 'Barnens Livslogg',
    icon: Users,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
  },
  planering: {
    label: 'Att Göra / Planering',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  review: {
    label: 'Granskningskö (HITL)',
    icon: ShieldAlert,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
} as const;

type DisplaySilo = keyof typeof SILO_CONFIG;

function classifyInkast(text: string): SiloType {
  const lower = text.toLowerCase();
  if (
    lower.includes('ex') ||
    lower.includes('bråk') ||
    lower.includes('advokat') ||
    lower.includes('sms')
  ) {
    return 'valv';
  }
  if (
    lower.includes('arvid') ||
    lower.includes('kasper') ||
    lower.includes('skola') ||
    lower.includes('hämtning')
  ) {
    return 'barnen';
  }
  if (lower.includes('köpa') || lower.includes('kom ihåg') || lower.includes('måste')) {
    return 'planering';
  }
  return 'dagbok';
}

function heuristicPreviewClassification(text: string, file: File | null): InboxClassification {
  const silo = proposeSilo(text, file);
  const routing: InboxRouting =
    silo === 'valv' ? 'bevis' : silo === 'barnen' ? 'barnen' : 'kunskap';
  return {
    routing,
    tags: ['heuristisk'],
    category: silo,
    confidence: 0.7,
    summary: text.trim().slice(0, 200) || (file?.name ?? 'Bifogad fil'),
    traumaSensitive: false,
    rationale: 'Förhandsgranskning (fil/heuristik).',
  };
}

function proposeSilo(text: string, file: File | null): SiloType {
  if (file && isInkastBinaryFile(file)) {
    const hint = `${file.name} ${text}`.toLowerCase();
    if (/\.(pdf|docx?|xlsx?)$/i.test(file.name) && !text.trim()) {
      return classifyInkast(hint) === 'dagbok' ? 'valv' : classifyInkast(hint);
    }
    return classifyInkast(hint);
  }
  return classifyInkast(text);
}

function routingToDisplaySilo(routing: InboxRouting): DisplaySilo {
  if (routing === 'bevis') return 'valv';
  if (routing === 'barnen') return 'barnen';
  if (routing === 'review') return 'review';
  if (routing === 'kunskap') return 'dagbok';
  return 'dagbok';
}

function phaseGlowClasses(phase: TimePhase): string {
  if (phase === 'morgon') {
    return 'border-b-2 border-b-amber-500/60 shadow-[0_8px_30px_-4px_rgba(245,158,11,0.2)]';
  }
  if (phase === 'dag') {
    return 'border-b-2 border-b-accent/60 shadow-[0_8px_30px_-4px_rgba(212,175,55,0.2)]';
  }
  return 'border-b-2 border-b-indigo-500/60 shadow-[0_8px_30px_-4px_rgba(99,102,241,0.2)]';
}

function phaseHeaderClasses(phase: TimePhase): string {
  if (phase === 'morgon') return 'border-amber-500/20 bg-amber-500/5';
  if (phase === 'dag') return 'border-accent/20 bg-accent/5';
  return 'border-indigo-500/20 bg-indigo-500/5';
}

function phaseTitleClasses(phase: TimePhase): string {
  if (phase === 'morgon') return 'text-amber-400';
  if (phase === 'dag') return 'text-accent';
  return 'text-indigo-400';
}

function phaseLabel(phase: TimePhase): string {
  if (phase === 'morgon') return 'God Morgon';
  if (phase === 'dag') return 'Dagens Fokus';
  return 'God Kväll';
}

function phaseLead(phase: TimePhase): string {
  if (phase === 'morgon') return 'Sätt ditt ankare för dagen.';
  if (phase === 'dag') return 'Ett mikrosteg i taget.';
  return 'Töm hjärnan och checka ut.';
}

/** Adaptiv hemkompass — Obsidian Calm 2.0 (glass + dynamisk botten-glow per dygnsfas). */
export function HomeAdaptiveCompass({ onSaved }: Props) {
  const user = useStore((s) => s.user);
  const navigate = useNavigate();

  const [hour, setHour] = useState(new Date().getHours());
  useEffect(() => {
    const interval = setInterval(() => setHour(new Date().getHours()), 60000);
    return () => clearInterval(interval);
  }, []);

  const timePhase: TimePhase = hour < 10 ? 'morgon' : hour < 17 ? 'dag' : 'kvall';

  const [paralysisTask, setParalysisTask] = useState('');
  const [microStep, setMicroStep] = useState<string | null>(null);

  const [quickText, setQuickText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inkastState, setInkastState] = useState<InkastState>('idle');
  const [previewClassification, setPreviewClassification] = useState<InboxClassification | null>(
    null,
  );
  const [proposedSilo, setProposedSilo] = useState<DisplaySilo>('dagbok');
  const [manualSilo, setManualSilo] = useState<InkastUiSilo>('dagbok');
  const [manualTags, setManualTags] = useState<string[]>([]);
  const [manualComment, setManualComment] = useState('');
  const [manualChildAlias, setManualChildAlias] = useState('');
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [inkastError, setInkastError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { supported: micSupported, isListening, start: startMic, stop: stopMic } = useSpeechToText({
    lang: 'sv-SE',
    onFinal: (transcript) => {
      setQuickText((prev) => (prev.trim() ? `${prev.trim()} ${transcript}` : transcript));
    },
  });

  const toggleMic = () => {
    if (!micSupported) return;
    if (isListening) stopMic();
    else startMic();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isInkastSupportedFile(file)) {
      setInkastError(INKAST_UNSUPPORTED_FORMAT_MSG);
      return;
    }
    setInkastError(null);
    setSelectedFile(file);
    const isImage =
      file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif)$/i.test(file.name);
    if (isImage) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
    }
  };

  const clearAttachment = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetInkast = () => {
    setQuickText('');
    clearAttachment();
    setPreviewClassification(null);
    setInkastState('idle');
    setSavedMessage(null);
    setInkastError(null);
  };

  const hasAttachment = selectedFile != null;

  const handleAnalyzeInkast = async () => {
    if (!quickText.trim() && !hasAttachment) return;
    setInkastError(null);
    setInkastState('analyzing');

    try {
      let classification: InboxClassification;
      if (quickText.trim().length >= 12) {
        classification = await previewInboxClassification({
          text: quickText.trim(),
          fileName: selectedFile?.name ?? 'hem-inkast.txt',
        });
      } else {
        classification = heuristicPreviewClassification(quickText, selectedFile);
      }
      setPreviewClassification(classification);
      setProposedSilo(routingToDisplaySilo(classification.routing));
      setManualSilo(routingToUiSilo(classification.routing));
      setManualTags(tagsFromInkastClassification(classification));
      setManualComment(classification.summary);
      setManualChildAlias(classification.childAlias ?? '');
      setInkastState('confirm');
    } catch (err) {
      setInkastError(err instanceof Error ? err.message : 'Kunde inte analysera.');
      setInkastState('idle');
    }
  };

  const runInkastSubmit = async (manual?: InkastManualChoice) => {
    if (!user) return;
    setInkastState('analyzing');
    setInkastError(null);

    try {
      const manualFields = manual ? manualChoiceToSubmitFields(manual) : {};
      let batch;

      if (selectedFile && isInkastBinaryFile(selectedFile)) {
        const base64 = await fileToBase64(selectedFile);
        batch = await submitInkastLite({
          base64Files: [base64],
          mimeTypes: [resolveInkastMime(selectedFile)],
          fileNames: [selectedFile.name],
          sourceModule: 'hem_smart_inkast',
          ...manualFields,
        });
      } else if (selectedFile && isInkastTextFile(selectedFile)) {
        const content = (await selectedFile.text()).trim();
        if (content.length < 12) throw new Error('Filen är tom eller för kort.');
        batch = await submitInkastLite({
          text: content.slice(0, 12_000),
          fileName: selectedFile.name,
          sourceModule: 'hem_smart_inkast',
          ...manualFields,
        });
      } else {
        const trimmed = quickText.trim();
        if (trimmed.length < 12) throw new Error('Skriv minst några rader, eller bifoga en fil.');
        batch = await submitInkastLite({
          text: trimmed,
          fileName: 'hem-inkast.txt',
          sourceModule: 'hem_smart_inkast',
          ...manualFields,
        });
      }

      const primary = primaryInkastItem(batch);
      setProposedSilo(routingToDisplaySilo(primary.classification.routing));
      setSavedMessage(formatInkastResultMessage(batch));
      setInkastState('saved');
      onSaved?.();
      window.setTimeout(resetInkast, 3500);
    } catch (err) {
      console.error('Kunde inte spara inkast', err);
      setInkastError(err instanceof Error ? err.message : 'Inkast misslyckades.');
      setInkastState(manual ? 'edit' : 'confirm');
    }
  };

  const handleConfirmSave = () => {
    void runInkastSubmit();
  };

  const handleManualSave = (choice: InkastManualChoice) => {
    void runInkastSubmit(choice);
  };

  const handleParalysisBreakdown = () => {
    if (!paralysisTask.trim()) return;
    setMicroStep(
      'Gör bara detta: Öppna det du behöver och titta på det i 1 minut. Stäng sedan om det är för tungt.',
    );
  };

  const attachmentLabel =
    selectedFile?.name ?? (quickText.trim() ? quickText.trim().slice(0, 40) : 'Inkast');

  return (
    <div className="animate-fade-in mx-auto flex w-full max-w-2xl flex-col gap-5">
      <div className="grid grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => navigate('/dagbok')}
          className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border border-border/30 bg-surface-2/60 p-3.5 shadow-sm backdrop-blur-md transition-all hover:bg-surface-3"
        >
          <BookOpen className="h-4 w-4 text-accent" aria-hidden />
          <span className="text-[10px] font-medium text-text-muted">Dagbok</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/vardagen?tab=ekonomi')}
          className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border border-border/30 bg-surface-2/60 p-3.5 shadow-sm backdrop-blur-md transition-all hover:bg-surface-3"
        >
          <Wallet className="h-4 w-4 text-emerald-400" aria-hidden />
          <span className="text-[10px] font-medium text-text-muted">Ekonomi</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/familjen')}
          className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border border-border/30 bg-surface-2/60 p-3.5 shadow-sm backdrop-blur-md transition-all hover:bg-surface-3"
        >
          <Users className="h-4 w-4 text-indigo-400" aria-hidden />
          <span className="text-[10px] font-medium text-text-muted">Barnen</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/familjen?tab=hamn')}
          className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border border-border/30 bg-surface-2/60 p-3.5 shadow-sm backdrop-blur-md transition-all hover:bg-surface-3"
        >
          <Anchor className="h-4 w-4 text-amber-500" aria-hidden />
          <span className="text-[10px] font-medium text-text-muted">Hamnen</span>
        </button>
      </div>

      <div
        className={clsx(
          'calm-card flex flex-col overflow-hidden rounded-3xl border border-border/30 bg-surface-2/70 backdrop-blur-xl transition-all duration-700',
          phaseGlowClasses(timePhase),
        )}
      >
        <div
          className={clsx(
            'flex items-center justify-between border-b px-6 py-5',
            phaseHeaderClasses(timePhase),
          )}
        >
          <div className="flex items-center gap-3.5">
            {timePhase === 'morgon' && <Sunrise className="h-6 w-6 text-amber-400" aria-hidden />}
            {timePhase === 'dag' && <Sun className="h-6 w-6 text-accent" aria-hidden />}
            {timePhase === 'kvall' && <Moon className="h-6 w-6 text-indigo-400" aria-hidden />}
            <div>
              <h2
                className={clsx(
                  'text-sm font-bold uppercase tracking-widest',
                  phaseTitleClasses(timePhase),
                )}
              >
                {phaseLabel(timePhase)}
              </h2>
              <p className="mt-1 text-[11px] text-text-muted">{phaseLead(timePhase)}</p>
            </div>
          </div>
        </div>

        <div className="flex min-h-[140px] flex-col justify-center p-6">
          {timePhase === 'morgon' && (
            <div className="animate-fade-in text-center">
              <p className="mx-auto max-w-sm text-xs leading-relaxed text-text-muted">
                Allt yttre brus stannar utanför. Du är en trygg hamn. Vad är din enda riktiga
                prioritet idag? Använd inkastet nedan.
              </p>
            </div>
          )}

          {timePhase === 'dag' && (
            <div className="animate-fade-in space-y-4">
              {!microStep ? (
                <>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-text-dim">
                    <Brain className="h-4 w-4" aria-hidden />
                    Paralys-brytaren. Sitter du fast?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={paralysisTask}
                      onChange={(e) => setParalysisTask(e.target.value)}
                      placeholder="Vad drar du dig för att göra?"
                      className="flex-1 rounded-xl border border-border/50 bg-surface-3/50 px-4 py-2.5 text-xs text-text transition-colors focus:border-accent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleParalysisBreakdown}
                      disabled={!paralysisTask.trim()}
                      className="rounded-xl bg-accent/10 px-4 py-2.5 text-xs font-semibold text-accent transition-colors hover:bg-accent/20 disabled:opacity-50"
                    >
                      Hjälp mig
                    </button>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-accent/20 bg-accent/10 p-5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim">
                    Ditt enda uppdrag:
                  </span>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-text">{microStep}</p>
                  <button
                    type="button"
                    onClick={() => setMicroStep(null)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-surface-2 py-2.5 text-xs font-semibold text-accent transition-colors hover:text-accent-light"
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden />
                    Klar, gå vidare
                  </button>
                </div>
              )}
            </div>
          )}

          {timePhase === 'kvall' && (
            <div className="animate-fade-in text-center">
              <p className="mx-auto max-w-sm text-xs leading-relaxed text-text-muted">
                Skriv av dig dagens brus i Inkastet här nedanför. Lämna allt som inte är ditt
                ansvar.
              </p>
            </div>
          )}
        </div>

        <div
          id="inkast"
          className="flex flex-col gap-3 border-t border-border/20 bg-surface-3/20 p-5 scroll-mt-24"
        >
          <div className="mb-1 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-text-dim">
              Smart Inkast
            </span>
          </div>

          {selectedImage && inkastState === 'idle' && (
            <div className="relative inline-block h-16 w-16 overflow-hidden rounded-xl shadow-md">
              <img src={selectedImage} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={clearAttachment}
                className="absolute right-1 top-1 rounded-full bg-black/70 p-1 transition-colors hover:bg-black"
                aria-label="Ta bort bilaga"
              >
                <X className="h-3 w-3 text-white" />
              </button>
            </div>
          )}

          {selectedFile && !selectedImage && inkastState === 'idle' && (
            <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-surface-2/80 px-3 py-2">
              <FileUp className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
              <span className="min-w-0 flex-1 truncate text-xs text-text">{selectedFile.name}</span>
              <button
                type="button"
                onClick={clearAttachment}
                className="rounded-full p-1 text-text-muted hover:text-text"
                aria-label="Ta bort fil"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {inkastError && inkastState !== 'saved' && (
            <p className="text-xs text-amber-400/90">{inkastError}</p>
          )}

          {!user && (
            <p className="text-center text-[10px] text-text-dim">Logga in för att spara inkast.</p>
          )}

          {inkastState === 'idle' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMic}
                disabled={!micSupported}
                className={clsx(
                  'flex-shrink-0 cursor-pointer rounded-full p-3 shadow-sm transition-all',
                  isListening
                    ? 'animate-pulse bg-danger/20 text-danger'
                    : 'border border-border/40 bg-surface-3 text-text-muted hover:bg-surface-2 hover:text-text',
                )}
                aria-label={isListening ? 'Stoppa inspelning' : 'Diktera med mikrofon'}
              >
                <Mic className="h-4 w-4" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept={INKAST_FILE_ACCEPT}
                className="hidden"
                onChange={handleFileSelect}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 cursor-pointer rounded-full border border-border/40 bg-surface-3 p-3 text-text-muted shadow-sm transition-all hover:bg-surface-2 hover:text-text"
                aria-label="Bifoga fil (pdf, bild, dokument)"
              >
                <FileUp className="h-4 w-4" />
              </button>

              <input
                type="text"
                value={quickText}
                onChange={(e) => setQuickText(e.target.value)}
                placeholder="Dumpa en tanke, uppgift eller händelse..."
                className="flex-1 rounded-full border border-border/40 bg-surface-2/80 px-5 py-3 text-xs text-text shadow-inner backdrop-blur-md transition-colors focus:border-accent focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAnalyzeInkast();
                }}
              />

              <button
                type="button"
                onClick={handleAnalyzeInkast}
                disabled={!user || (!quickText.trim() && !hasAttachment)}
                className="flex-shrink-0 cursor-pointer rounded-full bg-accent p-3 text-bg shadow-md transition-all disabled:cursor-not-allowed disabled:bg-surface-3 disabled:text-text-muted disabled:opacity-40 disabled:shadow-none"
                aria-label="Analysera inkast"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          )}

          {inkastState === 'analyzing' && (
            <div className="flex animate-pulse items-center justify-center gap-3 py-4 text-xs font-medium text-accent">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Sorterar och krypterar...
            </div>
          )}

          {(inkastState === 'confirm' || inkastState === 'edit') && previewClassification && (
            <InkastConfirmPanel
              mode={inkastState === 'edit' ? 'edit' : 'confirm'}
              classification={previewClassification}
              previewLabel={attachmentLabel}
              busy={false}
              silo={manualSilo}
              tags={manualTags}
              comment={manualComment}
              childAlias={manualChildAlias}
              onConfirm={handleConfirmSave}
              onStartEdit={() => setInkastState('edit')}
              onAbort={resetInkast}
              onSiloChange={setManualSilo}
              onTagsChange={setManualTags}
              onCommentChange={setManualComment}
              onChildAliasChange={setManualChildAlias}
              onManualSave={handleManualSave}
              onCancelEdit={() => setInkastState('confirm')}
              accentClass={SILO_CONFIG[proposedSilo].color}
              panelClass={SILO_CONFIG[proposedSilo].bg}
            />
          )}

          {inkastState === 'saved' && (
            <div className="animate-fade-in flex flex-col items-center justify-center gap-1 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-5 text-xs font-semibold text-emerald-400 shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
                <span>{savedMessage ?? `Sparat i ${SILO_CONFIG[proposedSilo].label}.`}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
