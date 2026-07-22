import { useCallback, useState } from 'react';
import { TextArea } from '@/design-system';
import { Loader2 } from 'lucide-react';
import { AuthGate } from '@/core/auth/AuthGate';
import { saveChildrenLog } from '@/core/firebase/firestore';
import { useStore } from '@/core/store';
import { CHILD_ALIASES, type ChildAlias } from '@/features/family/children/constants';
import { WidgetShell } from '../layout/WidgetShell';
import { WidgetSuccessCard } from '../components/WidgetSuccessCard';
import { WidgetButton } from '../components/WidgetButton';
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
        channel: 'widget',
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
        <WidgetSuccessCard
          message={`Sparat till ${child}s logg`}
          actionLabel="Ny rad"
          onAction={resetForm}
        />
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            {CHILD_ALIASES.map((alias) => (
              <WidgetButton
                key={alias}
                type="button"
                variant={child === alias ? 'accent' : 'ghost'}
                className="flex-1 text-xs min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                onClick={() => setChild(alias)}
              >
                {alias}
              </WidgetButton>
            ))}
          </div>
          <TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="input-glass neu-inset w-full resize-none text-sm"
            placeholder="Kort observation…"
          />
          <WidgetButton
            type="button"
            variant="accent"
            fullWidth
            disabled={saving || !text.trim()}
            onClick={() => void handleSave()}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : `Spara till ${child}s logg`}
          </WidgetButton>
          {error && <p className="text-sm text-danger">{error}</p>}
        </div>
      )}
    </WidgetShell>
  );
}

export function WidgetFamiljenPage() {
  return (
    <AuthGate variant="widget" widgetTitle="Barnobs">
      <WidgetFamiljenInner />
    </AuthGate>
  );
}
