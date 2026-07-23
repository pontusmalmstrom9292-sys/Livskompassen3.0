import type { ReactNode } from 'react';
import { ButtonLink } from '@/design-system';
import { useStore } from '../store';
import { BentoCard } from '@/shared/ui/BentoCard';
import { Lock, Loader2 } from 'lucide-react';
import { EmailAuthPanel } from './EmailAuthPanel';
import { isEmailAuthRequired, isVerifiedEmailUser } from './requireEmailAuth';
import { WidgetShell } from '@/features/widgets/layout/WidgetShell';

type Props = {
  children: ReactNode;
  /** Widget-rutter — fristående skal utan app-header/dock. */
  variant?: 'default' | 'widget';
  /** Titel i WidgetShell när variant=widget (laddning / ej inloggad). */
  widgetTitle?: string;
};

function WidgetAuthShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <WidgetShell title={title} lead="Fristående genväg — sessionen är redan kopplad i bakgrunden.">
      {children}
    </WidgetShell>
  );
}

export function AuthGate({ children, variant = 'default', widgetTitle = 'Widget' }: Props) {
  const user = useStore((s) => s.user);
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const isLoading = useStore((s) => s.system.isLoading);
  const emailRequired = isEmailAuthRequired();
  const hasVerifiedAuth = isVerifiedEmailUser(
    user?.isAnonymous ?? true,
    user?.email,
    user?.emailVerified,
  );

  if (isLoading) {
    if (variant === 'widget') {
      return (
        <WidgetAuthShell title={widgetTitle}>
          <p className="flex items-center justify-center gap-2 text-sm text-text-muted">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Förbereder widget…
          </p>
        </WidgetAuthShell>
      );
    }
    return (
      <BentoCard title="Laddar">
        <p className="text-sm text-text-muted">Ansluter till Livskompassen...</p>
      </BentoCard>
    );
  }

  if (emailRequired && !hasVerifiedAuth && variant !== 'widget') {
    return <EmailAuthPanel compact defaultMode="signin" />;
  }

  if (!isAuthenticated) {
    const gateBody = (
      <>
        <p className="text-sm text-text-muted">
          {variant === 'widget' ? (
            <>Logga in via startsidan en gång — sedan är widgeten redo utan biometri.</>
          ) : (
            <>
              Tryck på <strong>Konto</strong> uppe till höger i headern för att logga in.
            </>
          )}
        </p>
        {variant === 'widget' && (
          <ButtonLink to="/" variant="accent" className="mt-4 inline-flex min-h-11 items-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
            Öppna Livskompassen
          </ButtonLink>
        )}
      </>
    );

    if (variant === 'widget') {
      return (
        <WidgetAuthShell title={widgetTitle}>
          <div className="elongated-module elongated-module--gold p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-accent">
              <Lock className="h-4 w-4" aria-hidden />
              Inloggning krävs
            </p>
            {gateBody}
          </div>
        </WidgetAuthShell>
      );
    }

    return (
      <BentoCard title="Inloggning krävs" icon={<Lock className="h-4 w-4" />} glow="blue">
        {gateBody}
      </BentoCard>
    );
  }

  return <>{children}</>;
}
