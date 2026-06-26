import { Wind, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export function CaptureBreathingWidget() {
  const [expanded, setExpanded] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'in' | 'hold' | 'out'>('idle');
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!expanded) {
      setPhase('idle');
      return;
    }
    if (phase === 'idle') {
      setPhase('in');
      setTimeLeft(4);
    }
  }, [expanded, phase]);

  useEffect(() => {
    if (phase === 'idle') return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t > 1) return t - 1;
        // next phase
        if (phase === 'in') {
          setPhase('hold');
          return 7;
        } else if (phase === 'hold') {
          setPhase('out');
          return 8;
        } else {
          setPhase('in');
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  const label =
    phase === 'in' ? 'Andas in' : phase === 'hold' ? 'Håll andan' : phase === 'out' ? 'Andas ut' : '4-7-8 andning';

  return (
    <div className="rounded-xl border border-border/30 bg-surface-2/40 overflow-hidden mt-3 transition-all">
      <button
        type="button"
        className="flex w-full items-center justify-between px-3 py-2 text-xs text-text-muted hover:text-text hover:bg-surface-3 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="flex items-center gap-2">
          <Wind className="h-3.5 w-3.5" />
          4-7-8 Andningsövning
        </span>
        {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>

      {expanded && (
        <div className="p-4 border-t border-border/20 text-center space-y-3">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all duration-1000 ${
              phase === 'in'
                ? 'scale-110 border-accent text-accent'
                : phase === 'hold'
                  ? 'scale-110 border-accent/60 text-accent/80'
                  : phase === 'out'
                    ? 'scale-90 border-text-muted text-text-muted'
                    : 'border-border text-text-dim'
            }`}
          >
            <span className="font-mono text-xl">{timeLeft > 0 ? timeLeft : ''}</span>
          </div>
          <p className="text-sm font-medium tracking-wide text-text">{label}</p>
          <p className="text-[10px] uppercase tracking-widest text-text-dim">4s in · 7s håll · 8s ut</p>
        </div>
      )}
    </div>
  );
}
