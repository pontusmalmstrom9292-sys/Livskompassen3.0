import { useEffect, useState } from 'react';
import { Lock, LogOut, ShieldCheck, X } from 'lucide-react';
import { useStore } from '../store';
import { EmailAuthPanel } from './EmailAuthPanel';
import { signOutUser } from './authService';

export function AccountAuthMenu({ compact = false }: { compact?: boolean }) {
  const user = useStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!user) return null;

  const label = user.isAnonymous ? 'Konto' : user.email?.split('@')[0] ?? 'Konto';

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={compact ? 'header-segment__btn' : 'header-glass-btn'}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={compact ? `Konto — ${label}` : undefined}
      >
        {user.isAnonymous ? (
          <Lock className="h-4 w-4" strokeWidth={1.75} />
        ) : (
          <ShieldCheck className="h-4 w-4 text-success" strokeWidth={1.75} />
        )}
        {!compact && <span className="max-w-[6rem] truncate">{label}</span>}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]"
            aria-label="Stäng konto"
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed left-5 right-5 top-[4.25rem] z-50 mx-auto max-w-sm"
            role="dialog"
            aria-label="Konto"
          >
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-bg text-text-dim"
                aria-label="Stäng"
              >
                <X className="h-4 w-4" />
              </button>

              {user.isAnonymous ? (
                <EmailAuthPanel
                  compact
                  defaultMode="create"
                  onSuccess={() => setOpen(false)}
                />
              ) : (
                <div className="glass-card rounded-[2rem] border border-border p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-success" />
                    <div>
                      <p className="text-sm font-medium text-text">Konto aktivt</p>
                      <p className="text-xs text-text-dim">Kunskapen följer ditt konto</p>
                    </div>
                  </div>
                  <p className="truncate text-sm text-text-muted">{user.email}</p>
                  <button
                    type="button"
                    disabled={signingOut}
                    onClick={async () => {
                      setSigningOut(true);
                      try {
                        await signOutUser();
                        setOpen(false);
                      } finally {
                        setSigningOut(false);
                      }
                    }}
                    className="btn-pill--ghost mt-4 flex items-center gap-2 text-sm"
                  >
                    <LogOut className="h-4 w-4" />
                    Logga ut
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
