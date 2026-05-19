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
        return 'bg-blue-400 shadow-[0_0_40px_10px_rgba(96,165,250,0.6)]';
      case 'analyzing':
        return 'bg-purple-400 shadow-[0_0_40px_10px_rgba(192,132,252,0.6)]';
      case 'celebrating':
        return 'bg-yellow-400 shadow-[0_0_40px_10px_rgba(250,204,21,0.6)]';
      case 'supporting':
        return 'bg-emerald-400 shadow-[0_0_40px_10px_rgba(52,211,153,0.6)]';
      case 'idle':
      default:
        // Guld och blåtoner
        return 'bg-gradient-to-tr from-blue-600 via-blue-400 to-amber-300 shadow-[0_0_30px_5px_rgba(96,165,250,0.4)]';
    }
  };

  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
      {/* Outer pulsing aura */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: state === 'active' || state === 'analyzing' ? 2 : 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={cn("absolute inset-0 rounded-full blur-xl", getAuraColor())}
      />
      
      {/* Inner core - Sub-Synaptic Network visual */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: state === 'idle' ? 1 : 1.1,
        }}
        transition={{
          rotate: {
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 0.5,
          }
        }}
        className="relative w-3/4 h-3/4 rounded-full border border-amber-300/30 flex items-center justify-center overflow-hidden bg-slate-900/40 backdrop-blur-sm"
      >
        {/* Geometric center / Compass rose hint */}
        <motion.div 
           animate={{ rotate: [-45, 45, -45] }}
           transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
           className="absolute w-1/2 h-1/2 border border-blue-400/50 rotate-45"
        />
        <motion.div 
           animate={{ rotate: [45, -45, 45] }}
           transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
           className="absolute w-1/2 h-1/2 border border-amber-300/50"
        />
        
        {/* Central light particle */}
        <div className="w-1/4 h-1/4 bg-white rounded-full shadow-[0_0_15px_5px_rgba(255,255,255,0.8)] z-10" />
      </motion.div>
    </div>
  );
}
