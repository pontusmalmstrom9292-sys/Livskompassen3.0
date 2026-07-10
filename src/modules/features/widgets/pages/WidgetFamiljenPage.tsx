import { useCallback, useState } from 'react';
import { Button, ButtonLink, TextArea } from '@/design-system';
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
        <div className="elongated-module elongated-module--gold overflow-hidden p-4">
          <p className="text-sm text-success">Sparat till {child}s logg</p>
          <ButtonLink to="/familjen" variant="accent" className="mt-3 inline-flex text-xs">
            Öppna Familjen
          </ButtonLink>
          <Button type="button" variant="ghost" className="mt-2 w-full text-xs" onClick={resetForm}>
            Ny rad
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            {CHILD_ALIASES.map((alias) => (
              <Button
                key={alias}
                type="button"
                variant={child === alias ? 'accent' : 'ghost'}
                className="flex-1 text-xs"
                onClick={() => setChild(alias)}
              >
                {alias}
              </Button>
            ))}
          </div>
          <TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="input-glass neu-inset w-full resize-none text-sm"
            placeholder="Kort observation…"
          />
          <Button
            type="button"
            variant="accent"
            disabled={saving || !text.trim()}
            className="w-full"
            onClick={() => void handleSave()}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : `Spara till ${child}s logg`}
          </Button>
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
