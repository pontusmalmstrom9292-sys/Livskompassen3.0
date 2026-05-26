import type { KeyboardEvent, ReactNode } from 'react';
import { Lock } from 'lucide-react';

type PinGateProps = {
  title?: string;
  description?: string;
  pin: string;
  confirmPin?: string;
  setupMode?: boolean;
  error?: string | null;
  submitLabel?: string;
  icon?: ReactNode;
  onPinChange: (value: string) => void;
  onConfirmPinChange?: (value: string) => void;
  onSubmit: () => void;
};

export function PinGate({
  title = 'Ange PIN',
  description,
  pin,
  confirmPin = '',
  setupMode = false,
  error,
  submitLabel,
  icon,
  onPinChange,
  onConfirmPinChange,
  onSubmit,
}: PinGateProps) {
  const onPinKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSubmit();
  };

  return (
    <div className="pin-gate">
      {description ? <p className="pin-gate__lead">{description}</p> : null}
      <label className="pin-gate__field">
        <span className="pin-gate__label">{title}</span>
        <input
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={12}
          autoComplete={setupMode ? 'new-password' : 'one-time-code'}
          value={pin}
          onChange={(e) => onPinChange(e.target.value.replace(/\D/g, ''))}
          onKeyDown={onPinKeyDown}
          placeholder={setupMode ? '••••' : 'PIN'}
          aria-label={title}
          className="input-glass input-glass--pin"
        />
      </label>
      {setupMode && onConfirmPinChange ? (
        <label className="pin-gate__field">
          <span className="pin-gate__label">Bekräfta PIN</span>
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={12}
            autoComplete="new-password"
            value={confirmPin}
            onChange={(e) => onConfirmPinChange(e.target.value.replace(/\D/g, ''))}
            onKeyDown={onPinKeyDown}
            placeholder="••••"
            aria-label="Bekräfta PIN"
            className="input-glass input-glass--pin"
          />
        </label>
      ) : null}
      <button
        type="button"
        onClick={onSubmit}
        className="pin-gate__submit btn-pill--accent flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3"
      >
        {icon ?? <Lock className="h-4 w-4" strokeWidth={2} />}
        {submitLabel ?? (setupMode ? 'Skapa PIN' : 'Lås upp')}
      </button>
      {error ? <p className="pin-gate__error">{error}</p> : null}
    </div>
  );
}
