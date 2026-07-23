import { useState, type ReactNode } from 'react';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { openValvViaFyren } from '../auth/valvFyrenGate';
import { useStore } from '../store';
import { isCapacitorNative } from '../platform/capacitorPlatform';
import { CalmBreathingCircle } from '@/modules/capture/components/CalmBreathingCircle';
import { Button } from '@/design-system';

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
    return 'Tryck på knappen nedan och verifiera med fingeravtryck eller Face ID. Direktlänk till /valvet räcker inte utan verifiering.';
  }
  return 'Håll Kompis-ögat (Fyren) i 3 sekunder — eller tryck knappen nedan. Verifiera med Touch ID / Face ID / Windows Hello. Det finns ingen numerisk PIN; biometri krävs.';
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
    <p
      className="mt-3 rounded-lg border border-danger/25 bg-danger/10 px-3 py-2 text-xs text-danger"
      role="alert"
    >
      {unlockError}
    </p>
  ) : null;

  const hint = getUnlockHint();
  const buttonLabel = getButtonLabel(busy);

  if (variant === 'card') {
    return (
      <div className="vault-locked-gate vault-locked-gate--card space-y-4">
        <p className="text-sm leading-relaxed text-text-muted">{hint}</p>

        {busy ? (
          <div className="flex flex-col items-center justify-center py-4">
            <CalmBreathingCircle size="sm" />
            <p className="mt-2 text-xs text-text-muted">Verifierar kryptografi...</p>
          </div>
        ) : (
          <Button
            type="button"
            variant="accent"
            className="min-h-11 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            disabled={busy}
            onClick={tryUnlock}
          >
            {buttonLabel}
          </Button>
        )}
        {errorBlock}
      </div>
    );
  }

  return (
    <div className="vault-locked-gate vault-locked-gate--screen flex h-[min(70vh,32rem)] flex-col items-center justify-center gap-1 p-6 text-center">
      {busy ? (
        <div className="mb-4 flex flex-col items-center">
          <CalmBreathingCircle size="md" />
          <p className="mt-4 font-display text-sm uppercase tracking-widest text-text-muted">Låser upp</p>
        </div>
      ) : (
        <Shield className="mb-4 h-16 w-16 text-accent/20" aria-hidden />
      )}
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-accent/70">Säker zon</p>
      <h2 className="mt-1 font-display-serif text-xl uppercase tracking-[0.2em] text-text">
        Valvet är låst
      </h2>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-muted">{hint}</p>

      {!busy && (
        <Button
          type="button"
          variant="accent"
          className="mt-6 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          disabled={busy}
          onClick={tryUnlock}
        >
          {buttonLabel}
        </Button>
      )}
      {errorBlock}
      {extra ? <div className="mt-4 w-full max-w-sm">{extra}</div> : null}
    </div>
  );
}
