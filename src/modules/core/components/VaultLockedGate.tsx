import { useState, type ReactNode } from 'react';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { openValvViaFyren } from '../auth/valvFyrenGate';
import { useStore } from '../store';
import { isCapacitorNative } from '../platform/capacitorPlatform';

type Props = {
  /** Inline card (VaultPage) vs full-screen (DagbokPage). */
  variant?: 'screen' | 'card';
  extra?: ReactNode;
};

/**
 * Returnerar rätt instruktionstext baserat på plattform:
 * - Webb: lång-press på Kompis-ögat (WebAuthn via Fyren)
 * - Capacitor native: tryck direkt på knappen (Native Biometric)
 */
function getUnlockHint(): string {
  if (isCapacitorNative()) {
    return 'Tryck på knappen nedan och verifiera med ditt fingeravtryck eller Face ID för att öppna Valvet.';
  }
  return 'Håll inne Kompis-ögat i toppmenyn i 3 sekunder. Verifiera med fingeravtryck eller Face ID. Direktlänk räcker inte.';
}

function getButtonLabel(busy: boolean): string {
  if (busy) return 'Verifierar…';
  return isCapacitorNative() ? 'Öppna Valvet (fingeravtryck)' : 'Lås upp Valvet (biometri)';
}

/** Nödutgång när Valv är låst — instruktion + direkt upplåsningsknapp. */
export function VaultLockedGate({ variant = 'screen', extra }: Props) {
  const navigate = useNavigate();
  const setSystemError = useStore((s) => s.setError);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const tryUnlock = () => {
    setUnlockError(null);
    setBusy(true);
    void openValvViaFyren(navigate, {
      onDenied: (message) => {
        setUnlockError(message);
        setSystemError(message);
      },
    }).finally(() => setBusy(false));
  };

  const errorBlock = unlockError ? (
    <p className="mt-3 text-xs text-danger" role="alert">
      {unlockError}
    </p>
  ) : null;

  const hint = getUnlockHint();
  const buttonLabel = getButtonLabel(busy);

  if (variant === 'card') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-text-dim">{hint}</p>
        <button
          type="button"
          className="btn-pill--accent w-full"
          disabled={busy}
          onClick={tryUnlock}
        >
          {buttonLabel}
        </button>
        {errorBlock}
      </div>
    );
  }

  return (
    <div className="flex h-[min(70vh,32rem)] flex-col items-center justify-center p-6 text-center">
      <Shield className="mb-4 h-16 w-16 text-indigo-500/20" aria-hidden />
      <h2 className="font-display-serif text-xl uppercase tracking-[0.2em] text-text">
        Valvet är låst
      </h2>
      <p className="mt-2 max-w-sm text-sm text-text-muted">{hint}</p>
      <button
        type="button"
        className="btn-pill--accent mt-6"
        disabled={busy}
        onClick={tryUnlock}
      >
        {buttonLabel}
      </button>
      {errorBlock}
      {extra}
    </div>
  );
}
