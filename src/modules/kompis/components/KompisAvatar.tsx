import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Sparkles } from 'lucide-react';

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
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
    xl: 'h-32 w-32',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10',
  };

  const ringClass =
    state === 'active' || state === 'analyzing'
      ? 'border-accent/50 bg-accent/10 text-accent'
      : 'border-white/12 bg-surface/70 text-accent';

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full border backdrop-blur-sm',
        sizeClasses[size],
        ringClass,
        className,
      )}
      aria-hidden={state === 'idle'}
    >
      <Sparkles className={iconSizes[size]} strokeWidth={1.75} />
    </div>
  );
}
