import type { ReactNode } from 'react';
import { useStore } from '../store';
import { BentoCard } from '../ui/BentoCard';
import { Lock } from 'lucide-react';

export function AuthGate({ children }: { children: ReactNode }) {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const isLoading = useStore((s) => s.system.isLoading);

  if (isLoading) {
    return (
      <BentoCard title="Laddar">
        <p className="text-sm text-text-dim">Ansluter till Livskompassen...</p>
      </BentoCard>
    );
  }

  if (!isAuthenticated) {
    return (
      <BentoCard title="Inloggning krävs" icon={<Lock className="h-4 w-4" />}>
        <p className="text-sm text-text-muted">
          Kunskapsvalvet och känsliga moduler kräver Firebase Auth. Kontrollera att{' '}
          <code className="text-accent/80">VITE_FIREBASE_*</code> finns i din{' '}
          <code className="text-accent/80">.env</code>.
        </p>
      </BentoCard>
    );
  }

  return <>{children}</>;
}
