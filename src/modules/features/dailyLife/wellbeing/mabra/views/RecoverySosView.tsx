import { useNavigate } from 'react-router-dom';
import { RecoveryUrgeSosModule } from '@/features/mabra/components/RecoveryUrgeSosModule';

/** Fas 23C — direkt SOS-route från MåBra-hub (`/mabra/recovery/sos`). */
export function RecoverySosView() {
  const navigate = useNavigate();
  return <RecoveryUrgeSosModule onClose={() => navigate('/mabra', { replace: true })} />;
}
