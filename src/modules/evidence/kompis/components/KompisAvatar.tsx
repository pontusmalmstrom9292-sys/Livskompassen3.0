import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { KompisMark } from './KompisMark';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface KompisAvatarProps {
  state?: 'idle' | 'active' | 'analyzing' | 'celebrating' | 'supporting';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Inuti header-chrome-knapp: ingen extra ring, större mark. */
  chromeEmbed?: boolean;
}

export function KompisAvatar({
  state = 'idle',
  className,
  size = 'md',
  chromeEmbed = false,
}: KompisAvatarProps) {
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
    xl: 'h-32 w-32',
  };

  const markSizes = {
    sm: chromeEmbed ? 'h-8 w-8' : 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-11 w-11',
    xl: 'h-14 w-14',
  };

  const live = state === 'active' || state === 'analyzing';

  return (
    <div
      className={cn(
        'kompis-avatar flex items-center justify-center rounded-full border backdrop-blur-md',
        sizeClasses[size],
        live && 'kompis-avatar--live',
        chromeEmbed && 'kompis-avatar--chrome-embed',
        className,
      )}
      aria-hidden={state === 'idle'}
      aria-label={live ? 'Kompis analyserar' : undefined}
    >
      {!chromeEmbed ? <span className="kompis-avatar__ring" aria-hidden /> : null}
      <KompisMark className={cn('kompis-mark relative z-[1]', markSizes[size])} />
    </div>
  );
}
