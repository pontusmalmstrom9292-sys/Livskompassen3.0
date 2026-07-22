import { clsx } from 'clsx';
import { Button, type ButtonProps } from '@/design-system';

type WidgetButtonVariant = 'accent' | 'secondary' | 'ghost' | 'danger';

export type WidgetButtonProps = Omit<ButtonProps, 'variant' | 'size'> & {
  variant?: WidgetButtonVariant;
  fullWidth?: boolean;
};

const VARIANT_MAP: Record<WidgetButtonVariant, ButtonProps['variant']> = {
  accent: 'accent',
  secondary: 'secondary',
  ghost: 'ghost',
  danger: 'danger',
};

/**
 * Tunnare widget-CTA — DS Button med widget-touch och pill-form.
 */
export function WidgetButton({
  variant = 'accent',
  fullWidth,
  className,
  ...props
}: WidgetButtonProps) {
  return (
    <Button
      variant={VARIANT_MAP[variant]}
      size="sm"
      className={clsx(
        'widget-btn min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
        `widget-btn--${variant}`,
        fullWidth && 'widget-btn--full',
        className,
      )}
      {...props}
    />
  );
}

export type WidgetIconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

/** Kompakt ikon+text för widget-verktygsrad. */
export function WidgetIconButton({ label, className, children, ...props }: WidgetIconButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        'widget-btn widget-btn--ghost widget-btn--icon min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
        className,
      )}
      aria-label={label}
      {...props}
    >
      {children}
      <span className="widget-btn__label">{label}</span>
    </button>
  );
}
