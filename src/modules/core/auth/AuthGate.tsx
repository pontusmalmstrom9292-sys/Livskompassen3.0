import type { ReactNode } from 'react';
import { useStore } from '../store';
import { BentoCard } from '../ui/BentoCard';
import { EmailAuthPanel } from './EmailAuthPanel';
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
      <div className="space-y-4">
        <BentoCard title="Inloggning krävs" icon={<Lock className="h-4 w-4" />}>
          <p className="text-sm text-text-muted">
            Skapa konto eller logga in för att använda denna modul.
          </p>
        </BentoCard>
        <EmailAuthPanel compact defaultMode="signin" />
      </div>
    );
  }

  return <>{children}</>;
}
