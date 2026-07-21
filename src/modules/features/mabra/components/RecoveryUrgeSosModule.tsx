/** @locked MOD-FAM-DROG — låst modul; unlock via docs/evaluations/*-unlock-MOD-FAM-DROG.md */
/**
 * Kat 8 / Fas 23C + Våg 1 — offline-först SOS Ankare (Zero Footprint, ingen logg).
 * Lager: L1 ankare → andning/jordning/1·3·10/urge/HALT → L3 efter.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Button, Modal, textStyles } from '@/design-system';
import { useDsReducedMotion } from '@/design-system/motion/useDsReducedMotion';
import {
  immersiveModalOverlayClass,
  immersiveModalPanelClass,
} from '@/core/ui/zenModeOverlayClasses';
import {
  BREATH_PHASE_SECONDS,
  GROUNDING_STEPS,
  RECOVERY_SOS_ANCHOR_COPY,
} from '@/features/dailyLife/wellbeing/mabra/constants';
import {
  AFTER_COPY,
  ANCHOR_EXTRA,
  ANTI_BUY_COPY,
  DISTRACT_PROMPTS_1MIN,
  DISTRACT_PROMPTS_3MIN,
  HALT_ITEMS,
  PROTOCOL_META,
  URGE_SURF_COPY,
} from '@/features/dailyLife/drogfrihet/content/akutProtocolContent';
import { recordSosOpenLocal } from '@/features/dailyLife/drogfrihet/lib/recoveryPlanLocal';
import { touchLastSosAt } from '@/features/dailyLife/drogfrihet/api/recoveryProfileService';
import { pushKpiEvent } from '@/features/dailyLife/drogfrihet/lib/recoveryKpiLocal';

type BreathPhase = keyof typeof BREATH_PHASE_SECONDS;
type ProtocolMins = 1 | 3 | 10;
type SosScreen =
  | 'anchor'
  | 'breathing'
  | 'grounding'
  | 'halt'
  | 'protocol'
  | 'urgeSurf'
  | 'antiBuy'
  | 'after'
  | 'hold';

const PHASE_LABEL: Record<BreathPhase, string> = {
  inhale: 'Andas in…',
  hold: 'Håll…',
  exhale: 'Andas ut…',
};

const PHASE_SCALE: Record<BreathPhase, number> = {
  inhale: 1.18,
  hold: 1.18,
  exhale: 0.82,
};

function nextPhase(phase: BreathPhase): BreathPhase {
  if (phase === 'inhale') return 'hold';
  if (phase === 'hold') return 'exhale';
  return 'inhale';
}

type Props = {
  onClose: () => void;
  /** Optional — metadata only (lastSosAt + lokal räknare), ingen craving-text. */
  uid?: string;
};

export function RecoveryUrgeSosModule({ onClose, uid }: Props) {
  const reducedMotion = useDsReducedMotion();
  const [screen, setScreen] = useState<SosScreen>('anchor');
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [groundStep, setGroundStep] = useState(0);
  const [protocolMins, setProtocolMins] = useState<ProtocolMins>(1);
  const [protocolStep, setProtocolStep] = useState(0);
  const [haltChecked, setHaltChecked] = useState<Record<string, boolean>>({});
  const [urgeSecondsLeft, setUrgeSecondsLeft] = useState(URGE_SURF_COPY.defaultSeconds);
  const [intensity, setIntensity] = useState<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const urgeIntervalRef = useRef<number | null>(null);
  const recordedOpen = useRef(false);

  useEffect(() => {
    if (recordedOpen.current) return;
    recordedOpen.current = true;
    recordSosOpenLocal(uid);
    pushKpiEvent({ type: 'akut_start', at: Date.now() }, uid);
    if (uid) void touchLastSosAt(uid);
  }, [uid]);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current != null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const clearUrgeInterval = useCallback(() => {
    if (urgeIntervalRef.current != null) {
      window.clearInterval(urgeIntervalRef.current);
      urgeIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (screen !== 'breathing' && screen !== 'hold') {
      clearTimer();
      return;
    }
    setPhase('inhale');
    const schedule = (current: BreathPhase) => {
      setPhase(current);
      const delay = BREATH_PHASE_SECONDS[current] * 1000;
      timeoutRef.current = window.setTimeout(() => {
        schedule(nextPhase(current));
      }, delay);
    };
    schedule('inhale');
    return clearTimer;
  }, [screen, clearTimer]);

  useEffect(() => {
    setGroundStep(0);
  }, [screen]);

  useEffect(() => {
    if (screen !== 'urgeSurf') {
      clearUrgeInterval();
      return;
    }
    setUrgeSecondsLeft(URGE_SURF_COPY.defaultSeconds);
    urgeIntervalRef.current = window.setInterval(() => {
      setUrgeSecondsLeft((s) => {
        if (s <= 1) {
          clearUrgeInterval();
          setScreen('after');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return clearUrgeInterval;
  }, [screen, clearUrgeInterval]);

  const groundStepData = GROUNDING_STEPS[groundStep];
  const isLastGroundStep = groundStep === GROUNDING_STEPS.length - 1;

  const protocolPrompt = useMemo(() => {
    if (protocolMins === 1) {
      return DISTRACT_PROMPTS_1MIN[protocolStep % DISTRACT_PROMPTS_1MIN.length]!;
    }
    return DISTRACT_PROMPTS_3MIN[protocolStep % DISTRACT_PROMPTS_3MIN.length]!;
  }, [protocolMins, protocolStep]);

  const handleGroundNext = () => {
    if (isLastGroundStep) {
      setScreen('after');
      return;
    }
    setGroundStep((i) => i + 1);
  };

  const handleBackToAnchor = () => {
    clearTimer();
    clearUrgeInterval();
    setScreen('anchor');
  };

  const openProtocol = (mins: ProtocolMins) => {
    setProtocolMins(mins);
    setProtocolStep(0);
    pushKpiEvent({ type: 'protocol', mins, at: Date.now() }, uid);
    setScreen('protocol');
  };

  const scaleStyle = (p: BreathPhase) =>
    reducedMotion
      ? undefined
      : {
          transform: `scale(${PHASE_SCALE[p]})`,
          transitionDuration: `${BREATH_PHASE_SECONDS[p]}s`,
        };

  const headerTitle =
    screen === 'anchor'
      ? 'SOS Ankare'
      : screen === 'after'
        ? 'Efter'
        : screen === 'halt'
          ? 'HALT'
          : screen === 'urgeSurf'
            ? URGE_SURF_COPY.title
            : screen === 'antiBuy'
              ? ANTI_BUY_COPY.title
              : screen === 'protocol'
                ? PROTOCOL_META[protocolMins].label
                : screen === 'hold'
                  ? 'Håll kvar'
                  : screen === 'breathing'
                    ? 'Andas'
                    : 'Jordning';

  return (
    <Modal
      open
      onClose={onClose}
      hideHeader
      ariaLabel="SOS Ankare — akut stöd"
      className={`${immersiveModalOverlayClass} !z-[100]`}
      panelClassName={`${immersiveModalPanelClass} !bg-gradient-to-b !from-bg !via-surface !to-surface-2`}
    >
      <div className="flex h-full min-h-[100dvh] flex-col">
        <header className="flex shrink-0 items-center justify-between border-b-[0.5px] border-border px-4 py-3 sm:px-6">
          {screen === 'anchor' ? (
            <p className={textStyles.eyebrow}>{headerTitle}</p>
          ) : (
            <button
              type="button"
              onClick={handleBackToAnchor}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border-[0.5px] border-border/60 px-2 py-1.5 text-xs text-text-muted transition-colors hover:border-accent/30 hover:bg-surface-3 hover:text-text"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Tillbaka
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] rounded-xl border-[0.5px] border-border/60 p-2 text-text-muted transition-colors hover:border-accent/30 hover:bg-surface-3 hover:text-text"
            aria-label="Stäng SOS Ankare"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </header>

        <div className="calm-scroll-island flex flex-1 flex-col items-center px-4 py-6 sm:px-6">
          {screen === 'anchor' ? (
            <div className="flex w-full max-w-sm flex-1 flex-col justify-center gap-5">
              <p className="text-center font-display-serif text-lg leading-relaxed text-accent">
                {RECOVERY_SOS_ANCHOR_COPY.anchorLine}
              </p>
              <p className="text-center text-xs text-text-dim">{ANCHOR_EXTRA.haltLine}</p>
              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  onClick={() => setScreen('breathing')}
                  variant="accent"
                  className="--accent flex min-h-[56px] flex-col items-center gap-1 py-4"
                >
                  <span>{RECOVERY_SOS_ANCHOR_COPY.breatheLabel}</span>
                  <span className="text-xs font-normal normal-case tracking-normal opacity-80">
                    {RECOVERY_SOS_ANCHOR_COPY.breatheLead}
                  </span>
                </Button>
                <Button
                  type="button"
                  onClick={() => setScreen('grounding')}
                  variant="secondary"
                  className="--secondary flex min-h-[56px] flex-col items-center gap-1 py-4"
                >
                  <span>{RECOVERY_SOS_ANCHOR_COPY.groundLabel}</span>
                  <span className="text-xs font-normal normal-case tracking-normal opacity-80">
                    {RECOVERY_SOS_ANCHOR_COPY.groundLead}
                  </span>
                </Button>
                <p className={`text-center ${textStyles.eyebrow}`}>{ANCHOR_EXTRA.protocolHint}</p>
                <div className="grid grid-cols-3 gap-2">
                  {([1, 3, 10] as const).map((m) => (
                    <Button
                      key={m}
                      type="button"
                      variant="ghost"
                      onClick={() => openProtocol(m)}
                      className="--ghost min-h-[48px] flex-col py-2 text-xs"
                    >
                      <span className="font-medium">{PROTOCOL_META[m].label}</span>
                      <span className="normal-case tracking-normal text-text-dim opacity-80">
                        {PROTOCOL_META[m].lead}
                      </span>
                    </Button>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setScreen('urgeSurf')}
                  className="--ghost min-h-[48px] py-3 text-sm"
                >
                  {ANCHOR_EXTRA.urgeLabel}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setScreen('halt')}
                  className="--ghost min-h-[48px] py-3 text-sm"
                >
                  {ANCHOR_EXTRA.haltLabel}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setScreen('antiBuy')}
                  className="--ghost min-h-[48px] py-3 text-sm"
                >
                  {ANCHOR_EXTRA.antiBuyLabel}
                </Button>
                <Button type="button" onClick={onClose} variant="ghost" className="--ghost py-3 text-sm">
                  {RECOVERY_SOS_ANCHOR_COPY.closeLabel}
                </Button>
              </div>
            </div>
          ) : null}

          {screen === 'breathing' || screen === 'hold' ? (
            <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center">
              <div className="flex flex-col items-center space-y-6">
                <p className="text-xs uppercase tracking-[0.2em] text-text-dim">4 · 7 · 8</p>
                <div className="relative flex h-52 w-52 items-center justify-center">
                  <div
                    aria-hidden
                    className="absolute inset-4 rounded-full bg-accent/[0.07] blur-2xl transition-transform ease-in-out"
                    style={scaleStyle(phase)}
                  />
                  <div
                    className="relative flex h-36 w-36 items-center justify-center rounded-full border-[0.5px] border-accent/30 bg-accent/[0.08] shadow-[0_0_40px_-8px_rgba(212,175,55,0.25)] transition-transform ease-in-out"
                    style={scaleStyle(phase)}
                  >
                    <span className="text-center text-sm text-accent">{PHASE_LABEL[phase]}</span>
                  </div>
                </div>
                <p className="max-w-xs text-center text-sm text-text-muted">
                  Suget stiger och faller. Du surfar bara.
                </p>
                {screen === 'breathing' ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setScreen('after')}
                    className="--secondary min-h-[48px]"
                  >
                    Jag är klar med andningen
                  </Button>
                ) : (
                  <p className="text-xs text-text-dim">Stäng när du vill.</p>
                )}
              </div>
            </div>
          ) : null}

          {screen === 'grounding' ? (
            <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center">
              <div className="flex w-full flex-col items-center space-y-6">
                <p className="text-xs uppercase tracking-[0.2em] text-text-dim">Jordning</p>
                <div className="flex gap-1.5" aria-hidden>
                  {GROUNDING_STEPS.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-1.5 rounded-full ${i <= groundStep ? 'bg-accent' : 'bg-border'}`}
                    />
                  ))}
                </div>
                <div className="w-full rounded-2xl border-[0.5px] border-border bg-surface-2/70 px-5 py-6 text-center backdrop-blur-sm">
                  <p className="font-display text-4xl tabular-nums text-accent">{groundStepData?.count}</p>
                  <p className="mt-2 font-display-serif text-[10px] uppercase tracking-[0.2em] text-text-dim">
                    {groundStepData?.sense}
                  </p>
                  <p className="mt-4 text-base text-text">{groundStepData?.prompt}</p>
                  <p className="mt-2 text-sm text-text-muted">{groundStepData?.detail}</p>
                </div>
                <p className="text-sm text-text-dim">
                  Steg {groundStep + 1} av {GROUNDING_STEPS.length}
                </p>
                <Button
                  type="button"
                  onClick={handleGroundNext}
                  variant="secondary"
                  className="--secondary w-full max-w-sm min-h-[48px]"
                >
                  {isLastGroundStep ? 'Klar — vidare' : 'Nästa'}
                </Button>
              </div>
            </div>
          ) : null}

          {screen === 'halt' ? (
            <div className="flex w-full max-w-sm flex-1 flex-col justify-center gap-4">
              <p className="text-center text-sm text-text-muted">
                Markera det som stämmer — sedan en enkel åtgärd.
              </p>
              <ul className="space-y-2">
                {HALT_ITEMS.map((item) => {
                  const on = Boolean(haltChecked[item.id]);
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() =>
                          setHaltChecked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                        }
                        className={`flex w-full min-h-[52px] flex-col items-start rounded-2xl border-[0.5px] px-4 py-3 text-left transition-colors ${
                          on ? 'border-accent/40 bg-accent/10' : 'border-border bg-surface-2/60'
                        }`}
                      >
                        <span className="text-sm text-accent">
                          {item.id} — {item.label}
                        </span>
                        {on ? <span className="mt-1 text-xs text-text-muted">{item.tip}</span> : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <Button type="button" variant="accent" onClick={() => setScreen('after')} className="--accent min-h-[48px]">
                Vidare
              </Button>
            </div>
          ) : null}

          {screen === 'protocol' ? (
            <div className="flex w-full max-w-sm flex-1 flex-col justify-center gap-5">
              <p className="text-center text-xs uppercase tracking-[0.2em] text-text-dim">
                {PROTOCOL_META[protocolMins].lead}
              </p>
              <p className="text-center font-display-serif text-lg text-accent">{protocolPrompt}</p>
              {protocolMins === 10 ? (
                <p className="text-center text-sm text-text-muted">
                  När du orkar: öppna urge surfing, sedan ett If–Then i huvudet — ”Om X, gör Y”.
                </p>
              ) : null}
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setProtocolStep((s) => s + 1)}
                  className="--secondary min-h-[48px]"
                >
                  Nästa prompt
                </Button>
                {protocolMins === 10 ? (
                  <Button
                    type="button"
                    variant="accent"
                    onClick={() => setScreen('urgeSurf')}
                    className="--accent min-h-[48px]"
                  >
                    Starta urge surfing
                  </Button>
                ) : null}
                <Button type="button" variant="ghost" onClick={() => setScreen('after')} className="--ghost min-h-[48px]">
                  Jag klarade detta
                </Button>
              </div>
            </div>
          ) : null}

          {screen === 'urgeSurf' ? (
            <div className="flex w-full max-w-sm flex-1 flex-col justify-center gap-5">
              <p className="text-center font-display-serif text-base text-accent">{URGE_SURF_COPY.lead}</p>
              <p className="text-center text-sm text-text-muted">{URGE_SURF_COPY.bodyPrompt}</p>
              <p className="text-center text-3xl tabular-nums text-accent" aria-live="polite">
                {Math.floor(urgeSecondsLeft / 60)}:{String(urgeSecondsLeft % 60).padStart(2, '0')}
              </p>
              <p className="text-center text-xs text-text-dim">{URGE_SURF_COPY.valuePrompt}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[0, 2, 4, 6, 8, 10].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setIntensity(n)}
                    className={`min-h-[44px] min-w-[44px] rounded-xl border-[0.5px] text-sm ${
                      intensity === n ? 'border-accent bg-accent/15 text-accent' : 'border-border text-text-muted'
                    }`}
                    aria-label={`Intensitet ${n}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="text-center text-[10px] text-text-dim">Intensitet 0–10 — valfritt</p>
              <Button type="button" variant="secondary" onClick={() => setScreen('after')} className="--secondary min-h-[48px]">
                {URGE_SURF_COPY.doneHint}
              </Button>
            </div>
          ) : null}

          {screen === 'antiBuy' ? (
            <div className="flex w-full max-w-sm flex-1 flex-col justify-center gap-5">
              <p className="text-center font-display-serif text-lg text-accent">{ANTI_BUY_COPY.lead}</p>
              <p className="text-center text-sm text-text-muted">{ANTI_BUY_COPY.line}</p>
              <Button type="button" variant="accent" onClick={() => setScreen('after')} className="--accent min-h-[48px]">
                Jag väntar
              </Button>
            </div>
          ) : null}

          {screen === 'after' ? (
            <div className="flex w-full max-w-sm flex-1 flex-col justify-center gap-4">
              <p className="text-center font-display-serif text-lg text-accent">{AFTER_COPY.title}</p>
              <p className="text-center text-sm text-text-muted">{AFTER_COPY.lead}</p>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setScreen('hold')}
                className="--secondary min-h-[52px]"
              >
                {AFTER_COPY.stay}
              </Button>
              <a
                href="tel:112"
                onClick={() => pushKpiEvent({ type: 'help_tap', target: '112', at: Date.now() }, uid)}
                className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border-[0.5px] border-danger/40 bg-danger/10 px-4 text-sm text-danger"
              >
                {AFTER_COPY.call112}
              </a>
              <a
                href="tel:90101"
                onClick={() => pushKpiEvent({ type: 'help_tap', target: '90101', at: Date.now() }, uid)}
                className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border-[0.5px] border-border bg-surface-2/70 px-4 text-sm text-accent"
              >
                {AFTER_COPY.call90101}
              </a>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  pushKpiEvent({ type: 'akut_complete', at: Date.now() }, uid);
                  onClose();
                }}
                className="--ghost min-h-[48px]"
              >
                {AFTER_COPY.done}
              </Button>
            </div>
          ) : null}

          <p className="mt-auto pt-6 text-center text-[11px] text-text-dim">
            {RECOVERY_SOS_ANCHOR_COPY.emergencyHint}{' '}
            <a href="tel:112" className="text-danger underline-offset-2 hover:underline">
              {RECOVERY_SOS_ANCHOR_COPY.emergencyNumber}
            </a>
            {' · '}
            <a href="tel:90101" className="text-accent underline-offset-2 hover:underline">
              90101
            </a>
          </p>
        </div>
      </div>
    </Modal>
  );
}
