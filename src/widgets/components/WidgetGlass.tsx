import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { WidgetMaterial, WidgetPalette } from '../core/WidgetTheme';

export type WidgetGlassProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  /** Stronger opacity for nested wells */
  strong?: boolean;
  /** Inset well (nedsänkt yta) */
  inset?: boolean;
};

/**
 * WidgetGlass — dark sapphire material layer (bible 3.3 / 6.2).
 */
export function WidgetGlass({
  children,
  className,
  strong,
  inset,
  style,
  ...rest
}: WidgetGlassProps) {
  const merged: CSSProperties = {
    background: strong ? WidgetMaterial.glassFillStrong : WidgetMaterial.glassFill,
    backdropFilter: `blur(${WidgetMaterial.glassBlurPx}px)`,
    WebkitBackdropFilter: `blur(${WidgetMaterial.glassBlurPx}px)`,
    border: `1px solid ${WidgetMaterial.goldBorderSoft}`,
    borderRadius: 14,
    boxShadow: inset
      ? WidgetMaterial.insetShadow
      : `${WidgetMaterial.glassLip}, 0 0 20px rgba(2, 6, 23, 0.45)`,
    color: WidgetPalette.textPrimary,
    ...style,
  };

  return (
    <div
      className={['cw-glass', inset && 'cw-glass--inset', className].filter(Boolean).join(' ')}
      style={merged}
      {...rest}
    >
      {children}
    </div>
  );
}
