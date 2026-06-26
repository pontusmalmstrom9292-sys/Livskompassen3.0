import { memo, useEffect, useState, lazy, Suspense, useCallback } from 'react';
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
};

const FocusPointRow = memo(function FocusPointRow({
  index,
  locked,
  showValidatedBadge,
  lowEnergyDimmed,
  lowEnergyHighlighted,
}: FocusPointRowProps) {
  const point = useMorningCompassStore((s) => s.threeFocusPoints[index]);
  const setFocusPoint = useMorningCompassStore((s) => s.setFocusPoint);

  const disabled = locked || lowEnergyDimmed;

  return (
    <div
      className={`group relative p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-sm transition-all hover:bg-white/10 focus-within:bg-white/10 focus-within:border-white/20 ${
        lowEnergyDimmed ? 'opacity-20 pointer-events-none' : ''
      } ${lowEnergyHighlighted ? 'ring-1 ring-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : ''} ${
        locked ? 'border-accent/25 bg-accent/5' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/40 font-medium">
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          {showValidatedBadge && (
            <span className="mb-1 inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent">
              <ShieldCheck className="h-3 w-3" />
              MåBra-validerat
            </span>
          )}
          <input
            type="text"
            value={point}
            readOnly={locked}
            onChange={(e) => {
              if (!locked) setFocusPoint(index, e.target.value);
            }}
            placeholder={lowEnergyDimmed ? 'Viloläge' : 'Vad är viktigt idag?'}
            disabled={disabled}
            className="w-full bg-transparent border-none outline-none text-white/80 placeholder-white/30 text-lg font-light focus:ring-0 disabled:opacity-50 read-only:cursor-default"
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

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [storeReady, setStoreReady] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustedText, setAdjustedText] = useState('');
  const [dismissedLowEnergy, setDismissedLowEnergy] = useState(false);

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
      await saveFocus(user.uid);
      setSaveStatus('saved');
      window.setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
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

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center p-4 sm:p-6 md:p-8 animate-fade-in">
      <div className="max-w-md w-full space-y-8 mt-12 relative">
        <div className="absolute -top-8 right-0 text-white/30 flex items-center gap-2 text-xs">
          {saveStatus === 'saving' && <Loader2 className="w-3 h-3 animate-spin" />}
          {saveStatus === 'saved' && <CheckCircle2 className="w-3 h-3 text-white/60" />}
          {saveStatus === 'saving' ? 'Sparar...' : saveStatus === 'saved' ? 'Sparat' : ''}
        </div>

        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg">
              <Compass className="w-8 h-8 text-white/80" />
            </div>
          </div>
          <h1 className="text-3xl font-light tracking-wide text-white/90">Morgonkompassen</h1>
          <p className="text-sm text-white/50 font-light">
            {isGoalLocked
              ? 'Ditt MåBra-mål leder kompassen. Två fria platser till.'
              : 'Dina 3 viktigaste saker idag. Inget mer.'}
          </p>

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
          <div className="mt-6 p-4 rounded-xl bg-amber-900/20 border border-amber-500/20 backdrop-blur-sm animate-fade-in flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <Moon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="w-full">
                <p className="text-sm text-amber-200 font-medium">Oraklet noterar</p>
                <p className="text-sm text-amber-100 mt-1">
                  En hög belastning igår. Vill du aktivera Low-Energy Protocol idag för maximal återhämtning?
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setLowEnergyProtocolActive(true);
                      if (!isGoalLocked) {
                        setFocusPoint(0, 'Återhämtning & Grundläggande underhåll');
                      }
                      setFocusPoint(1, '');
                      setFocusPoint(2, '');
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/30 text-amber-100 hover:bg-amber-500/50 transition-colors"
                  >
                    Aktivera Low-Energy
                  </button>
                  <button
                    onClick={() => setDismissedLowEnergy(true)}
                    className="text-xs px-3 py-1.5 rounded-lg text-amber-300/70 hover:text-amber-200 hover:bg-white/5 transition-colors"
                  >
                    Nej tack
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!shouldSuggestLowEnergy && shouldSuggestProtocol && (
          <div className="mt-6 p-4 rounded-xl bg-indigo-900/20 border border-indigo-500/20 backdrop-blur-sm animate-fade-in flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="w-full">
                <p className="text-sm text-indigo-200 font-medium">Mönster-Arkivarien noterar</p>

                {isAdjusting ? (
                  <div className="mt-3 space-y-3">
                    <input
                      type="text"
                      value={adjustedText}
                      onChange={(e) => setAdjustedText(e.target.value)}
                      placeholder="Din justering av protokollet..."
                      className="w-full bg-black/20 border border-indigo-500/30 rounded-lg px-3 py-2 text-sm text-white/90 placeholder-white/30 focus:outline-none focus:border-indigo-400"
                      autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setIsAdjusting(false)}
                        className="text-xs px-3 py-1.5 rounded-lg text-indigo-300 hover:bg-white/5 transition-colors"
                      >
                        Avbryt
                      </button>
                      <button
                        onClick={handleAdjustProtocol}
                        disabled={!adjustedText.trim()}
                        className="text-xs px-3 py-1.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-400 transition-colors disabled:opacity-50"
                      >
                        Spara & Applicera
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-indigo-100 mt-1">{todayProtocol}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={handleAcceptProtocol}
                        className="text-xs px-3 py-1.5 rounded-lg bg-indigo-500/30 text-indigo-100 hover:bg-indigo-500/50 transition-colors"
                      >
                        Acceptera
                      </button>
                      <button
                        onClick={() => {
                          setAdjustedText(todayProtocol);
                          setIsAdjusting(true);
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-indigo-200 hover:bg-white/10 transition-colors"
                      >
                        Justera
                      </button>
                      <button
                        onClick={handleRejectProtocol}
                        className="text-xs px-3 py-1.5 rounded-lg text-indigo-300/70 hover:text-indigo-200 hover:bg-white/5 transition-colors"
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

        <div className="space-y-4 mt-8">
          {[0, 1, 2].map((index) => (
            <FocusPointRow
              key={index}
              index={index}
              locked={index === 0 && isGoalLocked}
              showValidatedBadge={index === 0 && isGoalLocked}
              lowEnergyDimmed={isLowEnergyProtocolActive && index > 0 && !(index === 0 && isGoalLocked)}
              lowEnergyHighlighted={isLowEnergyProtocolActive && index === 0 && !isGoalLocked}
            />
          ))}
        </div>

        <div className="pt-8 pb-4">
          <Suspense
            fallback={
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-white/20" />
              </div>
            }
          >
            <DailyTasksList />
          </Suspense>
        </div>

        <div className="pt-8 flex justify-center">
          <button
            onClick={() => void handleClearCompass()}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white/40 hover:text-white/80 transition-colors rounded-lg hover:bg-white/5"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isGoalLocked ? 'Rensa fria platser' : 'Rensa kompassen'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
