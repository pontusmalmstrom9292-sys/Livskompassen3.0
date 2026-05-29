import { useState } from 'react';
import { Heart, MessageCircle, Smile, Lock } from 'lucide-react';
import { saveChildrenLog } from '../../core/firebase/firestore';
import { useStore } from '../../core/store';
import { BARNPORTEN_AGENTS } from '../constants/barnportenAgents';

const DEFAULT_CHILD = 'Kasper';

/** Barn-PWA hub — `/barnporten` (silo 3, ingen Valv-RAG). */
export function BarnportenPage() {
  const user = useStore((s) => s.user);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const postLog = async (kind: string, observation: string, category: string) => {
    if (!user) {
      setStatus('Be pappa/mamma logga in på sin telefon först.');
      return;
    }
    setSaving(true);
    setStatus(null);
    try {
      await saveChildrenLog(user.uid, {
        childAlias: DEFAULT_CHILD,
        observation: `[Barnporten · ${kind}] ${observation}`,
        category,
        action: 'livslogg',
      });
      setStatus('Skickat till pappas inkorg.');
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
      </header>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={saving}
          className="elongated-module flex flex-col items-center gap-2 p-4"
          onClick={() => {
            const text = window.prompt('Vad vill du säga?', '') ?? '';
            if (text.trim()) void postLog('prata', text.trim(), 'barnporten');
          }}
        >
          <MessageCircle className="h-8 w-8 text-accent" />
          <span className="text-sm">Prata</span>
        </button>
        <button
          type="button"
          disabled={saving || !message.trim()}
          className="elongated-module flex flex-col items-center gap-2 p-4"
          onClick={() => void postLog('skriv', message.trim(), 'barnporten')}
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
            void postLog('humor', `Humör: ${mood}`, 'barnporten');
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
            if (text.trim()) void postLog('privat', text.trim(), 'barnporten_privat');
          }}
        >
          <Lock className="h-8 w-8 text-accent" />
          <span className="text-sm">Bara för mig</span>
        </button>
      </div>

      <textarea
        className="input-glass mt-4 w-full text-sm"
        rows={3}
        placeholder="Skriv till pappa här…"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {status && <p className="mt-3 text-center text-sm text-accent">{status}</p>}

      <details className="mt-8 rounded-xl border border-white/10 p-3 text-xs text-text-muted">
        <summary className="cursor-pointer text-accent">Barn-Orkester</summary>
        <ul className="mt-2 space-y-1">
          {BARNPORTEN_AGENTS.map((a) => (
            <li key={a.id}>
              <strong>{a.name}</strong> — {a.focus}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
