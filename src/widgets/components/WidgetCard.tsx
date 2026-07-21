import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { applyWidgetTheme, getSapphireCardSurface, WidgetMaterial, WidgetTouch } from '../core/WidgetTheme';
import type { WidgetSize } from '../core/WidgetFramework';
import { useEffect, useRef } from 'react';

export type WidgetCardProps = HTMLAttributes<HTMLDivElement> & {
  size?: WidgetSize;
  children: ReactNode;
  themed?: boolean;
  /** Studio material */
  material?: 'sapphire' | 'matte_metal';
  dim?: boolean;
};

const SIZE_CLASS: Record<WidgetSize, string> = {
  xs: 'cw-card--xs',
  small: 'cw-card--small',
  medium: 'cw-card--medium',
  large: 'cw-card--large',
};

/**
 * WidgetCard — sapphire/matte container, gold border, soft bloom (bible 6.2).
 */
export function WidgetCard({
  size = 'small',
  children,
  className,
  themed = true,
  material = 'sapphire',
  dim,
  style,
  ...rest
}: WidgetCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const surface = getSapphireCardSurface();

  useEffect(() => {
    if (themed) applyWidgetTheme(ref.current);
  }, [themed]);

  const merged: CSSProperties = {
    background: material === 'matte_metal' ? WidgetMaterial.matteMetalFill : surface.background,
    border: surface.border,
    boxShadow: surface.boxShadow,
    borderRadius: surface.borderRadius,
    backdropFilter: material === 'sapphire' ? surface.backdropFilter : 'blur(8px)',
    WebkitBackdropFilter: material === 'sapphire' ? surface.backdropFilter : 'blur(8px)',
    minHeight: size === 'xs' ? WidgetTouch.minDp * 2 : undefined,
    ...style,
  };

  return (
    <div
      ref={ref}
      className={['cw-card', SIZE_CLASS[size], dim && 'cw-card--dim', className]
        .filter(Boolean)
        .join(' ')}
      style={merged}
      data-cw-size={size}
      data-cw-material={material}
      {...rest}
    >
      {children}
    </div>
  );
}
