import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

/**
 * Input — token-bordered text field with focus ring.
 */
export function Input({ className, type = 'text', ...rest }: InputProps) {
  return <input type={type} className={cn('ds-input', className)} {...rest} />;
}

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextArea({ className, ...rest }: TextAreaProps) {
  return (
    <textarea
      className={cn('ds-input min-h-[var(--ds-space-20)] resize-y', className)}
      {...rest}
    />
  );
}
