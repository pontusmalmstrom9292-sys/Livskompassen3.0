import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Lock } from 'lucide-react';
import { AuthGate } from '../../core/auth/AuthGate';
import { saveVaultLog } from '../../core/firebase/firestore';
import { useStore } from '../../core/store';
import { WidgetShell } from '../layout/WidgetShell';

function WidgetNoteInner() {
  const user = useStore((s) => s.user);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!user || !text.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const stamp = new Date().toISOString();
      await saveVaultLog(user.uid, {
        action: 'widget_anteckning',
        category: 'snabblogg',
        truth: `ANTECKNING ${stamp}\n\n${text.trim()}`,
        entryType: 'simple',
      });
      setDone(true);
      setText('');
    } catch {
      setError('Kunde inte spara.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <WidgetShell title="Snabbanteckning" lead="En rad → låses i Valvet.">
      {done ? (
        <div className="elongated-module elongated-module--gold p-4">
          <p className="flex items-center gap-2 text-sm text-success">
            <Lock className="h-4 w-4" /> Sparat
          </p>
          <Link to="/dagbok?tab=bevis" className="btn-pill--accent mt-3 inline-flex text-xs">
            Öppna Valv
          </Link>
          <button type="button" className="btn-pill--ghost mt-2 w-full text-xs" onClick={() => setDone(false)}>
            Ny anteckning
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="input-glass w-full text-sm"
            placeholder="Fakta eller observation…"
          />
          <button
            type="button"
            disabled={saving || !text.trim()}
            className="btn-pill--accent w-full"
            onClick={() => void handleSave()}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Lås i Valvet'}
          </button>
          {error && <p className="text-sm text-danger">{error}</p>}
        </div>
      )}
    </WidgetShell>
  );
}

export function WidgetNotePage() {
  return (
    <AuthGate>
      <WidgetNoteInner />
    </AuthGate>
  );
}
