import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { Fingerprint, LogOut, ShieldCheck, X } from 'lucide-react';
import { Button, Modal } from '@/design-system';
import { HeaderLockGlyph, HeaderShieldGlyph } from '../ui/HeaderChromeGlyphs';
import { useStore } from '../store';
import { EmailAuthPanel } from './EmailAuthPanel';
import { FingerprintUnlockPanel } from './FingerprintUnlockPanel';
import { signOutUser } from './authService';
import { getExpectedLoginEmail } from './googleAuthProvider';
import {
  disableAppUnlock,
  enableAppUnlock,
  isAppUnlockSupported,
} from './appUnlock';
import { isAppUnlockEnabled, isAppUnlockedThisSession } from './appUnlockPrefs';

type Props = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Mindre trigger i kanon-header (ikon utan etikett på smal skärm). */
  compactTrigger?: boolean;
  /** Executive premium — guld sköld-styling. */
  chromeVariant?: 'default' | 'executive';
};

export function AccountAuthMenu({ open: controlledOpen, onOpenChange, compactTrigger, chromeVariant = 'default' }: Props) {
  const user = useStore((s) => s.user);
  const [internalOpen, setInternalOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [biometricBusy, setBiometricBusy] = useState(false);
  const [biometricOn, setBiometricOn] = useState(() => isAppUnlockEnabled());

  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  /** Google redirect / native sign-in uppdaterar store utan EmailAuthPanel onSuccess — stäng dialogen. */
  useEffect(() => {
    if (open && user && !user.isAnonymous) {
      setOpen(false);
    }
  }, [open, user, setOpen]);

  const isAnonymous = user?.isAnonymous ?? true;
  const needsFingerprintUnlock =
    !!user &&
    !user.isAnonymous &&
    isAppUnlockEnabled() &&
    isAppUnlockSupported() &&
    !isAppUnlockedThisSession();
  const label = !user ? 'Logga in' : user.isAnonymous ? 'Konto' : user.email?.split('@')[0] ?? 'Konto';

  const dialog = (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      hideHeader
      ariaLabel="Konto"
      className="account-auth-overlay !z-[230] !items-center !justify-center !bg-black/50 !backdrop-blur-[2px]"
      panelClassName="account-auth-panel !max-w-sm !border-0 !bg-transparent !p-0 !shadow-none glow-none"
    >
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute -right-2 -top-2 z-10 flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-bg text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          aria-label="Stäng kontomeny"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>

        {!user || user.isAnonymous ? (
          <EmailAuthPanel
            compact
            defaultMode={
              !user
                ? 'signin'
                : user.isAnonymous && getExpectedLoginEmail()
                  ? 'signin'
                  : user.isAnonymous
                    ? 'create'
                    : 'signin'
            }
            onSuccess={() => setOpen(false)}
          />
        ) : needsFingerprintUnlock ? (
          <FingerprintUnlockPanel compact autoTry onSuccess={() => setOpen(false)} />
        ) : (
          <div className="glass-card rounded-[2rem] border border-border p-5">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-success" />
              <div>
                <p className="text-sm font-medium text-text">Konto aktivt</p>
                <p className="text-xs text-text-muted">Kunskapen följer ditt konto</p>
              </div>
            </div>
            <p className="truncate text-sm text-text-muted">{user.email}</p>
            {getExpectedLoginEmail() &&
              user.email &&
              user.email.toLowerCase() !== getExpectedLoginEmail()!.toLowerCase() && (
                <p className="mt-2 text-xs text-danger">
                  Fel konto — logga ut och välj {getExpectedLoginEmail()} under Logga in.
                </p>
              )}

            {isAppUnlockSupported() && (
              <div className="mt-4 border-t border-border pt-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border accent-accent"
                    checked={biometricOn}
                    disabled={biometricBusy}
                    onChange={async (e) => {
                      const next = e.target.checked;
                      setBiometricBusy(true);
                      try {
                        if (next) {
                          const ok = await enableAppUnlock();
                          setBiometricOn(ok);
                        } else {
                          disableAppUnlock();
                          setBiometricOn(false);
                        }
                      } finally {
                        setBiometricBusy(false);
                      }
                    }}
                  />
                  <span className="flex items-center gap-2 text-sm text-text-muted">
                    <Fingerprint className="h-4 w-4 text-accent" />
                    Öppna med fingeravtryck nästa gång
                  </span>
                </label>
              </div>
            )}

            <Button
              variant="ghost"
              disabled={signingOut}
              onClick={async () => {
                setSigningOut(true);
                try {
                  await signOutUser();
                  setBiometricOn(false);
                  setOpen(false);
                } finally {
                  setSigningOut(false);
                }
              }}
              className="mt-4 flex items-center gap-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              <LogOut className="h-4 w-4" />
              Logga ut
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );

  return (
    <>
      {compactTrigger ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={clsx(
            'header-chrome-btn header-chrome-btn--round header-glass-btn header-glass-btn--kanon min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
            chromeVariant === 'executive' && 'exec-header-shield',
          )}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label="Konto och inloggning"
          title="Konto och inloggning"
        >
          {!user || isAnonymous ? (
            <HeaderLockGlyph className="header-chrome-btn__glyph h-[1.15rem] w-[1.15rem]" />
          ) : (
            <HeaderShieldGlyph
              className={clsx(
                'header-chrome-btn__glyph h-[1.15rem] w-[1.15rem]',
                chromeVariant === 'executive' ? 'text-accent' : 'header-chrome-btn__glyph--success',
              )}
            />
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="header-glass-btn header-glass-btn--kanon min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label={label}
        >
          {!user || isAnonymous ? (
            <HeaderLockGlyph className="header-chrome-btn__glyph h-4 w-4" />
          ) : (
            <HeaderShieldGlyph className="header-chrome-btn__glyph header-chrome-btn__glyph--success h-4 w-4" />
          )}
          <span className="max-w-[6rem] truncate">{label}</span>
        </button>
      )}
      {dialog}
    </>
  );
}
