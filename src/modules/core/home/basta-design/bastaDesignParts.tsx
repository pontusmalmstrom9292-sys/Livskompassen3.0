import type { ButtonHTMLAttributes, ReactNode, CSSProperties } from 'react';
import { Button, type ButtonProps } from '@/design-system/components/Button';
import { cn } from '@/design-system/utils/cn';

export function BastaSectionLabel({ children }: { children: ReactNode }) {
  return <p className="basta-design__section-label">{children}</p>;
}

export function BastaGoldDivider() {
  return <div className="basta-design__gold-divider" aria-hidden />;
}

export function BastaCard({
  children,
  className = '',
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={cn('basta-design__card', className)} style={style}>
      {children}
    </div>
  );
}

export function BastaCardHeader({
  icon,
  label,
  trailing,
}: {
  icon: ReactNode;
  label: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div className="basta-design__card-header">
      <div className="basta-design__card-header-main">
        <span className="basta-design__card-header-icon" aria-hidden>
          {icon}
        </span>
        <BastaSectionLabel>{label}</BastaSectionLabel>
      </div>
      {trailing}
    </div>
  );
}

type BastaButtonVariant = 'gold' | 'ghost';

const BASTA_BTN_CLASS: Record<BastaButtonVariant, string> = {
  gold: 'basta-design__btn-gold',
  ghost: 'basta-design__btn-ghost',
};

export function BastaButton({
  variant = 'gold',
  className,
  children,
  ...rest
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  variant?: BastaButtonVariant;
  className?: string;
  children: ReactNode;
}) {
  const dsVariant: ButtonProps['variant'] = variant === 'gold' ? 'accent' : 'ghost';
  const dsSize: ButtonProps['size'] = variant === 'gold' ? 'md' : 'sm';

  return (
    <Button
      variant={dsVariant}
      size={dsSize}
      className={cn(BASTA_BTN_CLASS[variant], className)}
      {...rest}
    >
      {children}
    </Button>
  );
}
