import { useState } from 'react';
import { Loader2, Lock, Mail } from 'lucide-react';
import { BentoCard } from '../ui/BentoCard';
import { FirebaseError } from 'firebase/app';
import {
  linkOrCreateEmailAccount,
  mapAuthError,
  signInWithEmail,
  signInWithGoogle,
} from './authService';
import { getExpectedLoginEmail } from './googleAuthProvider';

type Mode = 'create' | 'signin';

type Props = {
  compact?: boolean;
  defaultMode?: Mode;
  onSuccess?: () => void;
};

export function EmailAuthPanel({ compact = false, defaultMode = 'create', onSuccess }: Props) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const loginHint = getExpectedLoginEmail();
  const [email, setEmail] = useState(() => loginHint ?? '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGoogle = async () => {
    setError(null);
    setSuccess(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle({ linkAnonymous: mode === 'create' });
      setSuccess('Inloggad med Google.');
      onSuccess?.();
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : '';
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
      title={mode === 'create' ? 'Säkra ditt konto' : 'Logga in'}
      description={
        mode === 'create'
          ? 'Koppla e-post till ditt nuvarande konto — samma data, följer dig överallt'
          : 'Logga in på ett befintligt konto'
      }
      icon={<Lock className="h-4 w-4" />}
    >
      {!compact && (
        <p className="mb-4 text-sm text-text-dim">
          {mode === 'create'
            ? 'Om du redan importerat profil i Kunskapsvalvet behåller du allt — vi byter bara från anonym till e-post.'
            : 'Loggar du in på samma konto som tidigare följer Kunskapen med. Annat konto = annan data.'}
        </p>
      )}

      <button
        type="button"
        disabled={loading || googleLoading}
        onClick={() => void handleGoogle()}
        className="btn-pill--ghost mb-4 flex w-full items-center justify-center gap-2 border border-border"
      >
        {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Fortsätt med Google
      </button>
      {loginHint && mode === 'signin' && (
        <p className="mb-3 text-center text-xs text-text-dim">
          Välj <span className="text-text-muted">{loginHint}</span> i Google-fönstret.
        </p>
      )}

      <p className="mb-3 text-center text-xs text-text-dim">eller med e-post</p>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setMode('create');
            setError(null);
            setSuccess(null);
          }}
          className={mode === 'create' ? 'btn-pill--success' : 'btn-pill--ghost'}
        >
          Skapa konto
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('signin');
            setError(null);
            setSuccess(null);
          }}
          className={mode === 'signin' ? 'btn-pill--success' : 'btn-pill--ghost'}
        >
          Logga in
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
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
        <button type="submit" disabled={loading} className="btn-pill--success flex w-full items-center justify-center gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {mode === 'create' ? 'Skapa konto och spara' : 'Logga in'}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      {success && <p className="mt-3 text-sm text-success">{success}</p>}
    </BentoCard>
  );
}
