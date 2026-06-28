import { useCallback, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useStore } from '@/core/store';
import { EmptyState } from '@/core/ui/EmptyState';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { resolveDcapAlert } from '../api/dcapAlertService';
import { useDcapAlerts } from '../hooks/useDcapAlerts';

type Props = {
  /** Valv upplåst — ingen Firestore-lyssning utan gate. */
  gateOk: boolean;
};

function formatRecommendedAction(action: string): string {
  switch (action) {
    case 'ALERT':
      return 'Eskalering';
    case 'COACHING':
      return 'Coachning';
    case 'NONE':
      return 'Ingen åtgärd';
    default:
      return action;
  }
}

/** P1.4 — Granskningskö för DCAP HITL-eskalering (Valv PIN + session-gated resolve). */
export function VaultDcapAlertsPanel({ gateOk }: Props) {
  const userId = useStore((s) => s.user?.uid);
  const { alerts, loading } = useDcapAlerts(userId, { enabled: gateOk });
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAcknowledge = useCallback(async (alertId: string) => {
    setBusyId(alertId);
    setError(null);
    try {
      await resolveDcapAlert(alertId, 'acknowledged');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Granskning misslyckades.');
    } finally {
      setBusyId(null);
    }
  }, []);

  if (!gateOk) {
    return (
      <EmptyState message="Lås upp Valvet via Fyren för att se säkerhetsgranskningar." />
    );
  }

  if (loading) {
    return <HubPanelSkeleton label="Läser säkerhetsgranskning…" lines={2} />;
  }

  if (alerts.length === 0) {
    return (
      <EmptyState message="Inga väntande DCAP-granskningar. Hash-only logg — ingen rå text lagras." />
    );
  }

  return (
    <div className="space-y-3">
      {error ? (
        <p className="text-xs text-rose-300/90" role="alert">
          {error}
        </p>
      ) : null}
      <ul className="space-y-3">
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className="rounded-xl border border-border/30 bg-surface-2/70 p-3 text-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-sans text-text">
                  Risk {alert.riskScore} · {formatRecommendedAction(alert.recommendedAction)}
                </p>
                <p className="mt-1 text-xs text-text-dim">
                  Väntar på manuell granskning. Ingen rå text exponeras — endast risk och åtgärd.
                </p>
              </div>
              <button
                type="button"
                className="ds-btn ds-btn--ghost shrink-0 inline-flex items-center gap-1.5 text-xs"
                disabled={busyId === alert.id}
                onClick={() => void handleAcknowledge(alert.id)}
              >
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                {busyId === alert.id ? 'Sparar…' : 'Granskad'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
