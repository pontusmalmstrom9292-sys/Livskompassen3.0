import { useState } from 'react';
import {
  Anchor,
  CheckCircle2,
  ChevronDown,
  Circle,
  Loader2,
  Shield,
  Sparkles,
  Wind,
} from 'lucide-react';

const DEFAULT_FOCUS = 'Lugnt samtal med barnen efter skolan.';
const DEFAULT_QUOTE = 'Inte hela dagen — bara det viktigaste nu.';

const DEFAULT_STEPS = [
  { id: 1, text: 'Landa 5 min i bilen innan jag går in', done: true },
  { id: 2, text: 'Möt dem utan telefon i handen', done: false },
  { id: 3, text: 'Lyssna utan att försöka lösa problem', done: false },
] as const;

type Step = { id: number; text: string; done: boolean };

export type MorningAnchorForgeProps = {
  focus?: string;
  quote?: string;
  intention: string;
  onIntentionChange: (value: string) => void;
  onSave: () => void;
  saving?: boolean;
  saved?: boolean;
  error?: string | null;
  disabled?: boolean;
  onGroundingChange?: (active: boolean) => void;
};

/** Spår 1: Obsidian Forge — estetisk, andnings-CTA (prod + lab). */
export function AnchorVariantForge({
  focus = DEFAULT_FOCUS,
  quote = DEFAULT_QUOTE,
  intention,
  onIntentionChange,
  onSave,
  saving = false,
  saved = false,
  error = null,
  disabled = false,
  onGroundingChange,
}: MorningAnchorForgeProps) {
  const [isBreathing, setIsBreathing] = useState(false);

  const toggleBreathing = () => {
    setIsBreathing((v) => {
      const next = !v;
      onGroundingChange?.(next);
      return next;
    });
  };

  if (saved) {
    return (
      <p className="text-center text-xs text-success">Morgonankare sparat.</p>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-surface-3 to-surface shadow-[0_12px_36px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-accent/10 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl border border-white/5"
        style={{ mixBlendMode: 'overlay' }}
        aria-hidden
      />

      <div className="relative z-10 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/30 bg-gradient-to-br from-accent/20 to-transparent shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
              <Anchor size={16} className="text-accent" strokeWidth={1.75} />
            </div>
            <div>
              <span className="mb-0.5 block text-[10px] font-bold uppercase tracking-widest text-accent">
                Dagens Ankare
              </span>
              <span className="text-xs font-medium text-text-muted">Lugn och närvaro</span>
            </div>
          </div>
          <Sparkles size={16} className="text-accent opacity-60" strokeWidth={1.75} />
        </div>

        <div className="mb-6">
          <h3 className="mb-3 font-display-serif text-2xl leading-snug text-text">{focus}</h3>
          <p className="border-l-2 border-accent/30 pl-3 text-sm italic text-text-muted">
            &ldquo;{quote}&rdquo;
          </p>
        </div>

        <button
          type="button"
          onClick={toggleBreathing}
          className={`mb-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 text-sm font-semibold tracking-wide shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-500 ${
            isBreathing
              ? 'border border-success/30 bg-surface-3 text-success shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : 'border border-accent/30 bg-gradient-to-b from-surface-3 to-surface text-accent hover:border-accent/60 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]'
          }`}
        >
          <Wind size={18} className={isBreathing ? 'animate-pulse' : ''} strokeWidth={1.75} />
          {isBreathing ? 'Andas in… (4 sekunder)' : 'HITTA NÄRVARO INFÖR DETTA'}
        </button>

        <label className="sr-only" htmlFor="morning-anchor-intention">
          Dagens enda prioritet
        </label>
        <input
          id="morning-anchor-intention"
          type="text"
          value={intention}
          onChange={(e) => onIntentionChange(e.target.value)}
          placeholder="T.ex. hämta barnen i lugn takt"
          disabled={disabled || saving}
          className="input-glass mb-3 w-full text-sm"
        />
        {error ? <p className="mb-2 text-center text-xs text-danger">{error}</p> : null}
        <button
          type="button"
          onClick={onSave}
          disabled={disabled || saving || intention.trim().length < 2}
          className="btn-pill--accent w-full text-xs disabled:opacity-40"
        >
          {saving ? (
            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
          ) : (
            'Spara morgonankare'
          )}
        </button>
      </div>
    </div>
  );
}

const RING_C = 2 * Math.PI * 16;

/** Spår 2: Taktisk — mikrosteg + progress (lab). */
export function AnchorVariantTactical({
  focus = 'Lugnt samtal med barnen',
  initialSteps = DEFAULT_STEPS,
}: {
  focus?: string;
  initialSteps?: readonly Step[];
}) {
  const [expanded, setExpanded] = useState(true);
  const [steps, setSteps] = useState<Step[]>(() => initialSteps.map((s) => ({ ...s })));

  const toggleStep = (id: number) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));
  };

  const progress = steps.length ? (steps.filter((s) => s.done).length / steps.length) * 100 : 0;
  const dashOffset = RING_C - (progress / 100) * RING_C;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-2 shadow-[0_12px_36px_rgba(0,0,0,0.55)]">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between bg-gradient-to-b from-surface-3/50 to-transparent p-5 text-left transition-colors hover:bg-surface-3/80"
      >
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <Anchor size={14} className="text-accent" strokeWidth={1.75} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
              Aktivt Ankare
            </span>
          </div>
          <h3 className="pr-4 font-display-serif text-lg text-text">{focus}</h3>
        </div>

        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/5 bg-surface shadow-inner">
          <svg className="h-10 w-10 -rotate-90" viewBox="0 0 40 40" aria-hidden>
            <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="2.5" fill="transparent" className="text-slate-800" />
            <circle
              cx="20"
              cy="20"
              r="16"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="transparent"
              strokeDasharray={RING_C}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              className="text-accent transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {progress === 100 ? (
              <CheckCircle2 size={14} className="text-accent" strokeWidth={1.75} />
            ) : (
              <span className="text-[10px] font-bold text-text-muted">{Math.round(progress)}%</span>
            )}
          </div>
        </div>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          expanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-white/5 bg-gradient-to-b from-transparent to-surface/50 p-4 pt-0">
          <div className="mb-4 space-y-1">
            {steps.map((step) => (
              <button
                key={step.id}
                type="button"
                onClick={() => toggleStep(step.id)}
                className="group flex w-full items-center gap-4 rounded-xl p-3 text-left transition-colors hover:bg-white/5"
              >
                <div className="shrink-0 transition-colors">
                  {step.done ? (
                    <CheckCircle2 size={20} className="text-accent" strokeWidth={1.75} />
                  ) : (
                    <Circle size={20} className="text-text-dim group-hover:text-text-muted" strokeWidth={1.75} />
                  )}
                </div>
                <span
                  className={`text-sm font-medium transition-all ${
                    step.done ? 'text-text-dim line-through' : 'text-text'
                  }`}
                >
                  {step.text}
                </span>
              </button>
            ))}
          </div>

          <div className="mx-1 flex items-center justify-between rounded-lg border border-accent-ai/20 bg-surface p-3">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-accent-ai" strokeWidth={1.75} />
              <span className="text-xs font-medium text-text-muted">Stöds av tidigare Valv-insikter</span>
            </div>
            <ChevronDown size={14} className="text-accent-ai" strokeWidth={1.75} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Lab sandbox — Forge + Taktisk utan prod-save. */
export function DagensAnkareLabShell() {
  const [intention, setIntention] = useState('');

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-dim">
          Spår 1: Obsidian Forge (estetisk &amp; grundande)
        </h2>
        <AnchorVariantForge
          intention={intention}
          onIntentionChange={setIntention}
          onSave={() => undefined}
        />
      </section>
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-dim">
          Spår 2: Taktisk (mikrosteg &amp; framsteg)
        </h2>
        <AnchorVariantTactical />
      </section>
    </div>
  );
}

/** @deprecated Använd DagensAnkareLabShell i lab. */
export function DagensAnkareSupermodul() {
  return <DagensAnkareLabShell />;
}
