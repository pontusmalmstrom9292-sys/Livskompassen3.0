import { useCallback, useEffect, useState } from 'react';
import { Fingerprint, Loader2 } from 'lucide-react';
import { Button } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import { authenticateAppUnlock } from './appUnlock';
import { markAppUnlockedThisSession } from './appUnlockPrefs';

type Props = {
  compact?: boolean;
  autoTry?: boolean;
  onSuccess?: () => void;
};

export function FingerprintUnlockPanel({ compact = false, autoTry = false, onSuccess }: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tryUnlock = useCallback(async () => {
    setPending(true);
    setError(null);
    const ok = await authenticateAppUnlock();
    setPending(false);
    if (ok) {
      markAppUnlockedThisSession();
      onSuccess?.();
    } else {
      setError('Upplåsning misslyckades. Försök igen.');
    }
  }, [onSuccess]);

  useEffect(() => {
    if (autoTry) void tryUnlock();
  }, [autoTry, tryUnlock]);

  const body = (
    <>
      <Button
        className="flex w-full items-center justify-center gap-2"
        disabled={pending}
        onClick={() => void tryUnlock()}
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Fingerprint className="h-4 w-4" />}
        {pending ? 'Verifierar…' : 'Lås upp med fingeravtryck'}
      </Button>
      {!compact && (
        <p className="mt-3 text-center text-xs text-text-dim">
          Google-kontot är redan inloggat — fingeravtryck verifierar bara att det är du.
        </p>
      )}
      {error && <p className="mt-3 text-center text-xs text-danger">{error}</p>}
    </>
  );

  if (compact) {
    return (
      <BentoCard title="Lås upp" description="Ditt konto väntar" icon={<Fingerprint className="h-4 w-4" />}>
        {body}
      </BentoCard>
    );
  }

  return (
    <div className="glass-card rounded-[2rem] border border-border p-6">
      <Fingerprint className="mx-auto h-8 w-8 text-accent" strokeWidth={1.5} />
      <p className="mt-3 text-center text-sm font-medium text-text">Lås upp med fingeravtryck</p>
      <p className="mt-1 text-center text-xs text-text-dim">
        Ditt Google-konto är redan inloggat — verifiera dig för att öppna appen.
      </p>
      <div className="mt-4">{body}</div>
    </div>
  );
}
