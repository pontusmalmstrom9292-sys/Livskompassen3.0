import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useSOSStore } from '@/modules/core/store/sosStore';
import { AnimatePresence, motion } from 'framer-motion';

type Phase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out';

const PHASE_DURATION = 4000;

export function SOSOverlay() {
  const isSOSActive = useSOSStore((s) => s.isSOSActive);
  const deactivateSOS = useSOSStore((s) => s.deactivateSOS);
  const [phase, setPhase] = useState<Phase>('inhale');

  useEffect(() => {
    if (!isSOSActive) {
      setPhase('inhale');
      return;
    }

    const interval = setInterval(() => {
      setPhase((current) => {
        switch (current) {
          case 'inhale': return 'hold-in';
          case 'hold-in': return 'exhale';
          case 'exhale': return 'hold-out';
          case 'hold-out': return 'inhale';
        }
      });
    }, PHASE_DURATION);

    return () => clearInterval(interval);
  }, [isSOSActive]);

  if (!isSOSActive) return null;

  let text = '';
  let scale = 1;
  switch (phase) {
    case 'inhale':
      text = 'Andas in...';
      scale = 1.6;
      break;
    case 'hold-in':
      text = 'Håll...';
      scale = 1.6;
      break;
    case 'exhale':
      text = 'Andas ut...';
      scale = 1;
      break;
    case 'hold-out':
      text = 'Håll...';
      scale = 1;
      break;
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950/95 backdrop-blur-2xl">
      {/* Close button */}
      <button
        onClick={deactivateSOS}
        className="absolute top-12 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
        aria-label="Stäng SOS-läge"
      >
        <X className="w-7 h-7" />
      </button>

      {/* Breathing Engine */}
      <div className="relative flex items-center justify-center w-80 h-80">
        {/* Glow behind the circle */}
        <div 
          className="absolute inset-0 rounded-full bg-cyan-600/20 blur-3xl transition-transform ease-in-out"
          style={{ 
            transform: `scale(${scale * 1.5})`,
            transitionDuration: `${PHASE_DURATION}ms`
          }}
        />
        
        {/* The expanding/shrinking circle */}
        <div
          className="absolute w-32 h-32 rounded-full border-4 border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_50px_rgba(6,182,212,0.3)] transition-transform ease-in-out"
          style={{ 
            transform: `scale(${scale})`,
            transitionDuration: `${PHASE_DURATION}ms`
          }}
        />

        {/* Phase Text */}
        <AnimatePresence mode="wait">
          <motion.p
            key={text}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.8 }}
            className="z-10 text-2xl font-light tracking-[0.2em] text-white/90 text-center"
          >
            {text}
          </motion.p>
        </AnimatePresence>
      </div>

      <p className="absolute bottom-20 text-white/40 text-sm font-light tracking-wider text-center px-6">
        Följ rytmen. Du är trygg.
      </p>
    </div>
  );
}
