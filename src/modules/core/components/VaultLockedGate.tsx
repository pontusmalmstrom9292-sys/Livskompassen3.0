import type { ReactNode } from 'react';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { openValvViaFyren } from '../auth/valvFyrenGate';
import { useStore } from '../store';

type Props = {
  /** Inline card (VaultPage) vs full-screen (DagbokPage). */
  variant?: 'screen' | 'card';
  extra?: ReactNode;
};

const UNLOCK_HINT =
  'Håll inne Kompis-ögat i toppmenyn i 3 sekunder för att låsa upp. Verifiera med fingeravtryck eller Face ID. Direktlänk räcker inte.';

/** Nödutgång när Valv är låst — instruktion + direkt upplåsningsknapp. */
export function VaultLockedGate({ variant = 'screen', extra }: Props) {
  const navigate = useNavigate();
  const setSystemError = useStore((s) => s.setError);

  const tryUnlock = () => {
    void openValvViaFyren(navigate, {
      onDenied: (message) => setSystemError(message),
    });
  };

  if (variant === 'card') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-text-dim">{UNLOCK_HINT}</p>
        <button type="button" className="btn-pill--accent w-full" onClick={tryUnlock}>
          Lås upp Valvet (PIN/Face ID)
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-[min(70vh,32rem)] flex-col items-center justify-center p-6 text-center">
      <Shield className="mb-4 h-16 w-16 text-indigo-500/20" aria-hidden />
      <h2 className="font-display-serif text-xl uppercase tracking-[0.2em] text-text">
        Valvet är låst
      </h2>
      <p className="mt-2 max-w-sm text-sm text-text-muted">{UNLOCK_HINT}</p>
      <button type="button" className="btn-pill--accent mt-6" onClick={tryUnlock}>
        Lås upp Valvet (PIN/Face ID)
      </button>
      {extra}
    </div>
  );
}
