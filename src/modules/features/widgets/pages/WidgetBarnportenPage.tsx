import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthGate } from '@/core/auth/AuthGate';
import { useStore } from '@/core/store';
import { BarnportenWidget } from '@/features/onboarding/barnporten/components/BarnportenWidget';
import { saveBarnportenLog } from '@/features/onboarding/barnporten/api/saveBarnportenLog';
import { WidgetShell } from '../layout/WidgetShell';

const DEFAULT_CHILD = 'Kasper';

function WidgetBarnportenInner() {
  const user = useStore((s) => s.user);
  const [searchParams] = useSearchParams();
  const quick = searchParams.get('quick') === '1';
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (quick) textareaRef.current?.focus();
  }, [quick]);

  const handleSave = async () => {
    if (!user || !text.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await saveBarnportenLog(user.uid, {
        childAlias: DEFAULT_CHILD,
        observation: text.trim(),
        kind: 'quick_widget',
        contentType: 'text',
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
    <>
      <WidgetShell
        title="Barnporten"
        lead="Snabb avsig — skickas till pappas inkorg (inte Valv automatiskt)."
      >
        {done ? (
          <div className="elongated-module elongated-module--gold p-4">
            <p className="text-sm text-success">Skickat till pappas inkorg.</p>
            <Link to="/barnporten" className="btn-pill--accent mt-3 inline-flex text-xs">
              Öppna Barnporten
            </Link>
            <button
              type="button"
              className="btn-pill--ghost mt-2 w-full text-xs"
              onClick={() => setDone(false)}
            >
              Ny rad
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="input-glass w-full text-sm"
              placeholder="Skriv här…"
            />
            <button
              type="button"
              disabled={saving || !text.trim()}
              className="btn-pill--accent w-full"
              onClick={() => void handleSave()}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Skicka till pappa'}
            </button>
            {error && <p className="text-sm text-danger">{error}</p>}
            <Link to="/barnporten" className="btn-pill--ghost block w-full text-center text-xs">
              Hela Barnporten
            </Link>
          </div>
        )}
      </WidgetShell>
      <BarnportenWidget />
    </>
  );
}

export function WidgetBarnportenPage() {
  return (
    <AuthGate>
      <WidgetBarnportenInner />
    </AuthGate>
  );
}
