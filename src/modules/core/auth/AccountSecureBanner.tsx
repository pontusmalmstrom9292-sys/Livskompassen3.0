import { useState } from 'react';
import { ShieldCheck, LogOut } from 'lucide-react';
import { useStore } from '../store';
import { EmailAuthPanel } from './EmailAuthPanel';
import { signOutUser } from './authService';
import { BentoCard } from '../ui/BentoCard';

export function AccountSecureBanner() {
  const user = useStore((s) => s.user);
  const [signingOut, setSigningOut] = useState(false);

  if (!user) return null;

  if (user.isAnonymous) {
    return <EmailAuthPanel defaultMode="create" />;
  }

  return (
    <BentoCard
      title="Konto aktivt"
      description="Kunskapen följer ditt konto mellan enheter"
      icon={<ShieldCheck className="h-4 w-4 text-success" />}
    >
      <p className="text-sm text-text-muted">{user.email}</p>
      <button
        type="button"
        disabled={signingOut}
        onClick={async () => {
          setSigningOut(true);
          try {
            await signOutUser();
          } finally {
            setSigningOut(false);
          }
        }}
        className="btn-pill--ghost mt-3 flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Logga ut
      </button>
    </BentoCard>
  );
}
