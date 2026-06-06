import { useEffect, useState } from 'react';
import { Heart, MessageCircle, Smile, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useStore } from '@/core/store';
import { saveBarnportenLog } from '../api/saveBarnportenLog';
import { useBarnportenOfflineFlush } from '../hooks/useBarnportenOfflineFlush';
import { useBarnportenPairClaim } from '../hooks/useBarnportenPairClaim';
import { BARNPORTEN_AGENTS } from '../constants/barnportenAgents';
import { resolveBarnportenChildAlias, isBarnportenDeviceLinked } from '../constants/barnportenDeviceId';
import { BarnportenWidget } from './BarnportenWidget';

/** Barn-PWA hub — `/barnporten` (silo 3, ingen Valv-RAG). */
export function BarnportenPage() {
  const user = useStore((s) => s.user);
  const [activeChild, setActiveChild] = useState(() => resolveBarnportenChildAlias());
  const pairState = useBarnportenPairClaim();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (pairState.phase === 'done') setActiveChild(pairState.childAlias);
  }, [pairState]);

  useBarnportenOfflineFlush(user?.uid);

  const postLog = async (
    kind: 'message' | 'mood' | 'private',
    observation: string,
    label: string,
    urgent = false,
  ) => {
    if (!user) {
      setStatus('Be pappa/mamma logga in på sin telefon först.');
      return;
    }
    setSaving(true);
    setStatus(null);
    try {
      const result = await saveBarnportenLog(user.uid, {
        childAlias: activeChild,
        observation: `[Barnporten · ${label}] ${observation}`,
        kind,
        contentType: kind === 'mood' ? 'mood' : 'text',
        urgent,
      });
      setStatus(
        result.queued
          ? 'Sparat lokalt — skickas när nätet är tillbaka.'
          : urgent
            ? 'Skickat — pappa ser “Granska i Valv?”'
            : 'Skickat till pappas inkorg.',
      );
      setMessage('');
    } catch {
      setStatus('Kunde inte spara just nu. Försök igen om en stund.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1410] to-[#0a1614] px-4 py-8 text-text">
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-widest text-accent/80">Barnporten</p>
        <h1 className="mt-1 text-2xl font-semibold text-accent-light">Din trygga hamn</h1>
        {isBarnportenDeviceLinked() ? (
          <p className="mt-2 text-xs text-text-dim">Kopplad enhet · {activeChild}</p>
        ) : (
          <p className="mt-2 text-xs text-text-dim">Be pappa skanna QR under Familjen → Barnporten.</p>
        )}
      </header>

      {pairState.phase === 'working' ? (
        <p className="mb-4 flex items-center justify-center gap-2 text-sm text-accent">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Kopplar enhet…
        </p>
      ) : null}
      {pairState.phase === 'done' ? (
        <p className="mb-4 text-center text-sm text-success">
          Enhet kopplad till {pairState.childAlias}.
        </p>
      ) : null}
      {pairState.phase === 'error' ? (
        <p className="mb-4 text-center text-sm text-danger">{pairState.message}</p>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={saving}
          className="elongated-module flex flex-col items-center gap-2 p-4"
          onClick={() => {
            const text = window.prompt('Vad vill du säga?', '') ?? '';
            if (text.trim()) void postLog('message', text.trim(), 'prata');
          }}
        >
          <MessageCircle className="h-8 w-8 text-accent" />
          <span className="text-sm">Prata</span>
        </button>
        <button
          type="button"
          disabled={saving || !message.trim()}
          className="elongated-module flex flex-col items-center gap-2 p-4"
          onClick={() => void postLog('message', message.trim(), 'skriv')}
        >
          <Heart className="h-8 w-8 text-accent" />
          <span className="text-sm">Skriv till pappa</span>
        </button>
        <button
          type="button"
          disabled={saving}
          className="elongated-module flex flex-col items-center gap-2 p-4"
          onClick={() => {
            const mood = window.prompt('Humör 1–5:', '3') ?? '3';
            void postLog('mood', `Humör: ${mood}`, 'humor');
          }}
        >
          <Smile className="h-8 w-8 text-accent" />
          <span className="text-sm">Humör</span>
        </button>
        <button
          type="button"
          disabled={saving}
          className="elongated-module flex flex-col items-center gap-2 p-4"
          onClick={() => {
            const text = window.prompt('Bara för mig (privat):', '') ?? '';
            if (text.trim()) void postLog('private', text.trim(), 'privat');
          }}
        >
          <Lock className="h-8 w-8 text-accent" />
          <span className="text-sm">Bara för mig</span>
        </button>
      </div>

      <button
        type="button"
        disabled={saving}
        className="btn-pill--secondary mt-4 flex w-full items-center justify-center gap-2 text-sm"
        onClick={() => {
          const text = window.prompt('Allvarligt — behöver prata med pappa:', '') ?? '';
          if (text.trim()) void postLog('message', text.trim(), 'allvarligt', true);
        }}
      >
        <AlertCircle className="h-4 w-4" aria-hidden />
        Allvarligt / trygg vuxen
      </button>

      <textarea
        className="input-glass mt-4 w-full text-sm"
        rows={3}
        placeholder="Skriv till pappa här…"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {status && <p className="mt-3 text-center text-sm text-accent">{status}</p>}

      <details className="mt-8 rounded-xl border border-white/10 p-3 text-xs text-text-muted">
        <summary className="cursor-pointer text-accent">Assistentinfo</summary>
        <ul className="mt-2 space-y-1">
          {BARNPORTEN_AGENTS.map((a) => (
            <li key={a.id}>
              <strong>{a.name}</strong> — {a.focus}
            </li>
          ))}
        </ul>
      </details>

      <BarnportenWidget childAlias={activeChild} />
    </div>
  );
}
