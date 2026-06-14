import { useNavigate } from 'react-router-dom';
import { RecoveryUrgeSosModule } from '@/features/mabra/components/RecoveryUrgeSosModule';

/** Kat 8 — direkt SOS-route från MåBra-hub (`/mabra/recovery/sos`). */
export function RecoverySosView() {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/95 p-4">
      <RecoveryUrgeSosModule onClose={() => navigate('/mabra', { replace: true })} />
    </div>
  );
}
