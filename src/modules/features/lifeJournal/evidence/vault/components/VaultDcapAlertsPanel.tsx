import { useStore } from '@/core/store';
import { useDcapAlerts } from '../hooks/useDcapAlerts';

/** P1.4 — Granskningskö för DCAP HITL-eskalering (Valv PIN-gated). */
export function VaultDcapAlertsPanel() {
  const userId = useStore((s) => s.user?.uid);
  const { alerts, loading } = useDcapAlerts(userId);

  if (loading) {
    return <p className="text-sm text-text-dim">Laddar säkerhetsgranskning…</p>;
  }

  if (alerts.length === 0) {
    return (
      <p className="text-sm text-text-muted">
        Inga väntande DCAP-granskningar. Hash-only logg — ingen rå text lagras.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {alerts.map((alert) => (
        <li
          key={alert.id}
          className="rounded-xl border border-border/30 bg-surface-2/70 p-3 text-sm"
        >
          <p className="font-sans text-text">
            Risk {alert.riskScore} · {alert.recommendedAction}
          </p>
          <p className="mt-1 text-xs text-text-dim">
            Status: {alert.status} · Granska manuellt innan åtgärd.
          </p>
        </li>
      ))}
    </ul>
  );
}
