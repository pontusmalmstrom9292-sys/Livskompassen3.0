import type { ReactNode } from 'react';
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
  return (
    <div className="space-y-2">
      {description && <p className="text-sm text-text-muted">{description}</p>}
      <input
        type="password"
        inputMode="numeric"
        value={pin}
        onChange={(e) => onPinChange(e.target.value)}
        placeholder={setupMode ? 'Skapa PIN' : 'PIN'}
        aria-label={title}
        className="input-glass rounded-xl px-3 py-2"
      />
      {setupMode && onConfirmPinChange && (
        <input
          type="password"
          inputMode="numeric"
          value={confirmPin}
          onChange={(e) => onConfirmPinChange(e.target.value)}
          placeholder="Bekräfta PIN"
          className="input-glass rounded-xl px-3 py-2"
        />
      )}
      <button
        type="button"
        onClick={onSubmit}
        className="btn-pill--accent flex items-center gap-2 rounded-xl px-4 py-2"
      >
        {icon ?? <Lock className="h-4 w-4" />}
        {submitLabel ?? (setupMode ? 'Skapa PIN' : 'Lås upp')}
      </button>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
