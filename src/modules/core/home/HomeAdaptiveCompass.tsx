import { NAV_PATHS } from '@/core/navigation/navTruth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sunrise,
  Sun,
  Moon,
  Brain,
  BookOpen,
  Wallet,
  Users,
  Anchor,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { clsx } from 'clsx';
import { CaptureSuperModule } from '@/modules/capture/CaptureSuperModule';

type TimePhase = 'morgon' | 'dag' | 'kvall';

type Props = {
  onSaved?: () => void;
};

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
  const navigate = useNavigate();

  const [hour, setHour] = useState(new Date().getHours());
  useEffect(() => {
    const interval = setInterval(() => setHour(new Date().getHours()), 60000);
    return () => clearInterval(interval);
  }, []);

  const timePhase: TimePhase = hour < 10 ? 'morgon' : hour < 17 ? 'dag' : 'kvall';

  const [paralysisTask, setParalysisTask] = useState('');
  const [microStep, setMicroStep] = useState<string | null>(null);

  const handleParalysisBreakdown = () => {
    if (!paralysisTask.trim()) return;
    setMicroStep(
      'Gör bara detta: Öppna det du behöver och titta på det i 1 minut. Stäng sedan om det är för tungt.',
    );
  };

  return (
    <div className="animate-fade-in mx-auto flex w-full max-w-2xl flex-col gap-5">
      <div className="grid grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => navigate(NAV_PATHS.HJARTAT)}
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
                    <Brain className="h-3.5 w-3.5 text-accent" aria-hidden />
                    Paralys-Brytaren
                  </label>
                  <input
                    type="text"
                    value={paralysisTask}
                    onChange={(e) => setParalysisTask(e.target.value)}
                    placeholder="Vad skjuter du upp just nu?"
                    className="input-glass w-full text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleParalysisBreakdown}
                    disabled={!paralysisTask.trim()}
                    className="btn-pill--accent w-full text-xs disabled:opacity-40"
                  >
                    Ge mig ett mikrosteg
                  </button>
                </>
              ) : (
                <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 text-center">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-accent">
                    Ditt mikrosteg
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
          <CaptureSuperModule variant="kompass" onSaved={onSaved} />
        </div>
      </div>
    </div>
  );
}
