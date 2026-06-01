import type { InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, type = 'text', ...rest }: InputProps) {
  return (
    <input
      type={type}
      className={clsx(
        'w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text',
        'placeholder:text-text-dim focus:border-accent focus:outline-none',
        className,
      )}
      {...rest}
    />
  );
}
