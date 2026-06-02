import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';
import { useDesignPack } from '@/core/design/useDesignPack';
import { UiCard } from '@/core/ui/UiCard';

type Props = {
  title: string;
  description: string;
  icon: ReactNode;
  to?: string;
  onClick?: () => void;
  className?: string;
  bookmark?: boolean;
};

/** Tema E — kort med guld cirkel-ikon (mockup Familjen-lista). */
export function FamiljenFeatureCard({
  title,
  description,
  icon,
  to,
  onClick,
  className,
  bookmark,
}: Props) {
  const { active } = useDesignPack();

  const inner = (
    <>
      <span
        className={clsx(
          active ? 'ui-card__icon' : 'familjen-feature-card__icon',
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-accent',
        )}
        aria-hidden
      >
        {icon}
      </span>
      <span className={active ? 'min-w-0 flex-1' : 'familjen-feature-card__body'}>
        <span
          className={clsx(
            active ? 'block font-display-serif text-sm font-medium text-text' : 'familjen-feature-card__title',
          )}
        >
          {title}
        </span>
        <span
          className={clsx(
            active ? 'mt-0.5 block text-xs text-text-dim' : 'familjen-feature-card__desc',
          )}
        >
          {description}
        </span>
      </span>
      <ChevronRight
        className={active ? 'h-4 w-4 shrink-0 text-accent/55' : 'familjen-feature-card__chevron'}
        strokeWidth={1.5}
        aria-hidden
      />
      {bookmark ? <span className="familjen-feature-card__bookmark" aria-hidden /> : null}
    </>
  );

  if (to) {
    return (
      <UiCard as={Link} to={to} className={clsx(!active && 'familjen-feature-card', className)}>
        {inner}
      </UiCard>
    );
  }

  return (
    <UiCard as="button" type="button" className={clsx(!active && 'familjen-feature-card', className)} onClick={onClick}>
      {inner}
    </UiCard>
  );
}
