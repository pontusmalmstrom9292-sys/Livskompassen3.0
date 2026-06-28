import type { ImgHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export type AvatarSize = 'sm' | 'md' | 'lg';

export type AvatarProps = {
  src?: string;
  alt: string;
  initials?: string;
  size?: AvatarSize;
  className?: string;
  imgProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>;
};

const SIZE_CLASS: Record<AvatarSize, string> = {
  sm: 'ds-avatar--sm',
  md: 'ds-avatar--md',
  lg: 'ds-avatar--lg',
};

/** Avatar — circular image or initials with gold rim. */
export function Avatar({ src, alt, initials, size = 'md', className, imgProps }: AvatarProps) {
  return (
    <span className={cn('ds-avatar', SIZE_CLASS[size], className)} aria-hidden={!alt}>
      {src ? (
        <img src={src} alt={alt} className="ds-avatar__img" {...imgProps} />
      ) : (
        <span aria-label={alt}>{initials ?? alt.charAt(0).toUpperCase()}</span>
      )}
    </span>
  );
}
