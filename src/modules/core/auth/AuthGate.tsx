import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { BentoCard } from '@/shared/ui/BentoCard';
import { Lock } from 'lucide-react';
import { isEmailAuthRequired } from './requireEmailAuth';

type Props = {
  children: ReactNode;
  /** Widget-rutter utan header — visa väg till startsidan. */
  variant?: 'default' | 'widget';
};

export function AuthGate({ children, variant = 'default' }: Props) {
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
      <BentoCard title="Inloggning krävs" icon={<Lock className="h-4 w-4" />} glow="blue">
        <p className="text-sm text-text-muted">
          {variant === 'widget' ? (
            <>
              Öppna startsidan och logga in där — widgeten behöver ett aktivt konto.
            </>
          ) : emailRequired ? (
            'Logga in med Google eller e-post via Konto uppe till höger. Anonym åtkomst är avstängd i prod.'
          ) : (
            <>
              Tryck på <strong>Konto</strong> uppe till höger i headern för att logga in.
            </>
          )}
        </p>
        {variant === 'widget' && (
          <Link to="/" className="btn-pill--accent mt-4 inline-flex min-h-11 items-center text-sm">
            Gå till startsidan
          </Link>
        )}
      </BentoCard>
    );
  }

  return <>{children}</>;
}
