import { Navigate } from 'react-router-dom';
import { AuthGate } from '@/core/auth/AuthGate';

/**
 * One-tap Ankare — native/web widget entry.
 * Redirects to Familjen Drogfrihet with akut=1 (SOS opens).
 */
function WidgetDrogfrihetAkutInner() {
  return <Navigate to="/familjen?tab=drogfrihet&akut=1" replace />;
}

export function WidgetDrogfrihetAkutPage() {
  return (
    <AuthGate variant="widget" widgetTitle="SOS Ankare">
      <WidgetDrogfrihetAkutInner />
    </AuthGate>
  );
}
