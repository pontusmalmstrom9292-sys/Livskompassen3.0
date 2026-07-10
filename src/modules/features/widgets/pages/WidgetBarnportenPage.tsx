import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, ButtonLink, TextArea } from '@/design-system';
import { Loader2 } from 'lucide-react';
import { AuthGate } from '@/core/auth/AuthGate';
import { useStore } from '@/core/store';
import { BarnportenWidget } from '@/features/onboarding/barnporten/components/BarnportenWidget';
import { saveBarnportenLog } from '@/features/onboarding/barnporten/api/saveBarnportenLog';
import { BARNPORTEN_WIDGET_VARIANTS } from '@/features/onboarding/barnporten/constants/barnportenWidgetVariant';
import { useBarnportenWidgetVariant } from '@/features/onboarding/barnporten/hooks/useBarnportenWidgetVariant';
import { resolveBarnportenChildAlias } from '@/features/onboarding/barnporten/constants/barnportenDeviceId';
import { useBarnportenOfflineFlush } from '@/features/onboarding/barnporten/hooks/useBarnportenOfflineFlush';
import { WidgetShell } from '../layout/WidgetShell';

function WidgetBarnportenInner() {
  const user = useStore((s) => s.user);
  useBarnportenOfflineFlush(user?.uid);
  const [searchParams] = useSearchParams();
  const { variant, setVariant } = useBarnportenWidgetVariant();
  const quick = searchParams.get('quick') === '1';
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [queued, setQueued] = useState(false);
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
      const result = await saveBarnportenLog(user.uid, {
        childAlias: resolveBarnportenChildAlias(),
        observation: text.trim(),
        kind: 'quick_widget',
        contentType: 'text',
      });
      setQueued(result.queued);
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
        lead="Snabb sändning — hamnar i pappas inkorg (inte i Valv automatiskt)."
      >
        {done ? (
          <div className="elongated-module elongated-module--gold overflow-hidden p-4">
            <p className="text-sm text-success">
              {queued ? 'Köad — synkas när nätet finns.' : 'Skickat till pappas inkorg.'}
            </p>
            <ButtonLink to="/barnporten" variant="accent" className="mt-3 inline-flex text-xs">
              Öppna Barnporten
            </ButtonLink>
            <Button type="button" variant="ghost" className="mt-2 w-full text-xs" onClick={() => setDone(false)}>
              Ny rad
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <TextArea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="input-glass neu-inset w-full resize-none text-sm"
              placeholder="Skriv här…"
            />
            <Button
              type="button"
              variant="accent"
              disabled={saving || !text.trim()}
              className="w-full"
              onClick={() => void handleSave()}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Skicka till pappa'}
            </Button>
            {error && <p className="text-sm text-danger">{error}</p>}
            <fieldset className="space-y-2 rounded-xl border border-amber-400/15 p-3">
              <legend className="px-1 text-[10px] uppercase tracking-widest text-text-dim">
                Widget på den här enheten
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {BARNPORTEN_WIDGET_VARIANTS.map((row) => (
                  <Button
                    key={row.id}
                    type="button"
                    variant={variant === row.id ? 'accent' : 'ghost'}
                    className="w-full text-left text-xs"
                    aria-pressed={variant === row.id}
                    onClick={() => setVariant(row.id)}
                  >
                    <span className="block font-medium">{row.label}</span>
                    <span className="block text-[10px] opacity-80">{row.hint}</span>
                  </Button>
                ))}
              </div>
            </fieldset>
            <ButtonLink to="/barnporten" variant="ghost" className="block w-full text-center text-xs">
              Hela Barnporten
            </ButtonLink>
          </div>
        )}
      </WidgetShell>
      <BarnportenWidget variant={variant} />
    </>
  );
}

export function WidgetBarnportenPage() {
  return (
    <AuthGate variant="widget">
      <WidgetBarnportenInner />
    </AuthGate>
  );
}
