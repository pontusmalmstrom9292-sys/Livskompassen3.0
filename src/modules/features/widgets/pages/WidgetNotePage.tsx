import { useCallback, useState } from 'react';
import { TextArea } from '@/design-system';
import { Loader2, Lock } from 'lucide-react';
import { ChameleonInputShell } from '@/core/ui/ChameleonInputShell';
import { AuthGate } from '@/core/auth/AuthGate';
import { canAccessSensitiveFirestoreSilo, SENSITIVE_SILO_LOGIN_MESSAGE } from '@/core/auth/requireEmailAuth';
import { resolveFirestorePermissionMessage } from '@/core/firebase/firestorePermissionMessage';
import { useStore } from '@/core/store';
import { CHILD_ALIASES, type ChildAlias } from '@/features/family/children/constants';
import { WidgetShell } from '../layout/WidgetShell';
import { WidgetButton } from '../components/WidgetButton';
import { WidgetSuccessCard } from '../components/WidgetSuccessCard';
import { WidgetSiloChipPicker, persistWidgetSilo, readStoredWidgetSilo } from '../components/WidgetSiloChipPicker';
import { saveWidgetTextCapture } from '../api/widgetSiloCapture';
import { widgetSiloDoneCopy, widgetSiloSaveLabel, type WidgetSiloId } from '../config/widgetSiloConfig';
import { useWidgetShellClear } from '../context/widgetShellContext';

type NoteMode = 'silo' | 'compose';

function WidgetNoteInner() {
  const user = useStore((s) => s.user);
  const [noteMode, setNoteMode] = useState<NoteMode>('silo');
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
    setNoteMode('silo');
  }, []);

  useWidgetShellClear(resetForm);

  const handleSiloChange = (next: WidgetSiloId) => {
    setSilo(next);
    persistWidgetSilo(next);
  };

  const handleSave = async () => {
    if (!user || !text.trim()) return;
    if (silo === 'dagbok' && !canAccessSensitiveFirestoreSilo(user)) {
      setError(SENSITIVE_SILO_LOGIN_MESSAGE);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await saveWidgetTextCapture(user.uid, silo, text, { childAlias: child });
      setDoneSilo(silo);
      setText('');
      setNoteMode('silo');
    } catch (err) {
      setError(resolveFirestorePermissionMessage(err) ?? 'Kunde inte spara.');
    } finally {
      setSaving(false);
    }
  };

  const doneCopy = doneSilo ? widgetSiloDoneCopy(doneSilo, child) : null;

  return (
    <WidgetShell title="Snabbanteckning" lead="Välj silo — default Inkast (inte auto-Valv).">
      {doneCopy ? (
        <WidgetSuccessCard
          message={doneCopy.message}
          icon={doneSilo === 'bevis' ? Lock : undefined}
          actionLabel="Ny anteckning"
          onAction={resetForm}
        />
      ) : (
        <ChameleonInputShell mode={noteMode} className="widget-note-chameleon">
          {(mode) =>
            mode === 'silo' ? (
              <div className="space-y-4">
                <WidgetSiloChipPicker value={silo} onChange={handleSiloChange} />
                <WidgetButton type="button" variant="accent" fullWidth onClick={() => setNoteMode('compose')}>
                  Fortsätt till text
                </WidgetButton>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="widget-note-mode-row">
                  <WidgetButton type="button" variant="ghost" className="text-xs min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" onClick={() => setNoteMode('silo')}>
                    Byt silo
                  </WidgetButton>
                  <span className="self-center text-[10px] uppercase tracking-widest text-text-muted">
                    {widgetSiloSaveLabel(silo).replace('Spara till ', '')}
                  </span>
                </div>
                {silo === 'barn' ? (
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
                ) : null}
                <TextArea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  className="input-glass neu-inset w-full resize-none text-sm"
                  placeholder="Fakta, observation eller tanke…"
                  autoFocus
                />
                <WidgetButton
                  type="button"
                  variant="accent"
                  fullWidth
                  disabled={saving || !text.trim()}
                  onClick={() => void handleSave()}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : widgetSiloSaveLabel(silo)}
                </WidgetButton>
                {error && <p className="text-sm text-danger">{error}</p>}
              </div>
            )
          }
        </ChameleonInputShell>
      )}
    </WidgetShell>
  );
}

export function WidgetNotePage() {
  return (
    <AuthGate variant="widget" widgetTitle="Snabbanteckning">
      <WidgetNoteInner />
    </AuthGate>
  );
}
