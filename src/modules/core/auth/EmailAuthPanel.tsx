import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fingerprint, Loader2, Lock, Mail } from 'lucide-react';
import { Button } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import { FirebaseError } from 'firebase/app';
import {
  linkOrCreateEmailAccount,
  mapAuthError,
  signInWithEmail,
  signInWithGoogle,
} from './authService';
import { enableAppUnlock, isAppUnlockSupported } from './appUnlock';
import { isAppUnlockEnabled, markFingerprintSetupPending } from './appUnlockPrefs';
import { getExpectedLoginEmail } from './googleAuthProvider';

type Mode = 'create' | 'signin';

type Props = {
  compact?: boolean;
  defaultMode?: Mode;
  onSuccess?: () => void;
};

export function EmailAuthPanel({ compact = false, defaultMode = 'create', onSuccess }: Props) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [showAltAuth, setShowAltAuth] = useState(false);
  const loginHint = getExpectedLoginEmail();
  const [email, setEmail] = useState(() => loginHint ?? '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [fingerprintPref, setFingerprintPref] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const googlePrimary = compact && !showAltAuth;

  const handleGoogle = async () => {
    setError(null);
    setSuccess(null);
    setGoogleLoading(true);
    try {
      // Kompakt Google-knapp = Logga in på befintligt konto — inte koppla anonym uid.
      const linkAnonymous = mode === 'create' && !googlePrimary;
      const googleUser = await signInWithGoogle({ linkAnonymous });
      if (googleUser) {
        if (fingerprintPref && isAppUnlockSupported()) {
          await enableAppUnlock();
        }
        setSuccess('Inloggad med Google.');
        onSuccess?.();
        navigate(window.location.pathname + window.location.search, { replace: true });
      } else {
        if (fingerprintPref && isAppUnlockSupported()) {
          markFingerprintSetupPending();
        }
        setSuccess('Öppnar Google… (kom tillbaka hit efter inloggning)');
      }
    } catch (err) {
      const code =
        err instanceof FirebaseError
          ? err.code
          : err instanceof Error && /developer_error|12501|cancel/i.test(err.message)
            ? err.message
            : '';
      setError(mapAuthError(code));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password) {
      setError('Fyll i e-post och lösenord.');
      return;
    }

    if (mode === 'create' && password !== confirm) {
      setError('Lösenorden matchar inte.');
      return;
    }

    if (mode === 'create' && password.length < 6) {
      setError('Lösenordet måste vara minst 6 tecken.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'create') {
        await linkOrCreateEmailAccount(email, password);
        setSuccess('Konto skapat. Kunskapen följer nu ditt konto mellan enheter.');
      } else {
        await signInWithEmail(email, password);
        setSuccess('Inloggad.');
      }
      setPassword('');
      setConfirm('');
      onSuccess?.();
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : '';
      setError(mapAuthError(code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <BentoCard
      title={googlePrimary ? 'Logga in' : mode === 'create' ? 'Säkra ditt konto' : 'Logga in'}
      description={
        googlePrimary
          ? 'Fortsätt med Google'
          : mode === 'create'
            ? 'Koppla e-post till ditt nuvarande konto — samma data, följer dig överallt'
            : 'Logga in på ett befintligt konto'
      }
      icon={<Lock className="h-4 w-4" />}
    >
      {!compact && (
        <p className="mb-4 text-sm text-text-muted">
          {mode === 'create'
            ? 'Om du redan importerat profil i Kunskapsvalvet behåller du allt — vi byter bara från anonym till e-post.'
            : 'Loggar du in på samma konto som tidigare följer Kunskapen med. Annat konto = annan data.'}
        </p>
      )}

      <Button
        variant="ghost"
        disabled={loading || googleLoading}
        onClick={() => void handleGoogle()}
        className="mb-4 flex min-h-11 w-full items-center justify-center gap-2 border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Fortsätt med Google
      </Button>
      {loginHint && (googlePrimary || mode === 'signin') && (
        <p className="mb-3 text-center text-xs text-text-muted">
          Välj <span className="text-text-muted">{loginHint}</span> i Google-fönstret.
        </p>
      )}

      {googlePrimary && isAppUnlockSupported() && !isAppUnlockEnabled() && (
        <label className="mb-3 flex min-h-11 cursor-pointer items-start gap-3 rounded-2xl border border-border/60 px-3 py-2.5 focus-within:outline-none focus-within:ring-2 focus-within:ring-accent/40">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-border accent-accent"
            checked={fingerprintPref}
            onChange={(e) => setFingerprintPref(e.target.checked)}
          />
          <span className="text-xs leading-relaxed text-text-muted">
            <span className="flex items-center gap-1.5 font-medium text-text">
              <Fingerprint className="h-3.5 w-3.5 text-accent" />
              Lås upp med fingeravtryck nästa gång
            </span>
            Google-inloggningen sparas — du slipper logga in igen varje gång.
          </span>
        </label>
      )}

      {googlePrimary && isAppUnlockEnabled() && (
        <p className="mb-3 text-center text-xs text-text-muted">
          Fingeravtryck är aktiverat — efter Google-inloggning räcker fingeravtryck vid nästa besök.
        </p>
      )}

      {compact && !showAltAuth ? (
        <button
          type="button"
          onClick={() => {
            setShowAltAuth(true);
            setError(null);
            setSuccess(null);
          }}
          className="mt-2 min-h-11 w-full text-center text-xs text-text-muted underline-offset-2 hover:text-text-muted hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          Andra sätt
        </button>
      ) : (
        <>
          {!compact && <p className="mb-3 text-center text-xs text-text-muted">eller med e-post</p>}

          {compact && (
            <button
              type="button"
              onClick={() => {
                setShowAltAuth(false);
                setError(null);
                setSuccess(null);
              }}
              className="mb-3 min-h-11 w-full text-center text-xs text-text-muted underline-offset-2 hover:text-text-muted hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              Tillbaka till Google
            </button>
          )}

          <div className="mb-4 flex gap-2">
            <Button
              variant={mode === 'create' ? 'success' : 'ghost'}
              className="min-h-11 flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              onClick={() => {
                setMode('create');
                setError(null);
                setSuccess(null);
              }}
            >
              Skapa konto
            </Button>
            <Button
              variant={mode === 'signin' ? 'success' : 'ghost'}
              className="min-h-11 flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              onClick={() => {
                setMode('signin');
                setError(null);
                setSuccess(null);
              }}
            >
              Logga in
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@email.se"
                className="input-glass pl-10"
                disabled={loading}
              />
            </div>
            <input
              type="password"
              autoComplete={mode === 'create' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Lösenord (minst 6 tecken)"
              className="input-glass"
              disabled={loading}
            />
            {mode === 'create' && (
              <input
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Bekräfta lösenord"
                className="input-glass"
                disabled={loading}
              />
            )}
            <Button
              type="submit"
              variant="success"
              disabled={loading}
              className="flex min-h-11 w-full items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {mode === 'create' ? 'Skapa konto och spara' : 'Logga in'}
            </Button>
          </form>
        </>
      )}

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      {success && <p className="mt-3 text-sm text-success">{success}</p>}
    </BentoCard>
  );
}
