import type { ReactNode } from 'react';
import { useStore } from '../store';
import { BentoCard } from '@/shared/ui/BentoCard';
import { Lock } from 'lucide-react';
import { isEmailAuthRequired } from './requireEmailAuth';

export function AuthGate({ children }: { children: ReactNode }) {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const isLoading = useStore((s) => s.system.isLoading);
  const emailRequired = isEmailAuthRequired();

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
          {emailRequired
            ? 'Logga in med Google eller e-post via Konto uppe till höger. Anonym åtkomst är avstängd i prod.'
            : (
              <>
                Tryck på <strong>Konto</strong> uppe till höger i headern för att logga in.
              </>
            )}
        </p>
      </BentoCard>
    );
  }

  return <>{children}</>;
}
