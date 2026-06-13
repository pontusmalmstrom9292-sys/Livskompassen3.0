import React, { useEffect, useState } from 'react';
import { useMorningCompassStore } from './morningStore';
import { useStore } from '../core/store';
import { Compass, Trash2, Loader2, CheckCircle2 } from 'lucide-react';
import { PageSkeleton } from '../../components/layout/PageSkeleton';

export function MorningCompass() {
  const user = useStore(state => state.user);
  const { 
    threeFocusPoints, 
    setFocusPoint, 
    clearFocusPoints,
    fetchFocusPoints,
    saveFocusPoints,
    isLoading
  } = useMorningCompassStore();

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      fetchFocusPoints(user.uid).then(() => setHasMounted(true));
    }
  }, [user?.uid, fetchFocusPoints]);

  // Debounced auto-save
  useEffect(() => {
    if (!user?.uid || !hasMounted) return;

    setSaveStatus('saving');
    const timeoutId = setTimeout(async () => {
      await saveFocusPoints(user.uid);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [threeFocusPoints, user?.uid, hasMounted, saveFocusPoints]);

  if (isLoading && !hasMounted) {
    return <PageSkeleton />;
  }

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

        {/* Cards */}
        <div className="space-y-4 mt-8">
          {threeFocusPoints.map((point, index) => (
            <div 
              key={index} 
              className="group relative p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-sm transition-all hover:bg-white/10 focus-within:bg-white/10 focus-within:border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/40 font-medium">
                  {index + 1}
                </div>
                <input
                  type="text"
                  value={point}
                  onChange={(e) => setFocusPoint(index, e.target.value)}
                  placeholder="Vad är viktigt idag?"
                  className="w-full bg-transparent border-none outline-none text-white/80 placeholder-white/30 text-lg font-light focus:ring-0"
                />
              </div>
            </div>
          ))}
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
