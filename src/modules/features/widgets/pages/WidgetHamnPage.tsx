import { Link, useLocation } from 'react-router-dom';
import { AuthGate } from '@/core/auth/AuthGate';
import { BiffPublicPanel } from '@/features/family/safeHarbor/components/BiffPublicPanel';
import { HAMN_EMBEDDED_LEAD } from '@/features/family/safeHarbor/hamnCopy';
import { WidgetShell } from '../layout/WidgetShell';

function WidgetHamnInner() {
  const location = useLocation();
  const initialMessage =
    (location.state as { prefilledMessage?: string } | null)?.prefilledMessage ?? '';

  return (
    <WidgetShell title="Hamn · BIFF" lead={HAMN_EMBEDDED_LEAD}>
      <div className="space-y-4">
        <BiffPublicPanel initialMessage={initialMessage} />
        <Link to="/familjen?tab=hamn" className="ds-btn ds-btn--accent inline-flex text-xs">
          Full Trygg Hamn
        </Link>
      </div>
    </WidgetShell>
  );
}

/** WH4 — kompakt BIFF på widget-route; full hub via länk. */
export function WidgetHamnPage() {
  return (
    <AuthGate>
      <WidgetHamnInner />
    </AuthGate>
  );
}
