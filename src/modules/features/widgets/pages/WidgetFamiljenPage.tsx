import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthGate } from '@/core/auth/AuthGate';
import { saveChildrenLog } from '@/core/firebase/firestore';
import { useStore } from '@/core/store';
import { CHILD_ALIASES, type ChildAlias } from '@/features/family/children/constants';
import { WidgetShell } from '../layout/WidgetShell';
import { useWidgetShellClear } from '../context/widgetShellContext';

function WidgetFamiljenInner() {
  const user = useStore((s) => s.user);
  const [child, setChild] = useState<ChildAlias>('Kasper');
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setText('');
    setDone(false);
    setError(null);
  }, []);

  useWidgetShellClear(resetForm);

  const handleSave = async () => {
    if (!user || !text.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await saveChildrenLog(user.uid, {
        childAlias: child,
        observation: text.trim(),
        category: 'widget_snabb',
        action: 'livslogg',
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
    <WidgetShell title="Barnobs" lead="Neutral rad → barnlogg (inte Valv automatiskt).">
      {done ? (
        <div className="elongated-module elongated-module--gold p-4">
          <p className="text-sm text-success">Sparat till {child}s logg</p>
          <Link to="/familjen" className="ds-btn ds-btn--accent mt-3 inline-flex text-xs">
            Öppna Familjen
          </Link>
          <button
            type="button"
            className="ds-btn ds-btn--ghost mt-2 w-full text-xs"
            onClick={resetForm}
          >
            Ny rad
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            {CHILD_ALIASES.map((alias) => (
              <button
                key={alias}
                type="button"
                className={child === alias ? 'ds-btn ds-btn--accent flex-1 text-xs' : 'ds-btn ds-btn--ghost flex-1 text-xs'}
                onClick={() => setChild(alias)}
              >
                {alias}
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="input-glass w-full text-sm"
            placeholder="Kort observation…"
          />
          <button
            type="button"
            disabled={saving || !text.trim()}
            className="ds-btn ds-btn--accent w-full"
            onClick={() => void handleSave()}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : `Spara till ${child}s logg`}
          </button>
          {error && <p className="text-sm text-danger">{error}</p>}
        </div>
      )}
    </WidgetShell>
  );
}

export function WidgetFamiljenPage() {
  return (
    <AuthGate>
      <WidgetFamiljenInner />
    </AuthGate>
  );
}
