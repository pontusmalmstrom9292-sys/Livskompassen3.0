import { useCallback, useState } from 'react';
import { Button, ButtonLink, TextArea } from '@/design-system';
import { Loader2, Lock } from 'lucide-react';
import { AuthGate } from '@/core/auth/AuthGate';
import { useStore } from '@/core/store';
import { CHILD_ALIASES, type ChildAlias } from '@/features/family/children/constants';
import { WidgetShell } from '../layout/WidgetShell';
import { WidgetSiloChipPicker, persistWidgetSilo, readStoredWidgetSilo } from '../components/WidgetSiloChipPicker';
import { saveWidgetTextCapture } from '../api/widgetSiloCapture';
import {
  widgetSiloDoneCopy,
  widgetSiloSaveLabel,
  type WidgetSiloId,
} from '../config/widgetSiloConfig';
import { useWidgetShellClear } from '../context/widgetShellContext';

function WidgetNoteInner() {
  const user = useStore((s) => s.user);
  const [text, setText] = useState('');
  const [silo, setSilo] = useState<WidgetSiloId>(() => readStoredWidgetSilo());
  const [child, setChild] = useState<ChildAlias>('Kasper');
  const [saving, setSaving] = useState(false);
  const [doneSilo, setDoneSilo] = useState<WidgetSiloId | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setText('');
    setDoneSilo(null);
    setError(null);
  }, []);

  useWidgetShellClear(resetForm);

  const handleSiloChange = (next: WidgetSiloId) => {
    setSilo(next);
    persistWidgetSilo(next);
  };

  const handleSave = async () => {
    if (!user || !text.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await saveWidgetTextCapture(user.uid, silo, text, { childAlias: child });
      setDoneSilo(silo);
      setText('');
    } catch {
      setError('Kunde inte spara.');
    } finally {
      setSaving(false);
    }
  };

  const doneCopy = doneSilo ? widgetSiloDoneCopy(doneSilo, child) : null;

  return (
    <WidgetShell title="Snabbanteckning" lead="Välj silo — default Inkast (inte auto-Valv).">
      {doneCopy ? (
        <div className="elongated-module elongated-module--gold overflow-hidden p-4">
          <p className="flex items-center gap-2 text-sm text-success">
            {doneSilo === 'bevis' ? <Lock className="h-4 w-4" /> : null}
            {doneCopy.message}
          </p>
          <ButtonLink to={doneCopy.linkTo} variant="accent" className="mt-3 inline-flex text-xs">
            {doneCopy.linkLabel}
          </ButtonLink>
          <Button type="button" variant="ghost" className="mt-2 w-full text-xs" onClick={resetForm}>
            Ny anteckning
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <WidgetSiloChipPicker value={silo} onChange={handleSiloChange} />
          {silo === 'barn' ? (
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
          ) : null}
          <TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="input-glass neu-inset w-full resize-none text-sm"
            placeholder="Fakta, observation eller tanke…"
          />
          <Button
            type="button"
            variant="accent"
            disabled={saving || !text.trim()}
            className="w-full"
            onClick={() => void handleSave()}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : widgetSiloSaveLabel(silo)}
          </Button>
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
