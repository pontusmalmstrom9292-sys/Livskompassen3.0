import { useEffect, useState, lazy, Suspense } from 'react';
import { useMorningCompassStore } from './morningStore';
import { useStore } from '../core/store';
import { Compass, Trash2, Loader2, CheckCircle2, Sparkles, Moon } from 'lucide-react';
import { PageSkeleton } from '../../components/layout/PageSkeleton';
import { CompassService } from './services/CompassService';

const DailyTasksList = lazy(() => import('./components/DailyTasksList').then(m => ({ default: m.DailyTasksList })));

export function MorningCompass() {
  const user = useStore(state => state.user);
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
    yesterdayWasHighRisk,
    isLowEnergyProtocolActive,
    setLowEnergyProtocolActive
  } = useMorningCompassStore();

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [hasMounted, setHasMounted] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustedText, setAdjustedText] = useState('');
  const [dismissedLowEnergy, setDismissedLowEnergy] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      Promise.all([
        CompassService.getDailyIntentions(user.uid).then((intentions) => {
          if (intentions.length > 0 && intentions[0].intention) {
            try {
              const parsed = JSON.parse(intentions[0].intention);
              if (Array.isArray(parsed)) {
                parsed.forEach((p, i) => {
                  if (i < 3) setFocusPoint(i, p);
                });
              }
            } catch {
              setFocusPoint(0, intentions[0].intention);
            }
          }
        }),
        fetchFocusPoints(user.uid),
        fetchLatestInsight(user.uid)
      ]).then(() => setHasMounted(true));
    }
  }, [user?.uid, fetchLatestInsight, setFocusPoint]);

  // Debounced auto-save
  useEffect(() => {
    if (!user?.uid || !hasMounted) return;

    setSaveStatus('saving');
    const timeoutId = setTimeout(async () => {
      await CompassService.saveDailyIntention(user.uid, JSON.stringify(threeFocusPoints));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [threeFocusPoints, user?.uid, hasMounted]);

  if (isLoading && !hasMounted) {
    return <PageSkeleton />;
  }

  const getTodayWeekday = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const todayProtocol = latestInsight?.dailyProtocols?.[getTodayWeekday()];
  
  const today = new Date();
  const todayIsoDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const isProtocolHandledToday = handledProtocolDate === todayIsoDate;
  
  const shouldSuggestProtocol = todayProtocol && !todayProtocol.toLowerCase().includes('standard') && !isProtocolHandledToday;

  const hasAnyPoints = threeFocusPoints.some(p => p.trim() !== '');
  const shouldSuggestLowEnergy = yesterdayWasHighRisk && !isLowEnergyProtocolActive && !hasAnyPoints && !dismissedLowEnergy;

  const applyTextToCompass = (text: string) => {
    const emptyIndex = threeFocusPoints.findIndex(p => p.trim() === '');
    if (emptyIndex !== -1) {
      setFocusPoint(emptyIndex, text);
    } else {
      setFocusPoint(0, text); // Överskriv första om alla är fulla
    }
  };

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
        
        {/* Status Indicator (Subtle) */}
        <div className="absolute -top-8 right-0 text-white/30 flex items-center gap-2 text-xs">
          {saveStatus === 'saving' && <Loader2 className="w-3 h-3 animate-spin" />}
          {saveStatus === 'saved' && <CheckCircle2 className="w-3 h-3 text-white/60" />}
          {saveStatus === 'saving' ? 'Sparar...' : saveStatus === 'saved' ? 'Sparat' : ''}
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg">
              <Compass className="w-8 h-8 text-white/80" />
            </div>
          </div>
          <h1 className="text-3xl font-light tracking-wide text-white/90">Morgonkompassen</h1>
          <p className="text-sm text-white/50 font-light">Dina 3 viktigaste saker idag. Inget mer.</p>
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
                      setFocusPoint(0, 'Återhämtning & Grundläggande underhåll');
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

        {/* Proaktiv Insikt Banner */}
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

        {/* Cards */}
        <div className="space-y-4 mt-8">
          {threeFocusPoints.map((point, index) => (
            <div 
              key={index} 
              className={`group relative p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-sm transition-all hover:bg-white/10 focus-within:bg-white/10 focus-within:border-white/20 ${
                isLowEnergyProtocolActive && index > 0 ? 'opacity-20 pointer-events-none' : ''
              } ${isLowEnergyProtocolActive && index === 0 ? 'ring-1 ring-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/40 font-medium">
                  {index + 1}
                </div>
                <input
                  type="text"
                  value={point}
                  onChange={(e) => setFocusPoint(index, e.target.value)}
                  placeholder={isLowEnergyProtocolActive && index > 0 ? "Viloläge" : "Vad är viktigt idag?"}
                  disabled={isLowEnergyProtocolActive && index > 0}
                  className="w-full bg-transparent border-none outline-none text-white/80 placeholder-white/30 text-lg font-light focus:ring-0 disabled:opacity-50"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Daily Tasks Supermodul */}
        <div className="pt-8 pb-4">
          <Suspense fallback={
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-white/20" />
            </div>
          }>
            <DailyTasksList />
          </Suspense>
        </div>

        {/* Actions */}
        <div className="pt-8 flex justify-center">
          <button 
            onClick={() => clearFocusPoints(user?.uid)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white/40 hover:text-white/80 transition-colors rounded-lg hover:bg-white/5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Rensa kompassen</span>
          </button>
        </div>
      </div>
    </div>
  );
}
