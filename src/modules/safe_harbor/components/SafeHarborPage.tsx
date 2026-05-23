import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ClusterShell } from '../../core/ui/ClusterShell';
import { BiffFlowPanel } from './BiffFlowPanel';

export function SafeHarborPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleKlar = useCallback(() => {
    navigate(location.pathname, { replace: true, state: null });
  }, [navigate, location.pathname]);

  const prefilled = (location.state as { prefilledMessage?: string } | null)?.prefilledMessage;

  return (
    <ClusterShell
      title="Hamnen"
      description="BIFF · gränser · Grey Rock"
      tone="indigo"
      hint="10% logistik · 90% beten ignoreras — klistra in, ett steg, inget JADE."
    >
      <BiffFlowPanel variant="hamn" initialMessage={prefilled ?? ''} onKlar={handleKlar} />
    </ClusterShell>
  );
}
