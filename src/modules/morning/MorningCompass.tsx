import { memo, useEffect, useState, lazy, Suspense, useCallback, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useMorningCompassStore } from './morningStore';
import { useStore } from '../core/store';
import { Compass, Trash2, Loader2, CheckCircle2, Sparkles, Moon, ShieldCheck } from 'lucide-react';
import { PageSkeleton } from '../../components/layout/PageSkeleton';
import { getLocalIsoDate } from './lib/focusPoints';
import { usePrimaryGoal } from '@/modules/features/dailyLife/wellbeing/mabra/hooks/usePrimaryGoal';
import { VaultLockedGate } from '@/core/components/VaultLockedGate';
import { hasVaultGate } from '@/core/auth/sessionService';

const DailyTasksList = lazy(() =>
  import('./components/DailyTasksList').then((m) => ({ default: m.DailyTasksList })),
);

type FocusPointRowProps = {
  index: number;
  locked: boolean;
  showValidatedBadge: boolean;
  lowEnergyDimmed: boolean;
  lowEnergyHighlighted: boolean;
  filled: boolean;
  inputRef: (el: HTMLInputElement | null) => void;
  onAdvance: (index: number) => void;
};

const FocusPointRow = memo(function FocusPointRow({
  index,
  locked,
  showValidatedBadge,
  lowEnergyDimmed,
  lowEnergyHighlighted,
  filled,
  inputRef,
  onAdvance,
}: FocusPointRowProps) {
  const point = useMorningCompassStore((s) => s.threeFocusPoints[index]);
  const setFocusPoint = useMorningCompassStore((s) => s.setFocusPoint);

  const disabled = locked || lowEnergyDimmed;

  return (
    <div
      className={`group relative rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-[var(--ds-duration-fast)] hover:bg-white/10 focus-within:bg-white/10 focus-within:border-white/20 ${
        lowEnergyDimmed ? 'opacity-20 pointer-events-none' : ''
      } ${lowEnergyHighlighted ? 'ring-1 ring-accent/30 shadow-[0_0_15px_color-mix(in_srgb,var(--accent)_10%,transparent)]' : ''} ${
        locked ? 'border-accent/25 bg-accent/5' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border font-medium text-sm transition-colors ${
            filled
              ? 'border-accent/40 bg-accent/15 text-accent'
              : 'border-white/10 bg-white/5 text-white/40'
          }`}
          aria-hidden
        >
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          {showValidatedBadge && (
            <span className="mb-1 inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent">
              <ShieldCheck className="h-3 w-3" />
              Mabra-validerat
            </span>
          )}
          <input
            ref={inputRef}
            type="text"
            value={point}
            readOnly={locked}
            onChange={(e) => {
              if (!locked) setFocusPoint(index, e.target.value);
            }}
            onKeyDown={(e) => {
              if (locked || disabled) return;
              if (e.key === 'Enter' || e.key === 'ArrowDown') {
                e.preventDefault();
                onAdvance(index);
              }
            }}
            placeholder={lowEnergyDimmed ? 'Viloläge' : 'Vad är viktigt idag?'}
            disabled={disabled}
            aria-label={`Fokuspunkt ${index + 1} av 3`}
            className="w-full min-h-11 bg-transparent border-none outline-none text-white/80 placeholder-white/30 text-lg font-light focus:ring-0 disabled:opacity-50 read-only:cursor-default"
          />
        </div>
      </div>
    </div>
  );
});

export function MorningCompass() {
  const user = useStore((state) => state.user);
  const isVaultUnlocked = useStore((state) => state.ui.isVaultUnlocked) || hasVaultGate();
  const {
    threeFocusPoints,
    setFocusPoint,
    clearFocusPoints,
    fetchLatestInsight,
    latestInsight,
    isLoading,
    handledProtocolDate,
    submitProtocolFeedback,
    fetchFocusPoints,
    saveFocus,
    yesterdayWasHighRisk,
    isLowEnergyProtocolActive,
    setLowEnergyProtocolActive,
    morningAnchor,
    isLoadingAnchor,
    fetchMorningAnchor,
  } = useMorningCompassStore(
    useShallow((state) => ({
      threeFocusPoints: state.threeFocusPoints,
      setFocusPoint: state.setFocusPoint,
      clearFocusPoints: state.clearFocusPoints,
      fetchLatestInsight: state.fetchLatestInsight,
      latestInsight: state.latestInsight,
      isLoading: state.isLoading,
      handledProtocolDate: state.handledProtocolDate,
      submitProtocolFeedback: state.submitProtocolFeedback,
      fetchFocusPoints: state.fetchFocusPoints,
      saveFocus: state.saveFocus,
      yesterdayWasHighRisk: state.yesterdayWasHighRisk,
      isLowEnergyProtocolActive: state.isLowEnergyProtocolActive,
      setLowEnergyProtocolActive: state.setLowEnergyProtocolActive,
      morningAnchor: state.morningAnchor,
      isLoadingAnchor: state.isLoadingAnchor,
      fetchMorningAnchor: state.fetchMorningAnchor,
    })),
  );

  const { primaryGoal, loading: primaryGoalLoading } = usePrimaryGoal();

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [storeReady, setStoreReady] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustedText, setAdjustedText] = useState('');
  const [dismissedLowEnergy, setDismissedLowEnergy] = useState(false);
  const idleResetTimerRef = useRef<number | null>(null);
  const focusInputRefs = useRef<Array<HTMLInputElement | null>>([null, null, null]);

  const advanceFocusPoint = useCallback((fromIndex: number) => {
    for (let next = fromIndex + 1; next < 3; next += 1) {
      const el = focusInputRefs.current[next];
      if (el && !el.disabled && !el.readOnly) {
        el.focus();
        return;
      }
    }
  }, []);

  const confirmedGoalText = primaryGoal?.text?.trim() ?? '';
  const isGoalLocked = confirmedGoalText.length > 0;

  useEffect(() => {
    if (!user?.uid) {
      setStoreReady(false);
      setHasMounted(false);
      return;
    }

    let cancelled = false;
    setStoreReady(false);
    setHasMounted(false);

    Promise.all([fetchFocusPoints(user.uid), fetchLatestInsight(user.uid), fetchMorningAnchor()]).then(() => {
      if (!cancelled) setStoreReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [user?.uid, fetchLatestInsight, fetchFocusPoints]);

  useEffect(() => {
    if (!storeReady || primaryGoalLoading) return;

    if (isGoalLocked) {
      setFocusPoint(0, confirmedGoalText);
    }

    setHasMounted(true);
  }, [storeReady, primaryGoalLoading, isGoalLocked, confirmedGoalText, setFocusPoint]);

  useEffect(() => {
    if (!isGoalLocked || !hasMounted) return;
    if (threeFocusPoints[0] !== confirmedGoalText) {
      setFocusPoint(0, confirmedGoalText);
    }
  }, [isGoalLocked, confirmedGoalText, hasMounted, threeFocusPoints, setFocusPoint]);

  useEffect(() => {
    if (!user?.uid || !hasMounted) return;

    setSaveStatus('saving');
    const timeoutId = window.setTimeout(async () => {
      if (isGoalLocked && threeFocusPoints[0] !== confirmedGoalText) {
        setFocusPoint(0, confirmedGoalText);
      }
      const ok = await saveFocus(user.uid);
      if (ok) {
        setSaveStatus('saved');
        if (idleResetTimerRef.current != null) {
          window.clearTimeout(idleResetTimerRef.current);
        }
        idleResetTimerRef.current = window.setTimeout(() => {
          setSaveStatus('idle');
          idleResetTimerRef.current = null;
        }, 2000);
      } else {
        setSaveStatus('error');
      }
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
      if (idleResetTimerRef.current != null) {
        window.clearTimeout(idleResetTimerRef.current);
        idleResetTimerRef.current = null;
      }
    };
  }, [
    threeFocusPoints,
    user?.uid,
    hasMounted,
    saveFocus,
    isGoalLocked,
    confirmedGoalText,
    setFocusPoint,
  ]);

  const applyTextToCompass = useCallback(
    (text: string) => {
      const startIndex = isGoalLocked ? 1 : 0;
      const emptyIndex = threeFocusPoints.findIndex(
        (point, index) => index >= startIndex && point.trim() === '',
      );
      if (emptyIndex !== -1) {
        setFocusPoint(emptyIndex, text);
        return;
      }
      if (!isGoalLocked) {
        setFocusPoint(0, text);
        return;
      }
      setFocusPoint(1, text);
    },
    [isGoalLocked, threeFocusPoints, setFocusPoint],
  );

  const handleClearCompass = useCallback(async () => {
    if (!user?.uid) return;
    if (isGoalLocked) {
      setFocusPoint(1, '');
      setFocusPoint(2, '');
      await saveFocus(user.uid);
      return;
    }
    await clearFocusPoints(user.uid);
  }, [user, isGoalLocked, setFocusPoint, saveFocus, clearFocusPoints]);

  if (!isVaultUnlocked) {
    return <VaultLockedGate variant="screen" />;
  }

  if (!hasMounted && (isLoading || primaryGoalLoading || !storeReady)) {
    return <PageSkeleton />;
  }

  const getTodayWeekday = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const todayProtocol = latestInsight?.dailyProtocols?.[getTodayWeekday()];

  const todayIsoDate = getLocalIsoDate();
  const isProtocolHandledToday = handledProtocolDate === todayIsoDate;

  const shouldSuggestProtocol =
    todayProtocol && !todayProtocol.toLowerCase().includes('standard') && !isProtocolHandledToday;

  const hasAnyPoints = threeFocusPoints.some((point) => point.trim() !== '');
  const shouldSuggestLowEnergy =
    yesterdayWasHighRisk && !isLowEnergyProtocolActive && !hasAnyPoints && !dismissedLowEnergy;

  const handleAcceptProtocol = async () => {
    if (!user?.uid || !todayProtocol) return;
    applyTextToCompass(todayProtocol);
    await submitProtocolFeedback(user.uid, todayProtocol, 'accepted');
  };

  const handleRejectProtocol = async () => {
    if (!user?.uid || !todayProtocol) return;
    await submitProtocolFeedback(user.uid, todayProtocol, 'rejected');
  };

  const handleAdjustProtocol = async () => {
    if (!user?.uid || !todayProtocol || !adjustedText.trim()) return;
    applyTextToCompass(adjustedText);
    await submitProtocolFeedback(user.uid, todayProtocol, 'adjusted', adjustedText);
    setIsAdjusting(false);
    setAdjustedText('');
  };

  const filledCount = threeFocusPoints.filter((p) => p.trim() !== '').length;

  return (
    <div className="morning-compass morning-compass-shell calm-scroll-island flex min-h-[80vh] w-full max-w-full flex-col items-center overflow-x-clip overflow-y-auto p-4 animate-fade-in sm:p-6 md:p-8">
      <div className="morning-compass-shell__surface relative mt-10 w-full max-w-md space-y-7 rounded-3xl border border-white/10 bg-black/20 p-5 shadow-[0_24px_60px_-36px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:mt-12 sm:space-y-8 sm:p-6">
        <div
          className="absolute -top-8 right-0 flex items-center gap-2 text-xs text-white/30"
          aria-live="polite"
        >
          {saveStatus === 'saving' && <Loader2 className="w-3 h-3 animate-spin" aria-hidden />}
          {saveStatus === 'saved' && <CheckCircle2 className="w-3 h-3 text-white/60" aria-hidden />}
          {saveStatus === 'error' && (
            <span className="w-3 h-3 rounded-full bg-danger/80" aria-hidden />
          )}
          {saveStatus === 'saving'
            ? 'Sparar...'
            : saveStatus === 'saved'
              ? 'Sparat'
              : saveStatus === 'error'
                ? 'Kunde inte spara'
                : ''}
        </div>

        <div className="space-y-3 text-center">
          <div className="mb-4 flex justify-center sm:mb-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-md">
              <Compass className="h-8 w-8 text-white/80" aria-hidden />
            </div>
          </div>
          <h1 className="text-3xl font-light tracking-wide text-white/90">Morgonkompassen</h1>
          <p className="text-sm font-light text-text-muted">
            {isGoalLocked
              ? 'Ditt Mabra-mål leder kompassen. Två fria platser till.'
              : 'Dina 3 viktigaste saker idag. Inget mer.'}
          </p>
          <div
            className="mx-auto flex items-center justify-center gap-2 pt-1"
            role="status"
            aria-label={`${filledCount} av 3 fokuspunkter ifyllda`}
          >
            {[0, 1, 2].map((step) => {
              const filled = threeFocusPoints[step]?.trim() !== '';
              return (
                <span
                  key={step}
                  className={`h-1.5 w-6 rounded-full transition-colors duration-[var(--ds-duration-fast)] ${
                    filled ? 'bg-accent/70' : 'bg-white/15'
                  }`}
                  aria-hidden
                />
              );
            })}
          </div>

          {isLoadingAnchor ? (
            <div className="mt-4 flex justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-white/30" />
            </div>
          ) : morningAnchor ? (
            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 text-left text-sm text-white/80 italic font-serif">
              "{morningAnchor}"
            </div>
          ) : null}
        </div>

        {shouldSuggestLowEnergy && (
          <div className="mt-6 p-4 rounded-xl bg-accent/10 border border-accent/20 backdrop-blur-sm animate-fade-in flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <Moon className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div className="w-full">
                <p className="text-sm text-accent-light font-medium">Oraklet noterar</p>
                <p className="text-sm text-accent-light mt-1">
                  En hög belastning igår. Vill du aktivera Low-Energy Protocol idag för maximal återhämtning?
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLowEnergyProtocolActive(true);
                      if (!isGoalLocked) {
                        setFocusPoint(0, 'Återhämtning & Grundläggande underhåll');
                      }
                      setFocusPoint(1, '');
                      setFocusPoint(2, '');
                    }}
                    className="inline-flex min-h-11 items-center rounded-lg bg-accent/30 px-3 text-xs text-accent-light transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  >
                    Aktivera Low-Energy
                  </button>
                  <button
                    type="button"
                    onClick={() => setDismissedLowEnergy(true)}
                    className="inline-flex min-h-11 items-center rounded-lg px-3 text-xs text-accent-light/70 transition-colors hover:bg-white/5 hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  >
                    Nej tack
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!shouldSuggestLowEnergy && shouldSuggestProtocol && (
          <div className="mt-6 p-4 rounded-xl bg-accent/10 border border-accent/20 backdrop-blur-sm animate-fade-in flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div className="w-full">
                <p className="text-sm text-accent-light font-medium">Mönster-Arkivarien noterar</p>

                {isAdjusting ? (
                  <div className="mt-3 space-y-3">
                    <input
                      type="text"
                      value={adjustedText}
                      onChange={(e) => setAdjustedText(e.target.value)}
                      placeholder="Din justering av protokollet..."
                      className="w-full bg-black/20 border border-accent/30 rounded-lg px-3 py-2 text-sm text-white/90 placeholder-white/30 focus:outline-none focus:border-accent"
                      autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setIsAdjusting(false)}
                        className="inline-flex min-h-11 items-center rounded-lg px-3 text-xs text-accent-light transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                      >
                        Avbryt
                      </button>
                      <button
                        onClick={handleAdjustProtocol}
                        disabled={!adjustedText.trim()}
                        className="inline-flex min-h-11 items-center rounded-lg bg-accent px-3 text-xs text-white transition-colors hover:bg-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-50"
                      >
                        Spara & Applicera
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-accent-light mt-1">{todayProtocol}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleAcceptProtocol}
                        className="inline-flex min-h-11 items-center rounded-lg bg-accent/30 px-3 text-xs text-accent-light transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                      >
                        Acceptera
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAdjustedText(todayProtocol);
                          setIsAdjusting(true);
                        }}
                        className="inline-flex min-h-11 items-center rounded-lg bg-white/5 px-3 text-xs text-accent-light transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                      >
                        Justera
                      </button>
                      <button
                        type="button"
                        onClick={handleRejectProtocol}
                        className="inline-flex min-h-11 items-center rounded-lg px-3 text-xs text-accent-light/70 transition-colors hover:bg-white/5 hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                      >
                        Inte idag
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
          {[0, 1, 2].map((index) => (
            <FocusPointRow
              key={index}
              index={index}
              locked={index === 0 && isGoalLocked}
              showValidatedBadge={index === 0 && isGoalLocked}
              lowEnergyDimmed={isLowEnergyProtocolActive && index > 0 && !(index === 0 && isGoalLocked)}
              lowEnergyHighlighted={isLowEnergyProtocolActive && index === 0 && !isGoalLocked}
              filled={threeFocusPoints[index]?.trim() !== ''}
              inputRef={(el) => {
                focusInputRefs.current[index] = el;
              }}
              onAdvance={advanceFocusPoint}
            />
          ))}
        </div>

        <div className="pb-4 pt-6 sm:pt-8">
          <Suspense
            fallback={
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-white/20" aria-hidden />
              </div>
            }
          >
            <DailyTasksList />
          </Suspense>
        </div>

        <div className="flex justify-center pt-6 sm:pt-8">
          <button
            type="button"
            onClick={() => void handleClearCompass()}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2 text-sm text-text-muted transition-colors hover:bg-white/5 hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
            aria-label={isGoalLocked ? 'Rensa fria platser i Morgonkompassen' : 'Rensa Morgonkompassen'}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            <span>{isGoalLocked ? 'Rensa fria platser' : 'Rensa kompassen'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
