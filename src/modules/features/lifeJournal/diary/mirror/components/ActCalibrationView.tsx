import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button, TextArea } from '@/design-system';
import { mirrorFeeling } from '../constants/vivirSteps';
import {
  fetchSpeglingsMirror,
  speglingsMirrorFailureCode,
} from '../api/speglingsCoachService';

interface Props {
  feeling: string;
  journalMood?: string;
  onFeelingChange: (v: string) => void;
  onContinue: () => void;
}

const FALLBACK_MIRROR =
  'Det du känner är begripligt. Jag fixar inget här — bara spegling.';

function toSafeString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function toMirrorDisplay(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value == null) return '';
  return String(value);
}

function localMirrorFallback(feeling: unknown): string {
  try {
    const text = mirrorFeeling(feeling);
    return text.trim() || FALLBACK_MIRROR;
  } catch {
    return FALLBACK_MIRROR;
  }
}

export function ActCalibrationView({ feeling, journalMood, onFeelingChange, onContinue }: Props) {
  const [mirrored, setMirrored] = useState(false);
  const [mirrorText, setMirrorText] = useState('');
  const [usedAi, setUsedAi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mirrorHint, setMirrorHint] = useState<string | null>(null);

  const safeFeeling = toSafeString(feeling);
  const safeMood = toSafeString(journalMood);

  const handleMirror = async () => {
    const trimmed = safeFeeling.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setMirrorHint(null);
    setMirrored(false);

    try {
      const mood = safeMood.trim() || undefined;
      const aiMirror = await fetchSpeglingsMirror(trimmed, mood);
      const display = toMirrorDisplay(aiMirror).trim();
      if (!display) throw new Error('empty_mirror');
      setMirrorText(display);
      setUsedAi(true);
    } catch (err) {
      console.warn('[Speglar] speglingsMirror — lokal fallback', err);
      setMirrorText(localMirrorFallback(trimmed));
      setUsedAi(false);
      if (speglingsMirrorFailureCode(err) === 'unauthenticated') {
        setMirrorHint(
          'Logga in via Konto (uppe till höger) för AI-spegling. Lokal spegling visas till höger.',
        );
      } else {
        setMirrorHint('AI otillgänglig just nu — lokal spegling visas till höger.');
      }
    } finally {
      setMirrored(true);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-widest text-accent">ACT — Validera, aldrig fixa</p>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="glass-card p-3">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-text-dim">Känsla nu</p>
          <TextArea
            value={safeFeeling}
            onChange={(e) => {
              onFeelingChange(e.target.value);
              setMirrored(false);
              setMirrorText('');
              setMirrorHint(null);
            }}
            placeholder="Vad känner du just nu?"
            rows={4}
            className="input-glass neu-inset resize-none rounded-lg p-3"
          />
          <Button
            type="button"
            variant="secondary"
            className="mt-2 inline-flex items-center gap-2"
            onClick={() => void handleMirror()}
            disabled={!safeFeeling.trim() || loading}
          >
            {loading ? (
              <span
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                aria-hidden
              />
            ) : null}
            {loading ? 'Spegling…' : 'Spegla'}
          </Button>
        </div>

        <div className={`glass-card p-3 ${usedAi ? 'glass-card--ai border-accent-ai/30' : 'border-accent/20'}`}>
          <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-text-dim">
            Spegling
            {usedAi ? <span className="text-accent-ai">AI</span> : null}
          </p>
          {mirrored ? (
            <>
              <p className="text-sm leading-relaxed text-text-muted">{toMirrorDisplay(mirrorText)}</p>
              <Button
                type="button"
                variant="accent"
                className="mt-4 inline-flex w-full items-center justify-center gap-2"
                onClick={onContinue}
              >
                Fortsätt till VIVIR
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Button>
            </>
          ) : (
            <p className="text-sm text-text-muted">
              Skriv hur det känns och tryck Spegla — jag fixar inget här.
            </p>
          )}
        </div>
      </div>

      {mirrorHint ? <p className="text-xs text-text-dim">{mirrorHint}</p> : null}
    </div>
  );
}
