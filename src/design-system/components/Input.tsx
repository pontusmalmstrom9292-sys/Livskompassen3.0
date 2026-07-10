import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

/**
 * Input — token-bordered text field with focus ring.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = 'text', ...rest },
  ref,
) {
  return <input ref={ref} type={type} className={cn('ds-input', className)} {...rest} />;
});

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { className, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cn('ds-input min-h-[var(--ds-space-20)] resize-y', className)}
      {...rest}
    />
  );
});
