import { useNavigate } from 'react-router-dom';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { RecoveryUrgeSosModule } from '@/features/mabra/components/RecoveryUrgeSosModule';

/** Fas 23C — direkt SOS-route från MåBra-hub (`/mabra/recovery/sos`). */
export function RecoverySosView() {
  const navigate = useNavigate();
  return (
    <HubErrorBoundary
      title="SOS Ankare kunde inte laddas"
      glow="gold"
      logTag="RecoverySosView"
      errorBody="Gå tillbaka till MåBra och öppna SOS igen."
      backTo="/mabra"
      backLabel="Till MåBra"
    >
      <RecoveryUrgeSosModule onClose={() => navigate('/mabra', { replace: true })} />
    </HubErrorBoundary>
  );
}
