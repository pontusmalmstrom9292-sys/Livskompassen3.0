import {
  Button as DSButton,
  ButtonLink as DSButtonLink,
  type ButtonProps as DSButtonProps,
  type ButtonLinkProps as DSButtonLinkProps,
  type ButtonVariant as DSVariant,
} from '@/design-system';

/** Legacy variant names — mapped to design-system tokens. */
export type ButtonVariant = 'primaryGold' | 'continue' | 'save' | 'ghost';

const LEGACY_VARIANT: Record<ButtonVariant, DSVariant> = {
  primaryGold: 'accent',
  continue: 'secondary',
  save: 'success',
  ghost: 'ghost',
};

export type ButtonProps = Omit<DSButtonProps, 'variant'> & {
  variant?: ButtonVariant;
};

export function Button({ variant = 'primaryGold', ...rest }: ButtonProps) {
  return <DSButton variant={LEGACY_VARIANT[variant]} {...rest} />;
}

export type ButtonLinkProps = Omit<DSButtonLinkProps, 'variant'> & {
  variant?: ButtonVariant;
};

export function ButtonLink({ variant = 'primaryGold', ...rest }: ButtonLinkProps) {
  return <DSButtonLink variant={LEGACY_VARIANT[variant]} {...rest} />;
}

export { BUTTON_LEGACY_VARIANT, buttonClassName } from '@/design-system';
