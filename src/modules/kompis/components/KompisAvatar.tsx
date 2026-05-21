import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface KompisAvatarProps {
  state?: 'idle' | 'active' | 'analyzing' | 'celebrating' | 'supporting';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function KompisAvatar({ state = 'idle', className, size = 'md' }: KompisAvatarProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64',
  };

  const getAuraColor = () => {
    switch (state) {
      case 'active':
        return 'bg-accent-light shadow-accent-glow-lg';
      case 'analyzing':
        return 'bg-accent shadow-accent-glow-lg';
      case 'celebrating':
        return 'bg-accent-light shadow-accent-glow-lg';
      case 'supporting':
        return 'bg-accent/80 shadow-accent-glow';
      case 'idle':
      default:
        return 'bg-gradient-to-tr from-accent via-accent-light to-white/20 shadow-accent-glow';
    }
  };

  return (
    <div className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: state === 'active' || state === 'analyzing' ? 2 : 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={cn('absolute inset-0 rounded-full blur-xl', getAuraColor())}
      />

      <motion.div
        animate={{
          rotate: [0, 360],
          scale: state === 'idle' ? 1 : 1.1,
        }}
        transition={{
          rotate: {
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          },
          scale: {
            duration: 0.5,
          },
        }}
        className="relative flex h-3/4 w-3/4 items-center justify-center overflow-hidden rounded-full border border-accent/30 bg-surface/60 backdrop-blur-sm"
      >
        <motion.div
          animate={{ rotate: [-45, 45, -45] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute h-1/2 w-1/2 rotate-45 border border-accent/40"
        />
        <motion.div
          animate={{ rotate: [45, -45, 45] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute h-1/2 w-1/2 border border-accent-light/40"
        />

        <div className="z-10 h-1/4 w-1/4 rounded-full bg-white shadow-[0_0_15px_5px_rgba(255,255,255,0.6)]" />
      </motion.div>
    </div>
  );
}
