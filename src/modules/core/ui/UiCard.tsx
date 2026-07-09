import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { clsx } from 'clsx';
import { useDesignPack } from '../design/useDesignPack';

type Props<T extends ElementType = 'div'> = {
  as?: T;
  children: ReactNode;
  className?: string;
  href?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

/**
 * App-kort — `ui-card` under designpaket, annars `glass-card`.
 * @deprecated Prod ska använda `BentoCard` / DS `Card`. Endast `/dev`-routes och Theme Lab.
 */
export function UiCard<T extends ElementType = 'div'>({
  as,
  children,
  className,
  ...rest
}: Props<T>) {
  const { active, chrome } = useDesignPack();
  const Component = as ?? 'div';
  const cardClass =
    active && chrome?.cardStyle === 'timeline'
      ? 'ui-card ui-card--timeline'
      : active && chrome?.cardStyle === 'row'
        ? 'ui-card ui-card--row'
        : active
          ? 'ui-card'
          : 'glass-card';

  return (
    <Component className={clsx(cardClass, className)} {...rest}>
      {children}
    </Component>
  );
}
