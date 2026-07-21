import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { clearDeviceSession } from '../security/clearDeviceSession';
import { Button } from '@/design-system';

export function ClearDevicePanel() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-3 border-t border-border pt-4">
      <h3 className="text-sm font-medium text-text">Rensa enheten</h3>
      <p className="text-xs leading-relaxed text-text-muted">
        Raderar utkast, PIN-session och valv-gate på denna enhet. Bevis i molnet påverkas inte.
        Du fortsätter vara inloggad om du inte loggar ut separat.
      </p>
      <Button
        type="button"
        variant="ghost"
        className="inline-flex min-h-11 items-center gap-2 text-sm text-danger"
        disabled={busy}
        onClick={() => {
          if (!window.confirm('Rensa känslig lokal data på denna enhet?')) return;
          setBusy(true);
          setError(null);
          void clearDeviceSession()
            .then(() => setDone(true))
            .catch((err) => {
              setError(err instanceof Error ? err.message : 'Kunde inte rensa.');
            })
            .finally(() => setBusy(false));
        }}
      >
        <Trash2 className="h-4 w-4" aria-hidden />
        {busy ? 'Rensar…' : 'Rensa enheten'}
      </Button>
      {done && (
        <p className="text-xs text-success/90" role="status">
          Lokal session rensad.
        </p>
      )}
      {error && (
        <p className="rounded-lg border border-danger/25 bg-danger/10 px-3 py-2 text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
