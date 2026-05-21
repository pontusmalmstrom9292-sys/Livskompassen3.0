import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

export function Tidshjulet() {
  return (
    <div className="relative mx-auto my-12 flex aspect-square w-full max-w-md items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full border border-dashed border-surface-3"
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-4 rounded-full border border-accent/20"
      >
        <div className="absolute -top-1 left-1/2 h-2 w-2 rounded-full bg-accent shadow-accent-glow" />
      </motion.div>

      <motion.div className="absolute inset-12 rounded-full border border-accent/30 bg-accent/5 backdrop-blur-sm" />

      <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border border-surface-3 bg-bg shadow-xl shadow-black/50">
        <Compass className="h-8 w-8 text-accent" />
      </div>

      <div className="absolute left-1/4 top-1/4 z-20 h-3 w-3 rounded-full bg-accent-light shadow-accent-glow" />
      <div className="absolute bottom-1/3 right-1/4 z-20 h-2 w-2 rounded-full bg-accent/80 shadow-accent-glow" />
    </div>
  );
}
