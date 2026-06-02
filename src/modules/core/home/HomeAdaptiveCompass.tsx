import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sunrise,
  Sun,
  Moon,
  Brain,
  Mic,
  Image as ImageIcon,
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
import {
  createJournalEntryId,
  saveJournalEntry,
  saveVaultLog,
  saveChildrenLog,
} from '../firebase/firestore';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { uploadJournalMemory } from '@/features/lifeJournal/diary/diary/utils/journalUploadHelper';

type TimePhase = 'morgon' | 'dag' | 'kvall';
type SiloType = 'dagbok' | 'valv' | 'barnen' | 'planering';
type InkastState = 'idle' | 'analyzing' | 'confirm' | 'saved';

type Props = {
  onSaved?: () => void;
};

const SILO_CONFIG = {
  dagbok: {
    label: 'Privat Dagbok',
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
} as const;

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
  const [proposedSilo, setProposedSilo] = useState<SiloType>('dagbok');
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setSelectedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetInkast = () => {
    setQuickText('');
    clearImage();
    setInkastState('idle');
  };

  const handleAnalyzeInkast = () => {
    if (!quickText.trim() && !selectedImage) return;
    setInkastState('analyzing');

    window.setTimeout(() => {
      setProposedSilo(classifyInkast(quickText));
      setInkastState('confirm');
    }, 1200);
  };

  const saveJournalWithOptionalImage = async (
    mood: string,
    text: string,
    category: string,
  ) => {
    if (!user) return;
    let entryId: string | undefined;
    let attachment: Awaited<ReturnType<typeof uploadJournalMemory>> | undefined;

    if (selectedFile) {
      entryId = createJournalEntryId();
      attachment = await uploadJournalMemory(user.uid, entryId, selectedFile);
    }

    await saveJournalEntry(
      user.uid,
      { mood, text, category, attachment },
      entryId ? { entryId } : undefined,
    );
  };

  const handleConfirmSave = async () => {
    if (!user) return;
    setInkastState('analyzing');

    try {
      const text = quickText.trim() || 'Bild uppladdad via Smart Inkast.';

      if (proposedSilo === 'dagbok') {
        await saveJournalWithOptionalImage('⚡ Inkast', text, 'snabb_inkast');
      } else if (proposedSilo === 'valv') {
        await saveVaultLog(user.uid, {
          action: 'Inkast',
          truth: text,
          category: 'bevis_inkast',
          entryType: 'simple',
        });
      } else if (proposedSilo === 'barnen') {
        await saveChildrenLog(user.uid, {
          childAlias: 'Familjen',
          observation: text,
          category: 'allmänt',
          authorRole: 'parent',
        });
      } else {
        await saveJournalWithOptionalImage('📝 Uppgift', text, 'planering');
      }

      setInkastState('saved');
      onSaved?.();
      window.setTimeout(resetInkast, 2000);
    } catch (err) {
      console.error('Kunde inte spara', err);
      setInkastState('confirm');
    }
  };

  const handleParalysisBreakdown = () => {
    if (!paralysisTask.trim()) return;
    setMicroStep(
      'Gör bara detta: Öppna det du behöver och titta på det i 1 minut. Stäng sedan om det är för tungt.',
    );
  };

  const ActiveSiloIcon = SILO_CONFIG[proposedSilo].icon;

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
                onClick={clearImage}
                className="absolute right-1 top-1 rounded-full bg-black/70 p-1 transition-colors hover:bg-black"
                aria-label="Ta bort bild"
              >
                <X className="h-3 w-3 text-white" />
              </button>
            </div>
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
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                className="hidden"
                onChange={handleImageSelect}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 cursor-pointer rounded-full border border-border/40 bg-surface-3 p-3 text-text-muted shadow-sm transition-all hover:bg-surface-2 hover:text-text"
                aria-label="Bifoga bild"
              >
                <ImageIcon className="h-4 w-4" />
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
                disabled={!user || (!quickText.trim() && !selectedImage)}
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

          {inkastState === 'confirm' && (
            <div
              className={clsx(
                'animate-fade-in flex flex-col gap-4 rounded-2xl p-5 shadow-lg backdrop-blur-md',
                SILO_CONFIG[proposedSilo].bg,
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim">
                    AI-förslag:
                  </span>
                  <div
                    className={clsx(
                      'mt-1.5 flex items-center gap-2 text-sm font-semibold',
                      SILO_CONFIG[proposedSilo].color,
                    )}
                  >
                    <ActiveSiloIcon className="h-4 w-4" aria-hidden />
                    {SILO_CONFIG[proposedSilo].label}
                  </div>
                </div>
                <div className="min-w-0 text-right">
                  <span className="block max-w-[140px] truncate text-xs text-text">
                    {quickText || 'Bild'}
                  </span>
                </div>
              </div>

              <div className="mt-1 flex gap-2.5">
                <button
                  type="button"
                  onClick={handleConfirmSave}
                  disabled={!user}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border/50 bg-surface-2 py-2.5 text-xs font-semibold text-text shadow-sm transition-colors hover:bg-surface-3 disabled:opacity-40"
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                  Godkänn
                </button>
                <button
                  type="button"
                  onClick={() => setInkastState('idle')}
                  className="bg-transparent px-5 py-2.5 text-xs font-semibold text-text-muted transition-colors hover:text-text"
                >
                  Ändra
                </button>
              </div>
            </div>
          )}

          {inkastState === 'saved' && (
            <div className="animate-fade-in flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 py-5 text-xs font-semibold text-emerald-400 shadow-sm">
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Tryggt sparat i {SILO_CONFIG[proposedSilo].label}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
