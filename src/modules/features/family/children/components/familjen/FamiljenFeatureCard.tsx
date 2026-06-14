import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';
import { BentoCard } from '@/shared/ui/BentoCard';

type Props = {
  title: string;
  description: string;
  icon: ReactNode;
  to?: string;
  onClick?: () => void;
  className?: string;
  bookmark?: boolean;
};

/** Navigationskort i Familjen — Obsidian Calm BentoCard (indigo silo). */
export function FamiljenFeatureCard({
  title,
  description,
  icon,
  to,
  onClick,
  className,
  bookmark,
}: Props) {
  const inner = (
    <>
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/20 bg-surface-3/50 text-accent"
        aria-hidden
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display-serif text-sm font-medium text-text">{title}</span>
        <span className="mt-0.5 block text-xs text-text-dim">{description}</span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-accent/55" strokeWidth={1.5} aria-hidden />
      {bookmark ? (
        <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-accent/60" aria-hidden />
      ) : null}
    </>
  );

  if (to) {
    return (
      <BentoCard glow="blue" className={clsx('relative !p-3 transition hover:bg-surface-3/30', className)}>
        <Link to={to} className="flex items-center gap-3">
          {inner}
        </Link>
      </BentoCard>
    );
  }

  return (
    <BentoCard glow="blue" className={clsx('relative !p-3 transition hover:bg-surface-3/30', className)}>
      <button type="button" className="flex w-full items-center gap-3 text-left" onClick={onClick}>
        {inner}
      </button>
    </BentoCard>
  );
}
